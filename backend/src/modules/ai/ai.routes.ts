import { Router } from "express";
import { AiController } from "./ai.controller";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { askAiSchema } from "./ai.schema";

const router = Router();
const aiController = new AiController();

router.post("/ask", validateRequest(askAiSchema), aiController.askAI);

export default router;
