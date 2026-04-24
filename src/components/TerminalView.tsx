import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Terminal as TerminalIcon, Play, Trash2, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

export default function TerminalView() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState([
    { type: "system", text: "Initializing Terminal instance..." },
    { type: "system", text: "Connecting to secure shell..." },
    { type: "system", text: "Connected. Terminal ready." },
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      const command = input.trim();
      setHistory((prev) => [...prev, { type: "input", text: `> ${command}` }]);
      setInput("");

      // Simulate command execution
      setTimeout(() => {
        let response = "";
        if (command.toLowerCase() === "help") {
          response = "Available commands:\n- help: Show this message\n- clear: Clear terminal output\n- status: Show system status\n- ping: Check connection";
        } else if (command.toLowerCase() === "clear") {
          setHistory([{ type: "system", text: "Terminal cleared." }]);
          return;
        } else if (command.toLowerCase() === "status") {
          response = "All systems operational. Network latency: 12ms.";
        } else if (command.toLowerCase() === "ping") {
          response = "Pong.";
        } else {
          response = `Command not found: ${command}`;
        }
        setHistory((prev) => [...prev, { type: "output", text: response }]);
      }, 300);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full bg-zinc-950 rounded-lg border border-zinc-800 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-emerald-500" />
          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">
            Command Terminal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHistory([{ type: "system", text: "Terminal cleared." }])}
            className="h-6 w-6 text-zinc-500 hover:text-rose-400"
          >
            <Trash2 size={12} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300">
            <Maximize2 size={12} />
          </Button>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto w-full custom-scrollbar text-zinc-300"
      >
        <div className="flex flex-col gap-1 pb-4">
          {history.map((entry, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap ${
                entry.type === "system"
                  ? "text-zinc-500 italic"
                  : entry.type === "input"
                  ? "text-emerald-400"
                  : "text-zinc-300"
              }`}
            >
              {entry.text}
            </div>
          ))}
        </div>
        
        <div className="flex items-center mt-2 group">
          <span className="text-emerald-500 mr-2 shrink-0">➜</span>
          <span className="text-blue-400 mr-2 shrink-0">~</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-700 min-w-0"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </motion.div>
  );
}
