import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import avaliacoesRouter from "./avaliacoes";
import usuariosRouter from "./usuarios";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/avaliacoes", avaliacoesRouter);
router.use("/usuarios", usuariosRouter);

export default router;
