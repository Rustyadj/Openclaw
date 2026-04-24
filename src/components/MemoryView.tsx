import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Search, 
  HardDrive, 
  Share2, 
  Layers, 
  Cpu, 
  ChevronRight, 
  Globe, 
  Folder, 
  MessageSquare,
  Trash2,
  ArrowUpCircle,
  MoreVertical,
  Filter,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "./ui/dropdown-menu";

interface Memory {
  id: string;
  user_id: string;
  project_id?: string;
  chat_id?: string;
  scope: "global" | "project" | "session";
  content: string;
  summary: string;
  tags: string[];
  source_type: string;
  created_at: string;
  importance_score: number;
}

interface Project {
  id: string;
  name: string;
  color?: string;
}

export default function MemoryView({ activeProjectId, projects }: { activeProjectId: string | null, projects: Project[] }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [crossProjectSearch, setCrossProjectSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/memories/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_project_id: activeProjectId,
          cross_project_search: crossProjectSearch,
          query: searchQuery
        })
      });
      const data = await response.json();
      setMemories(data);
    } catch (error) {
      console.error("Failed to search memories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [activeProjectId, crossProjectSearch]);

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    try {
      await fetch(`/api/memories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      fetchMemories();
    } catch (error) {
      console.error("Failed to update memory", error);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!confirm("Are you sure you want to purge this memory record?")) return;
    try {
      await fetch(`/api/memories/${id}`, { method: "DELETE" });
      fetchMemories();
    } catch (error) {
      console.error("Failed to delete memory", error);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Memory Architecture</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-zinc-500 text-sm font-medium text-crisp">Neural vector storage and namespace orchestration.</span>
            {activeProject && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-bold py-0">
                <Folder size={10} className="mr-1" /> Bound to {activeProject.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-md border border-border">
            <Label htmlFor="cross-toggle" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer text-crisp">Cross-Project Search</Label>
            <Switch 
              id="cross-toggle" 
              checked={crossProjectSearch} 
              onCheckedChange={setCrossProjectSearch}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
          <Button className="btn-primary text-[10px] h-10 px-4">
            <Database size={14} className="mr-2" /> Sync Repository
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MemoryStatsCard title="Retrieved Records" value={memories.length.toString()} icon={<Layers size={18} className="text-emerald-500" />} detail={crossProjectSearch ? "Global View Enabled" : "Context Filter Active"} />
        <MemoryStatsCard title="Namespace Focus" value={activeProjectId ? "Project" : "Global"} icon={<HardDrive size={18} className="text-blue-400" />} detail={activeProject?.name || "No Active Project"} />
        <MemoryStatsCard title="Retrieval Strategy" value="Vector Similarity" icon={<Cpu size={18} className="text-amber-500" />} detail="Top-k semantic match" />
      </div>

      <Card className="glass-card glass-card-dark shadow-2xl border-none">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between py-6 px-8 border-b border-border/50 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-zinc-100 uppercase tracking-tighter text-crisp">Memory Fragments</CardTitle>
            <CardDescription className="text-zinc-500 text-xs font-medium italic text-crisp">Semantic nodes distributed across storage layers.</CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
               <Input 
                 placeholder="Search vector space..." 
                 className="bg-muted border-border text-zinc-100 pl-9 h-9 text-xs focus:border-zinc-700 font-medium w-full"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && fetchMemories()}
               />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 btn-secondary border-none" onClick={fetchMemories}>
              <Filter size={14} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {loading ? (
              <div className="p-12 text-center text-zinc-500 italic text-sm">Initializing neural probe...</div>
            ) : memories.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 italic text-sm">No memory fragments found in this context.</div>
            ) : (
              memories.map((memory: Memory) => (
                <MemoryRecordItem 
                  key={memory.id} 
                  memory={memory} 
                  projects={projects}
                  onUpdate={updateMemory}
                  onDelete={deleteMemory}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MemoryStatsCard({ title, value, icon, detail }: { title: string, value: string, icon: React.ReactNode, detail: string }) {
  return (
    <Card className="glass-card glass-card-dark group hover:glass-card-accent transition-all overflow-hidden border-none transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
            {icon}
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-400 h-8 w-8 transition-colors">
            <Share2 size={14}/>
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-2 text-crisp">{title}</p>
          <h3 className="text-2xl font-mono font-bold text-zinc-100">{value}</h3>
          <p className="text-[10px] font-bold text-zinc-600 uppercase italic tracking-tight">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MemoryRecordItem({ 
  memory, 
  projects, 
  onUpdate, 
  onDelete 
}: { 
  memory: Memory; 
  projects: Project[]; 
  onUpdate: (id: string, updates: Partial<Memory>) => Promise<void>; 
  onDelete: (id: string) => Promise<void>; 
  key?: any;
}) {
  const scopeColors = {
    global: "bg-blue-500 text-blue-400 border-blue-500/20",
    project: "bg-emerald-500 text-emerald-500 border-emerald-500/20",
    session: "bg-amber-500 text-amber-500 border-amber-500/20"
  };

  const scopeIcons = {
    global: <Globe size={10} className="mr-1" />,
    project: <Folder size={10} className="mr-1" />,
    session: <MessageSquare size={10} className="mr-1" />
  };

  const project = projects.find(p => p.id === memory.project_id);

  return (
    <div className="flex items-start justify-between py-5 px-8 hover:bg-muted/30 transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500">
      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="outline" className={cn(
             "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0 h-4 bg-opacity-10 border",
             scopeColors[memory.scope]
          )}>
            {scopeIcons[memory.scope]}
            {memory.scope}
          </Badge>
          {project && (
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight flex items-center">
              <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: project.color }} />
              {project.name}
            </span>
          )}
          <span className="text-[10px] font-bold text-zinc-700 uppercase font-mono">{memory.source_type}</span>
          <span className="text-[10px] font-bold text-zinc-800">•</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono italic">Importance: {memory.importance_score}</span>
        </div>
        <h4 className="text-sm font-bold text-zinc-100 italic mb-1 group-hover:text-emerald-500 transition-colors uppercase tracking-tight text-crisp">{memory.summary}</h4>
        <p className="text-xs text-zinc-400 leading-relaxed font-medium line-clamp-2 italic">{memory.content}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {memory.tags.map(tag => (
            <span key={tag} className="text-[9px] font-bold text-zinc-600 border border-border px-1.5 py-0.5 rounded uppercase tracking-tighter">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden lg:block pr-4">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Created</p>
          <span className="text-[11px] font-bold text-zinc-400 font-mono italic">{new Date(memory.created_at).toLocaleDateString()}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-300">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border text-zinc-300 w-48">
            <DropdownMenuItem className="gap-2 focus:bg-emerald-500 focus:text-zinc-950 font-bold text-xs uppercase" onClick={() => onUpdate(memory.id, { scope: "global", project_id: null })}>
              <Globe size={14} /> Promote to Global
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 focus:bg-emerald-500 focus:text-zinc-950 font-bold text-xs uppercase" onClick={() => {
              const pid = prompt("Enter Project ID to move to:");
              if (pid) onUpdate(memory.id, { scope: "project", project_id: pid });
            }}>
              <ArrowUpCircle size={14} /> Move to Project
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="gap-2 text-rose-500 focus:bg-rose-500 focus:text-zinc-950 font-bold text-xs uppercase" onClick={() => onDelete(memory.id)}>
              <Trash2 size={14} /> Purge Fragment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
