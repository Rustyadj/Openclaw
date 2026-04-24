import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  MessageCircle,
  Loader2,
  ChevronUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function LisaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([
    { role: "model", content: "L.I.S.A. online. I'm your in-app assistant. How can I help you navigate the Command Center?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const systemInstruction = `
        You are L.I.S.A. (Logic Integrated System Assistant), a dedicated in-app AI guide for the AI Mission Control application.
        The app is a "Command Center" for managing AI Agents, Workflows, Skills, and Memory.
        
        Your job:
        1. Answer questions about the application's interface and features.
        2. Help users understand how to create agents, link skills, or view metrics.
        3. Maintain a helpful, slightly technical, but friendly "support bot" persona.
        
        App Sections:
        - Dashboard: Overview of the cluster.
        - Org: Organizational chart of humans and agents.
        - Chat: Where users interact with "Cash" (the lead orchestrator) and other agents.
        - Agents: Management of the workforce nodes.
        - Skills: Tools used by agents.
        - Memory: Data storage layers (Personal vs Org).
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: { systemInstruction }
      });

      const text = response.text || "I'm having trouble connecting to the system core.";
      setMessages(prev => [...prev, { role: "model", content: text }]);
    } catch (error) {
      console.error("LISA Service Error:", error);
      setMessages(prev => [...prev, { role: "model", content: "System error. Please retry." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4"
          >
            <Card className="w-80 h-[450px] bg-zinc-900 border-emerald-500/20 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
              <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-zinc-950">
                    <Bot size={14} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">L.I.S.A. Guide</h3>
                    <p className="text-[8px] text-emerald-500 font-mono font-bold animate-pulse">SYSTEM ASSISTANT</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-100" onClick={() => setIsOpen(false)}>
                    <Minus size={14} />
                  </Button>
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-zinc-950/20"
              >
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                    <div className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed border",
                      m.role === "user" 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-zinc-100" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-300"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Loader2 size={12} className="animate-spin text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Processing...</span>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                <div className="relative flex items-center">
                  <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask LISA about the app..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-md py-2 pl-3 pr-10 text-[11px] text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 text-emerald-500 disabled:opacity-50 hover:text-emerald-400 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl transition-all p-0 overflow-hidden relative",
          isOpen ? "bg-zinc-800" : "bg-emerald-500 hover:bg-emerald-400"
        )}
      >
        {isOpen ? (
          <ChevronUp size={24} className="text-emerald-500 rotate-180 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center relative w-full h-full">
            <Bot size={24} className="text-zinc-950" />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white/20" 
            />
          </div>
        )}
      </Button>
    </div>
  );
}
