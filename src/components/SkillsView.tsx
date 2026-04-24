import React from "react";
import { motion } from "motion/react";
import { Wrench, Plus, Check, Download, Search, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function SkillsView({ skills }: { skills: any[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Skill Manifest</h2>
          <p className="text-zinc-500 text-sm font-medium text-crisp">Equip autonomous nodes with specialized functional modules.</p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <Input placeholder="Search registry..." className="w-64 bg-muted border-border focus:border-zinc-700 text-zinc-100 pl-9 h-10 text-xs" />
            </div>
            <Button className="btn-primary text-[10px] h-10 px-4">
              <Plus size={14} className="mr-2" /> New Logic Module
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id} className="glass-card glass-card-dark group hover:glass-card-accent transition-all overflow-hidden border-none transition-all duration-300">
            <CardHeader className="pb-4 pt-6 px-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Wrench size={48} className="text-zinc-100" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center text-zinc-500 group-hover:text-blue-400 group-hover:border-blue-400/30 transition-all duration-300">
                  <Wrench size={18} />
                </div>
                <Badge className="text-[10px] font-bold tracking-widest uppercase bg-muted border-border text-zinc-500 group-hover:text-zinc-300">v{skill.version}</Badge>
              </div>
              <CardTitle className="text-lg font-bold text-zinc-100 italic group-hover:text-blue-400 transition-colors text-crisp">{skill.name}</CardTitle>
              <CardDescription className="text-zinc-500 text-xs font-medium leading-relaxed mt-2 min-h-[40px] italic">
                {skill.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 px-6 pb-6 space-y-4">
              <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-4">
                <Badge variant="secondary" className="text-[9px] font-bold bg-muted/50 border-border/50 text-zinc-500 uppercase tracking-tighter">Automation</Badge>
                <Badge variant="secondary" className="text-[9px] font-bold bg-muted/50 border-border/50 text-zinc-500 uppercase tracking-tighter">Logic</Badge>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-500 italic">Verified Unit</span>
                </div>
                <Button size="sm" variant="ghost" className="btn-secondary text-[10px] gap-2 h-8 px-3 border-none">
                   <Download size={14} /> Install Logic
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="glass-card glass-card-dark border-2 border-dashed border-border/50 flex flex-col items-center justify-center py-12 px-6 text-center hover:glass-card-accent transition-all cursor-pointer group rounded-3xl">
          <div className="w-12 h-12 rounded-full border border-dashed border-border flex items-center justify-center mb-4 text-zinc-600 group-hover:bg-card group-hover:border-zinc-500 group-hover:text-zinc-100 transition-all shadow-2xl">
            <Globe size={24} />
          </div>
          <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-1 italic">Discover More Logic</p>
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-tighter">
            Access the Global Cluster Hub to download authorized skill packages.
          </p>
        </Card>
      </div>
    </motion.div>
  );
}
