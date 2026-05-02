import bcrypt from "bcryptjs";
import { db, usuariosTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { logger } from "./logger";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NOME = process.env.ADMIN_NOME || "Administrador";

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

    const senhaHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await db.insert(usuariosTable).values({
      username: ADMIN_USERNAME,
      senha: senhaHash,
      nome: ADMIN_NOME,
      email: null,
      isAdmin: true,
      ativo: true,
      primeiroAcesso: false,
    }).onConflictDoNothing();

    logger.info(
      { username: ADMIN_USERNAME },
      `Bootstrap: admin user '${ADMIN_USERNAME}' created. Change the password after first login.`
    );
  } catch (err) {
    logger.error({ err }, "Failed to seed admin user — server will still start.");
  }
}
