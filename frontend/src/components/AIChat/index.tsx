import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { addUserMessage, sendMessage, clearMessages } from "../../redux/slices/aiSlice";
import { MessageCircle, X, Send, Trash2, Bot } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ChatMessage } from "../../types";

const AIChat: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const messages = useAppSelector((state) => state.ai.messages);
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (): void => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendMessage(input));
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-36 md:bottom-28 right-4 sm:right-6 z-50">
      {/* CHAT TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg 
                   bg-gray-950 text-white hover:bg-emerald-600 hover:shadow-emerald-500/10 
                   transition-all duration-300 
                   flex items-center justify-center 
                   overflow-hidden"
        aria-label="Trợ lý AI"
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-full" />

        {/* Green pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400 opacity-25 group-hover:opacity-40"></span>
        )}

        {/* Toggle Icons */}
        {open ? (
          <X className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300" />
        ) : (
          <MessageCircle className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:scale-105" />
        )}
      </button>

      {/* POPUP CHAT WINDOW */}
      {open && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-300 origin-bottom-right">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100/80">
            {/* Header */}
            <div className="bg-gray-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-emerald-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-tight">Trợ lý AI</h3>
                    <p className="text-[10px] text-gray-400 font-bold">Trực tuyến 24/7</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Messages View */}
            <div className="h-64 sm:h-72 overflow-y-auto p-3.5 space-y-3 bg-gray-50/50 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-xs font-semibold italic py-12 px-4 space-y-2">
                  <Bot className="w-8 h-8 text-emerald-500/40 mx-auto" />
                  <p>Xin chào! Mình có thể giúp gì cho bạn hôm nay?</p>
                </div>
              ) : (
                messages.map((m: ChatMessage, i: number) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} animate-fade`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        m.from === "user"
                          ? "bg-emerald-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-[9px] uppercase tracking-wider font-extrabold mb-1 opacity-70">
                        {m.from === "user" ? "Bạn" : "Rabbit AI"}
                      </p>
                      <p className="font-medium whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Panel */}
            <div className="p-3 bg-white border-t border-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về sản phẩm, size..."
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-gray-50 border border-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 sm:p-2.5 bg-gray-950 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium shadow-sm flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={() => dispatch(clearMessages())}
                  className="mt-2.5 w-full text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition-colors py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa hội thoại</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
