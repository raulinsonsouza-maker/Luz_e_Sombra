import bcrypt from "bcryptjs";
import { db, usuariosTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const IS_PROD = process.env.NODE_ENV === "production";

export async function seedAdminIfNeeded(): Promise<void> {
  try {
    const [existing] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.isAdmin, true))
      .limit(1);

    if (existing) {
      logger.info("Admin user already exists, skipping seed.");
      return;
    }

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      if (IS_PROD) {
        logger.error(
          "No admin user exists and ADMIN_PASSWORD env var is not set. " +
          "Set ADMIN_PASSWORD to bootstrap the first admin account."
        );
        return;
      }
      // In development, use a clearly-temporary default and warn loudly
      logger.warn(
        "⚠️  DEVELOPMENT ONLY: Creating admin user with default password 'admin123'. " +
        "Set ADMIN_PASSWORD env var to use a custom password. " +
        "NEVER use this default in production."
      );
    }

    const password = adminPassword || "admin123";
    const senhaHash = await bcrypt.hash(password, 10);

    await db.insert(usuariosTable).values({
      username: adminUsername,
      senha: senhaHash,
      nome: process.env.ADMIN_NOME || "Administrador",
      email: null,
      isAdmin: true,
      ativo: true,
      primeiroAcesso: false,
    }).onConflictDoNothing();

    logger.info(
      { username: adminUsername },
      `Bootstrap: admin user '${adminUsername}' created. Change the password after first login.`
    );
  } catch (err) {
    logger.error({ err }, "Failed to seed admin user — server will still start.");
  }
}
