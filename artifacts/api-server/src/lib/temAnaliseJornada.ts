import {
  analiseTracoTable,
  analiseTemperamento40Table,
  analiseLinguagensAmorTable,
  avaliacoesTable,
  usuariosTable,
} from "@workspace/db/schema";
import { and, eq, isNull } from "drizzle-orm";

type DbLike = {
  select: (fields: unknown) => {
    from: (table: unknown) => {
      where: (condition: unknown) => {
        limit: (n: number) => Promise<unknown[]>;
      };
    };
  };
};

/** Indica se o utilizador concluiu a análise do módulo (sempre perfil «Eu» quando há pessoaId). */
export async function temAnalise(
  usuarioId: number,
  slug: string,
  database?: DbLike,
): Promise<boolean> {
  const dbConn = database ?? (await import("@workspace/db")).db;

  switch (slug) {
    case "traco": {
      const [r] = await dbConn
        .select({ id: analiseTracoTable.id })
        .from(analiseTracoTable)
        .where(
          and(
            eq(analiseTracoTable.usuarioId, usuarioId),
            isNull(analiseTracoTable.pessoaId),
          ),
        )
        .limit(1);
      return !!r;
    }
    case "temperamento": {
      const [r] = await dbConn
        .select({ id: analiseTemperamento40Table.id })
        .from(analiseTemperamento40Table)
        .where(eq(analiseTemperamento40Table.usuarioId, usuarioId))
        .limit(1);
      return !!r;
    }
    case "linguagens-amor": {
      const [r] = await dbConn
        .select({ id: analiseLinguagensAmorTable.id })
        .from(analiseLinguagensAmorTable)
        .where(
          and(
            eq(analiseLinguagensAmorTable.usuarioId, usuarioId),
            isNull(analiseLinguagensAmorTable.pessoaId),
          ),
        )
        .limit(1);
      return !!r;
    }
    case "roda": {
      const [r] = await dbConn
        .select({ id: avaliacoesTable.id })
        .from(avaliacoesTable)
        .where(eq(avaliacoesTable.usuarioId, usuarioId))
        .limit(1);
      return !!r;
    }
    case "numerologia": {
      const [r] = await dbConn
        .select({ dataNascimento: usuariosTable.dataNascimento })
        .from(usuariosTable)
        .where(eq(usuariosTable.id, usuarioId))
        .limit(1);
      return !!r?.dataNascimento;
    }
    default:
      return false;
  }
}
