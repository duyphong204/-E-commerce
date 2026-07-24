import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { AiState, ChatMessage } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface AskAiResponse {
  reply: string;
}

export const sendMessage = createAsyncThunk<string, string>(
  "ai/sendMessage",
  async (message) => {
    const res = await axios.post<AskAiResponse>(`${API_URL}/api/ai/ask`, { message });
    return res.data.reply;
  }
);

const initialState: AiState = {
  messages: [],
  loading: false,
  error: null,
  status: "idle",
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const msg: ChatMessage = { from: "user", text: action.payload, role: "user", content: action.payload };
      state.messages.push(msg);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const msg: ChatMessage = { from: "bot", text: action.payload, role: "assistant", content: action.payload };
        state.messages.push(msg);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
        state.error = "Không thể kết nối tới AI chatbot";
      });
  },
});

export const { addUserMessage, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
