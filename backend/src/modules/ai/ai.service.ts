import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiService {
  private model: any;
  private systemPrompt: string;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.systemPrompt = process.env.GEMINI_SYSTEM_PROMPT || "";
  }

  async askAI(message: string): Promise<string> {
    const result = await this.model.generateContent([this.systemPrompt, message]);
    return result.response.text();
  }
}
