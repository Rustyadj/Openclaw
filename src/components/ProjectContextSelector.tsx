import React, { useState } from "react";
import { Folder, Plus, Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "../lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Button } from "./ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Project {
  id: string;
  name: string;
  description: string;
  color?: string;
  owner_id: string;
}

interface ProjectContextSelectorProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (id: string | null) => void;
}

export default function ProjectContextSelector({ 
  projects, 
  activeProjectId, 
  onSelect 
}: ProjectContextSelectorProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", color: "#10b981" });

  const handleCreate = async () => {
    if (!newProject.name) return;
    
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      const data = await response.json();
      // In a real app we'd refresh the projects list via socket or prop signal
      // For now, we assume the server updates us.
      setIsCreateOpen(false);
      setNewProject({ name: "", description: "", color: "#10b981" });
      onSelect(data.id);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
        Active Environment
      </Label>
      <div className="flex gap-2">
        <Select 
          value={activeProjectId || "global"} 
          onValueChange={(val) => onSelect(val === "global" ? null : val)}
        >
          <SelectTrigger className="w-full bg-secondary border-border h-9 text-xs">
            <SelectValue>
              {activeProjectId ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: projects.find(p => p.id === activeProjectId)?.color }} 
                  />
                  <span className="truncate">{projects.find(p => p.id === activeProjectId)?.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-blue-400" />
                  <span>Global Context</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="global">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-blue-400" />
                <span>Global context</span>
              </div>
            </SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: project.color }} 
                  />
                  <span>{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0 bg-secondary border-border"
              >
                <Plus size={16} />
              </Button>
            }
          />
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Project Aurora" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Input 
                  id="desc" 
                  placeholder="Strategic goals..." 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Theme Color</Label>
                <div className="flex gap-2">
                  {["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"].map((c) => (
                    <button
                      key={c}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 transition-all",
                        newProject.color === c ? "border-zinc-100 scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                      onClick={() => setNewProject({ ...newProject, color: c })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold">
                Initialize Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
