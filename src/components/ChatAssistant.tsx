import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Minimize2,
  Bot,
  User,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  role: "user" | "model";
  content: string;
}

interface ChatAssistantProps {
  context: {
    agents: any[];
    skills: any[];
    logs: any[];
  };
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ChatAssistant({ context }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "L.I.S.A. (Logic Integrated System Assistant) online. How can I help you manage your workforce today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare system context
      const systemInstruction = `
        You are L.I.S.A. (Logic Integrated System Assistant), the built-in AI assistant for the "Mission Control AI" platform.
        Current System State:
        - Active Agents: ${context.agents.length}
        - Total Skills: ${context.skills.length}
        - Operational Status: ${context.agents.some(a => a.status === 'running') ? 'ACTIVE OPS' : 'STANDBY'}
        
        Detailed Agent Manifest:
        ${context.agents.map(a => `- ${a.name} [ID: ${a.id}]: Positioned as ${a.role}. Architecture: ${a.type || 'primary'}. Status: ${a.status}. Running on ${a.model}.`).join("\n")}
        
        Skill Repository:
        ${context.skills.map(s => `- ${s.name}: ${s.description}`).join("\n")}

        Recent Log Vectors:
        ${context.logs.slice(0, 5).map(l => `[${l.timestamp}] ${l.message}`).join("\n")}

        Role Guidelines:
        1. Contextual Awareness: Always refer to current agents and logs when relevant.
        2. Persona: You are highly logical, efficient, and slightly futuristic. 
        3. Capability: You assist with mission oversight, agent diagnostics, and general management queries.
        4. Tone: Precise, helpful, and mission-oriented.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const aiResponse = response.text || "Connection to neural core lost. Signal degraded.";
      setMessages(prev => [...prev, { role: "model", content: aiResponse }]);
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: "model", content: `ERR_CORE_FAILURE: ${error.message || 'Unknown interrupt'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-96 max-h-[500px]"
          >
            <Card className="flex flex-col h-[500px] bg-card border-border shadow-2xl overflow-hidden ring-1 ring-emerald-500/10">
              {/* Header */}
              <div className="p-4 border-b border-border bg-muted/80 backdrop-blur flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-100">L.I.S.A. Interface</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-100 h-6 w-6">
                    <Minimize2 size={14} />
                  </Button>
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4" scrollHideDelay={0}>
                 <div className="space-y-4 pb-2">
                    {messages.map((m, i) => (
                      <div key={i} className={cn(
                        "flex gap-3",
                        m.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "w-6 h-6 rounded flex items-center justify-center shrink-0 border",
                          m.role === "user" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        )}>
                          {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
                        </div>
                        <div className={cn(
                          "max-w-[85%] rounded-md p-3 text-[11px] leading-relaxed font-medium transition-all shadow-sm",
                          m.role === "user" ? "bg-muted text-zinc-200" : "bg-secondary/40 text-zinc-300 border border-border/30"
                        )}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                           <Loader2 size={12} className="animate-spin" />
                        </div>
                        <div className="max-w-[80%] rounded-md p-3 text-[11px] bg-secondary/20 text-zinc-500 italic font-mono">
                          Synchronizing with neural core...
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                 </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-muted/50">
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Query system..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                  <Button size="icon-sm" onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 h-8 w-8">
                    <Send size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full w-14 h-14 shadow-2xl transition-all active:scale-90",
          isOpen ? "bg-zinc-800 text-zinc-100" : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
        )}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>
    </div>
  );
}
