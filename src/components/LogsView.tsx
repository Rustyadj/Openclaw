import React from "react";
import { motion } from "motion/react";
import { Terminal, Search, Filter, Trash2, Download, Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function LogsView({ logs }: { logs: any[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="h-full flex flex-col gap-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Log Console</h2>
          <p className="text-zinc-500 text-sm font-medium text-crisp">Monitoring the global event stream and temporal traces.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
             <Input placeholder="Filter stream..." className="bg-muted border-border text-zinc-100 pl-9 w-64 h-10 text-xs focus:border-zinc-700 font-medium" />
           </div>
           <Button variant="outline" className="btn-secondary font-bold text-[10px] h-10 px-4 border-none">
             <Download size={14} className="mr-2" /> Export
           </Button>
           <Button variant="outline" className="btn-secondary text-rose-500 hover:text-rose-400 font-bold text-[10px] h-10 px-4 border-none">
             <Trash2 size={14} className="mr-2" /> Clear
           </Button>
        </div>
      </div>

      <Card className="flex-1 min-h-0 glass-card glass-card-dark flex flex-col rounded-3xl overflow-hidden shadow-none transition-all duration-500">
        <CardHeader className="border-b border-border py-4 px-6 flex flex-row items-center justify-between bg-muted/50">
          <div className="flex items-center gap-3">
            <Radio size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-[0.2em] italic text-crisp">Real-Time Spectral Traces</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tight">Stream Source</span>
              <span className="text-[10px] text-zinc-300 font-mono italic leading-none">GCP-ST-882</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Status: Syncing</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-glow" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden bg-background">
          <ScrollArea className="h-full w-full font-mono text-[11px]">
            <div className="p-6 space-y-1.5">
              {logs.length > 0 ? [...logs].reverse().map((log, i) => (
                <div key={i} className="flex gap-6 group hover:bg-muted/40 -mx-6 px-8 py-1.5 transition-colors border-l-2 border-transparent hover:border-emerald-500/30">
                  <span className="text-zinc-600 select-none w-20 flex-shrink-0 font-bold italic tracking-tighter">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className={cn(
                    "font-extrabold w-32 flex-shrink-0 uppercase text-[9px] pt-1 tracking-widest italic",
                    log.level === 'error' ? 'text-rose-400' : 'text-blue-400'
                  )}>
                    [{log.agentId || 'CLUSTER'}]
                  </span>
                  <div className="flex-1 space-y-1">
                    <span className="text-zinc-300 font-medium leading-relaxed">{log.message}</span>
                    {log.details && (
                      <div className="bg-muted/50 p-2 rounded mt-1 border border-border/50 text-zinc-500 text-[10px]">
                        {log.details}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="h-full flex items-center justify-center py-40">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <Terminal size={48} className="mx-auto text-zinc-800" />
                      <div className="absolute inset-0 bg-emerald-500/5 filter blur-3xl rounded-full" />
                    </div>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest animate-pulse italic">Awaiting event signals...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        {/* Terminal Footer Action Bar */}
        <div className="p-4 glass-card-dark border-t border-white/5 flex items-center gap-4 rounded-b-3xl">
           <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-muted/50 border border-border rounded-md">
             <span className="text-emerald-500 font-bold text-xs">$</span>
             <input 
              type="text" 
              placeholder="Inject command into cluster..." 
              className="bg-transparent border-none focus:outline-none text-[11px] text-zinc-300 w-full placeholder:text-zinc-600 font-mono"
            />
           </div>
           <div className="text-[10px] font-mono text-zinc-600 italic">
             VER_8.8.2-Q
           </div>
        </div>
      </Card>
    </motion.div>
  );
}
