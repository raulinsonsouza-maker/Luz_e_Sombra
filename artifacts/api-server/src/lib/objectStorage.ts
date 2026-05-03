import path from "node:path";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import {
  ObjectAclPolicy,
  ObjectPermission,
} from "./objectAcl";

type PendingUpload = {
  token: string;
  objectPath: string;
  expiresAt: number;
};

const uploadTokens = new Map<string, PendingUpload>();
const UPLOAD_TOKEN_TTL_MS = 15 * 60 * 1000;
const OBJECTS_PREFIX = "/objects/";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  private getStorageRootDir(): string {
    const configured = process.env.OBJECT_STORAGE_DIR;
    return path.resolve(configured || "storage");
  }

  private cleanupExpiredUploadTokens(): void {
    const now = Date.now();
    for (const [uploadId, pending] of uploadTokens.entries()) {
      if (pending.expiresAt <= now) uploadTokens.delete(uploadId);
    }
  }

  private parseObjectPath(objectPath: string): string {
    if (!objectPath.startsWith(OBJECTS_PREFIX)) {
      throw new ObjectNotFoundError();
    }
    const relativePath = objectPath.slice(OBJECTS_PREFIX.length);
    if (!relativePath || relativePath.includes("..")) {
      throw new ObjectNotFoundError();
    }
    return relativePath;
  }

  private async ensureParentDirFor(relativePath: string): Promise<string> {
    const absolutePath = path.join(this.getStorageRootDir(), relativePath);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    return absolutePath;
  }

  async downloadObject(
    objectPath: string,
    cacheTtlSec: number = 3600,
  ): Promise<Response> {
    const relativePath = this.parseObjectPath(objectPath);
    const absolutePath = path.join(this.getStorageRootDir(), relativePath);
    const [buffer, fileStat] = await Promise.all([
      readFile(absolutePath),
      stat(absolutePath),
    ]);
    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
      "Cache-Control": `private, max-age=${cacheTtlSec}`,
      "Content-Length": String(fileStat.size),
    };
    return new Response(buffer, { headers });
  }

  async getObjectEntityUploadURL(): Promise<string> {
    this.cleanupExpiredUploadTokens();
    const uploadId = randomUUID();
    const token = randomUUID();
    const objectPath = `${OBJECTS_PREFIX}uploads/${uploadId}`;
    uploadTokens.set(uploadId, {
      token,
      objectPath,
      expiresAt: Date.now() + UPLOAD_TOKEN_TTL_MS,
    });
    return `/api/uploads/${uploadId}?token=${encodeURIComponent(token)}`;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (rawPath.startsWith("/api/uploads/")) {
      const uploadIdWithQuery = rawPath.replace("/api/uploads/", "");
      const uploadId = uploadIdWithQuery.split("?")[0];
      return `${OBJECTS_PREFIX}uploads/${uploadId}`;
    }
    return rawPath;
  }

  consumeUploadAuthorization(uploadId: string, token: string): string {
    this.cleanupExpiredUploadTokens();
    const pending = uploadTokens.get(uploadId);
    if (!pending) {
      throw new Error("Upload URL inválida ou expirada");
    }
    const left = Buffer.from(token);
    const right = Buffer.from(pending.token);
    const isValid =
      left.length === right.length && timingSafeEqual(left, right);
    if (!isValid) {
      throw new Error("Token de upload inválido");
    }
    uploadTokens.delete(uploadId);
    return pending.objectPath;
  }

  async saveUploadedObject(
    uploadId: string,
    token: string,
    fileBuffer: Buffer,
  ): Promise<string> {
    const objectPath = this.consumeUploadAuthorization(uploadId, token);
    const relativePath = this.parseObjectPath(objectPath);
    const absolutePath = await this.ensureParentDirFor(relativePath);
    await writeFile(absolutePath, fileBuffer);
    return objectPath;
  }

  async getObjectEntityFile(objectPath: string): Promise<string> {
    const exists = await this.objectExists(objectPath);
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectPath;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/objects/")) {
      return normalizedPath;
    }
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: string;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return true;
  }
  async objectExists(objectPath: string): Promise<boolean> {
    try {
      const relativePath = this.parseObjectPath(objectPath);
      await stat(path.join(this.getStorageRootDir(), relativePath));
      return true;
    } catch {
      return false;
    }
  }

  async deleteObject(objectPath: string): Promise<void> {
    const relativePath = this.parseObjectPath(objectPath);
    await unlink(path.join(this.getStorageRootDir(), relativePath)).catch(() => {});
  }
}
