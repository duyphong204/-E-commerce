import { Request, Response } from "express";
import { AiService } from "./ai.service";
import { catchAsync } from "../../common/utils/catchAsync";

export class AiController {
  private aiService: AiService;

  constructor() {
    this.aiService = new AiService();
  }

  askAI = catchAsync(async (req: Request, res: Response) => {
    const { message } = req.body;
    const reply = await this.aiService.askAI(message);
    return res.status(200).json({ reply });
  });
}
