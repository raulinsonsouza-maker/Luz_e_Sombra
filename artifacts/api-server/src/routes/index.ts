import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import avaliacoesRouter from "./avaliacoes";
import usuariosRouter from "./usuarios";
import tracoRouter from "./traco";
import gamificacaoRouter from "./gamificacao";
import comunidadeRouter from "./comunidade";
import cursosRouter from "./cursos";
import notificacoesRouter from "./notificacoes";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/avaliacoes", avaliacoesRouter);
router.use("/usuarios", usuariosRouter);
router.use("/traco", tracoRouter);
router.use("/gamificacao", gamificacaoRouter);
router.use("/comunidade", comunidadeRouter);
router.use("/cursos", cursosRouter);
router.use("/notificacoes", notificacoesRouter);

export default router;
