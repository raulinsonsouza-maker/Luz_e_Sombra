import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import avaliacoesRouter from "./avaliacoes";
import usuariosRouter from "./usuarios";
import tracoRouter from "./traco";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/avaliacoes", avaliacoesRouter);
router.use("/usuarios", usuariosRouter);
router.use("/traco", tracoRouter);

export default router;
