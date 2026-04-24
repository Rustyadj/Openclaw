import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database,
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Search,
  Settings,
  MoreVertical,
  Plus,
  Folder,
  FolderPlus,
  FileText,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit2,
  Check,
  X,
  MessageSquare,
  Layout,
  Globe,
  ShieldCheck,
  Activity,
  Cpu,
  Upload,
  Image as ImageIcon,
  File as FileIcon,
  Info
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "./ui/sheet";
import { ScrollArea as ScrollAreaUI } from "./ui/scroll-area";

import socket from "../lib/socket";

import ProjectContextSelector from "./ProjectContextSelector";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

interface FolderType {
  id: string;
  name: string;
  chats: Chat[];
}

interface ProjectFile {
  id: string;
  name: string;
  type: string; // 'file' | 'photo'
  url?: string;
  size?: number;
  created_at: Date | number;
}

interface Project {
  id: string;
  name: string;
  type: 'personal' | 'org' | 'shared';
  folders: FolderType[];
  chats: Chat[]; // Root chats in project
  instructions?: string;
  files: ProjectFile[];
  description?: string;
  color?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function ChatView({ 
  agents, 
  skills, 
  logs, 
  activeProjectId,
  setActiveProjectId,
  projects: serverProjects
}: { 
  agents: any[], 
  skills: any[], 
  logs: any[],
  activeProjectId: string | null,
  setActiveProjectId: (id: string | null) => void,
  projects: any[]
}) {
  // Persistence state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("mission_projects");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old data to include type if missing
      return parsed.map((p: any) => ({ ...p, type: p.type || 'personal' }));
    }
    return [
      {
        id: "p1",
        name: "Mission: Genesis (Dev)",
        type: "personal",
        instructions: "Prioritize neural link stability.",
        files: [
          { id: "f1", name: "genesis_spec.pdf", type: "file", size: 45000, created_at: Date.now() }
        ],
        folders: [
          {
            id: "f1",
            name: "Neural Core",
            chats: [
              { id: "c1", title: "Private Handshake", messages: [{ role: "model", content: "Personal neural link active. Access restricted.", timestamp: Date.now() }] }
            ]
          }
        ],
        chats: [
          { id: "c2", title: "Vault Overview", messages: [{ role: "model", content: "Systems normal. No external pings.", timestamp: Date.now() }] }
        ]
      },
      {
        id: "p_org",
        name: "Company: Helix Ops",
        type: "org",
        files: [],
        folders: [
          {
            id: "f_org_1",
            name: "Global Directives",
            chats: [
              { id: "c_org_1", title: "Org Standards", messages: [{ role: "model", content: "Company directives loaded. All agents syncing.", timestamp: Date.now() }] }
            ]
          }
        ],
        chats: []
      },
      {
        id: "p_shared",
        name: "Shared: Sync Hub",
        type: "shared",
        files: [],
        folders: [],
        chats: [
          { id: "c_sh_1", title: "Shared Logistics", messages: [{ role: "model", content: "Channel established. Explicit data sharing only.", timestamp: Date.now() }] }
        ]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>("c1");
  const [activeProjectOverviewId, setActiveProjectOverviewId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["p1", "f1"]));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [disabledMemoryIds, setDisabledMemoryIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial AI selection - Prefer LISA
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      const lisa = agents.find(a => a.name.toUpperCase().includes("LISA") || a.name.toUpperCase().includes("L.I.S.A"));
      setSelectedAgentId(lisa ? lisa.id : agents[0].id);
      if (lisa?.model) setSelectedModel(lisa.model);
    }
  }, [agents, selectedAgentId]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("mission_projects", JSON.stringify(projects));
  }, [projects]);

  // Find active chat and its parents for display
  const getActiveChat = () => {
    for (const p of projects) {
      for (const c of p.chats) if (c.id === activeChatId) return { chat: c, project: p, folder: null };
      for (const f of p.folders) {
        for (const c of f.chats) if (c.id === activeChatId) return { chat: c, project: p, folder: f };
      }
    }
    return null;
  };

  const activeData = getActiveChat();
  const activeChat = activeData?.chat;
  const activeOverviewProject = projects.find(p => p.id === activeProjectOverviewId);

  // Sync active project context for memory
  useEffect(() => {
    if (activeData?.project?.id) {
      // If in a chat, the context is that project
      // (This assumes App.tsx handles the actual state update via a prop if passed)
    }
  }, [activeData?.project?.id]);

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isLoading]);

  // Tree management
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addProject = (type: 'personal' | 'org' | 'shared' = 'personal') => {
    const newProj: Project = {
      id: "p_" + Date.now(),
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Project`,
      type,
      folders: [],
      chats: [],
      files: [],
      instructions: ""
    };
    setProjects([...projects, newProj]);
    setEditingId(newProj.id);
    setEditValue(newProj.name);
  };
  
  const ProjectList = ({ type, title, icon: Icon, colorClass }: { type: 'personal' | 'org' | 'shared', title: string, icon: any, colorClass: string }) => {
    const filtered = projects.filter(p => p.type === type);
    return (
      <div className="space-y-1 mb-4">
        <div className="p-2 flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <Icon size={12} className={colorClass} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{title}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => addProject(type)} className="h-5 w-5 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-emerald-500">
            <Plus size={12} />
          </Button>
        </div>
        {filtered.map(project => (
          <div key={project.id} className="space-y-1">
            <div 
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all group",
                editingId === project.id ? "bg-muted" : "hover:bg-muted/50"
              )}
            >
              <button onClick={() => toggleExpand(project.id)} className="text-zinc-500 hover:text-zinc-200">
                {expandedItems.has(project.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              <Layout size={14} className={colorClass} />
              
              {editingId === project.id ? (
                <div className="flex-1 flex items-center gap-1">
                  <input 
                    value={editValue} 
                    autoFocus
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    className="flex-1 bg-transparent border-none p-0 text-xs text-zinc-100 focus:outline-none"
                  />
                  <button onClick={saveEdit} className="text-emerald-500"><Check size={12} /></button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setActiveProjectOverviewId(project.id);
                    setActiveChatId(null);
                    setActiveProjectId(project.id);
                  }}
                  className="flex-1 text-left"
                >
                  <span className="text-xs font-bold text-zinc-300 truncate tracking-tight">{project.name}</span>
                </button>
              )}

              <div className="hidden group-hover:flex items-center gap-1">
                <button onClick={() => addFolder(project.id)} title="Add Folder" className="p-1 text-zinc-500 hover:text-zinc-200"><FolderPlus size={12} /></button>
                <button onClick={() => addChat(project.id, 'project')} title="New Chat" className="p-1 text-zinc-500 hover:text-zinc-200"><MessageSquare size={12} /></button>
                <button onClick={() => { setEditingId(project.id); setEditValue(project.name); }} className="p-1 text-zinc-500 hover:text-zinc-200"><Edit2 size={12} /></button>
                <button onClick={() => deleteItem(project.id, 'project')} className="p-1 text-zinc-500 hover:text-rose-500"><Trash2 size={12} /></button>
              </div>
            </div>

            {expandedItems.has(project.id) && (
              <div className="ml-4 border-l border-border/50 pl-2 space-y-1">
                {/* Folders & Chats logic remains same... but I'll optimize it here */}
                <ProjectChildren project={project} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const ProjectChildren = ({ project }: { project: Project }) => {
    return (
      <>
        {project.folders.map(folder => (
          <div key={folder.id} className="space-y-1 text-zinc-50">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 group">
              <button onClick={() => toggleExpand(folder.id)} className="text-zinc-500 hover:text-zinc-200">
                {expandedItems.has(folder.id) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              <Folder size={12} className="text-amber-500" />
              
              {editingId === folder.id ? (
                <div className="flex-1 flex items-center gap-1">
                  <input value={editValue} autoFocus onChange={e => setEditValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit()} className="flex-1 bg-transparent border-none p-0 text-[11px] text-zinc-100 focus:outline-none" />
                  <button onClick={saveEdit} className="text-emerald-500"><Check size={10} /></button>
                </div>
              ) : (
                <span className="flex-1 text-[11px] font-medium text-zinc-400 truncate">{folder.name}</span>
              )}

              <div className="hidden group-hover:flex items-center gap-1">
                <button onClick={() => addChat(folder.id, 'folder')} className="p-1 text-zinc-500 hover:text-zinc-200"><MessageSquare size={10} /></button>
                <button onClick={() => { setEditingId(folder.id); setEditValue(folder.name); }} className="p-1 text-zinc-500 hover:text-zinc-200"><Edit2 size={10} /></button>
                <button onClick={() => deleteItem(folder.id, 'folder')} className="p-1 text-zinc-500 hover:text-rose-500"><Trash2 size={10} /></button>
              </div>
            </div>

            {expandedItems.has(folder.id) && (
              <div className="ml-4 border-l border-border/30 pl-2 space-y-0.5">
                {folder.chats.map(chat => (
                  <ChatNode 
                    key={chat.id} 
                    chat={chat} 
                    active={activeChatId === chat.id} 
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setActiveProjectOverviewId(null);
                      setActiveProjectId(project.id);
                    }}
                    onEdit={() => { setEditingId(chat.id); setEditValue(chat.title); }}
                    onDelete={() => deleteItem(chat.id, 'chat')}
                    isEditing={editingId === chat.id}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    saveEdit={saveEdit}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
        {project.chats.map(chat => (
          <ChatNode 
            key={chat.id} 
            chat={chat} 
            active={activeChatId === chat.id} 
            onClick={() => {
              setActiveChatId(chat.id);
              setActiveProjectOverviewId(null);
              setActiveProjectId(project.id);
            }}
            onEdit={() => { setEditingId(chat.id); setEditValue(chat.title); }}
            onDelete={() => deleteItem(chat.id, 'chat')}
            isEditing={editingId === chat.id}
            editValue={editValue}
            setEditValue={setEditValue}
            saveEdit={saveEdit}
          />
        ))}
      </>
    );
  };

  const addChatToRoot = () => {
    const newChat: Chat = {
      id: "c_" + Date.now(),
      title: "New Global Chat",
      messages: [{ role: "model", content: "Global thread initialized. No project context active.", timestamp: Date.now() }]
    };
    // Add to the first project for now as a default container, or create a 'Global' project
    let globalProj = projects.find(p => p.id === 'global_vault');
    if (!globalProj) {
      const newProj: Project = {
        id: 'global_vault',
        name: 'Global Vault',
        type: 'personal',
        folders: [],
        chats: [newChat],
        files: [],
        instructions: ""
      };
      setProjects([newProj, ...projects]);
    } else {
      setProjects(projects.map(p => p.id === 'global_vault' ? { ...p, chats: [newChat, ...p.chats] } : p));
    }
    setActiveChatId(newChat.id);
    setExpandedItems(prev => new Set(prev).add('global_vault'));
  };

  const addProjectChat = () => {
    if (!activeProjectId) return;
    const project = projects.find(p => p.id === activeProjectId) || projects[0];
    addChat(project.id, 'project');
  };

  const addFolder = (projectId: string) => {
    const newFolder: FolderType = {
      id: "f_" + Date.now(),
      name: "New Folder",
      chats: []
    };
    setProjects(projects.map(p => p.id === projectId ? { ...p, folders: [...p.folders, newFolder] } : p));
    setExpandedItems(prev => new Set(prev).add(projectId));
    setEditingId(newFolder.id);
    setEditValue(newFolder.name);
  };

  const addChat = (parentId: string, type: 'project' | 'folder') => {
    const newChat: Chat = {
      id: "c_" + Date.now(),
      title: "New Conversation",
      messages: [{ role: "model", content: "New thread initialized. Proceed with query.", timestamp: Date.now() }]
    };
    
    setProjects(projects.map(p => {
      if (type === 'project' && p.id === parentId) {
        return { ...p, chats: [...p.chats, newChat] };
      }
      if (type === 'folder') {
        return {
          ...p,
          folders: p.folders.map(f => f.id === parentId ? { ...f, chats: [...f.chats, newChat] } : f)
        };
      }
      return p;
    }));

    if (type === 'project') setExpandedItems(prev => new Set(prev).add(parentId));
    else setExpandedItems(prev => new Set(prev).add(parentId));
    
    setActiveChatId(newChat.id);
    setEditingId(newChat.id);
    setEditValue(newChat.title);
  };

  const deleteItem = (id: string, type: 'project' | 'folder' | 'chat') => {
    if (type === 'project') setProjects(projects.filter(p => p.id !== id));
    else if (type === 'folder') {
      setProjects(projects.map(p => ({ ...p, folders: p.folders.filter(f => f.id !== id) })));
    } else {
      setProjects(projects.map(p => ({
        ...p,
        chats: p.chats.filter(c => c.id !== id),
        folders: p.folders.map(f => ({ ...f, chats: f.chats.filter(c => c.id !== id) }))
      })));
      if (activeChatId === id) setActiveChatId(null);
    }
  };

  const saveEdit = () => {
    if (!editingId) return;
    setProjects(projects.map(p => {
      if (p.id === editingId) return { ...p, name: editValue };
      return {
        ...p,
        folders: p.folders.map(f => {
          if (f.id === editingId) return { ...f, name: editValue };
          return {
            ...f,
            chats: f.chats.map(c => c.id === editingId ? { ...c, title: editValue } : c)
          };
        }),
        chats: p.chats.map(c => c.id === editingId ? { ...c, title: editValue } : c)
      };
    }));
    setEditingId(null);
  };

  // Chat Logic
  const handleSend = async () => {
    if (!input.trim() || !activeChatId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const timestamp = Date.now();
    
    // Update state locally first
    setProjects(prev => prev.map(p => ({
      ...p,
      chats: p.chats.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: "user", content: userMessage, timestamp }] } : c),
      folders: p.folders.map(f => ({
        ...f,
        chats: f.chats.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: "user", content: userMessage, timestamp }] } : c)
      }))
    })));
    
    setIsLoading(true);

    // Retrieve scoped memories for context
    let memoryContext = "";
    try {
      const memoryResponse = await fetch("/api/memories/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          active_project_id: activeProjectId,
          chat_id: activeChatId,
          query: userMessage,
          exclude_ids: disabledMemoryIds
        })
      });
      const memories = await memoryResponse.json();
      if (memories.length > 0) {
        memoryContext = `\nRELEVANT MEMORY CONTEXT:\n${memories.map((m: any) => `- [${m.scope.toUpperCase()}]: ${m.summary} - ${m.content}`).join("\n")}\n`;
      }
    } catch (err) {
      console.warn("Memory retrieval failed", err);
    }

    try {
      const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
      const projectDetails = activeData?.project?.instructions 
        ? `\nPROJECT SPECIFIC DIRECTIVES:\n${activeData.project.instructions}\n` 
        : "";
      const projectKnowledge = activeData?.project?.files?.length 
        ? `\nAVAILABLE PROJECT ASSETS:\n${activeData.project.files.map(f => `- ${f.name} (${f.type})`).join('\n')}\n` 
        : "";

      const systemInstruction = `
        You are ${selectedAgent?.name || 'an AI Assistant'}, ${selectedAgent?.role || 'an expert orchestrator'}.
        Personality: ${selectedAgent?.personality || 'professional, helpful, and concise'}.
        
        Core Context:
        - Other active nodes: ${JSON.stringify(agents.filter(a => a.id !== selectedAgentId).map(a => ({ name: a.name, role: a.role })))}
        - Activity Log entries: ${logs.length}
        ${projectDetails}
        ${projectKnowledge}
        ${memoryContext}
        
        Guidelines:
        ${selectedAgent?.instructions || 'Maintain consistent persona and assist the user with mission-critical tasks.'}
        Use technical jargon where appropriate for the situation.
      `;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          ...(activeChat?.messages || []).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
        }
      });

      const aiContent = response.text || "Connection timing out. Neural link degraded.";
      
      setProjects(prev => prev.map(p => ({
        ...p,
        chats: p.chats.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: "model", content: aiContent, timestamp: Date.now() }] } : c),
        folders: p.folders.map(f => ({
          ...f,
          chats: f.chats.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, { role: "model", content: aiContent, timestamp: Date.now() }] } : c)
        }))
      })));
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-0 -m-8 relative overflow-hidden bg-background">
      {/* Sidebar - Projects and History */}
      <div className="w-80 flex flex-col glass-card glass-card-dark rounded-none border-r border-border backdrop-blur-sm z-20 transition-all duration-300">
        <div className="p-4 border-b border-border space-y-4">
          <ProjectContextSelector 
            projects={serverProjects} 
            activeProjectId={activeProjectId} 
            onSelect={setActiveProjectId} 
          />
          
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 text-crisp">Repository</h3>
            <div className="flex gap-1">
              {activeProjectId && (
                <Button variant="ghost" size="icon" onClick={addProjectChat} title="New Project Chat" className="h-7 w-7 text-emerald-400 hover:bg-emerald-400/10">
                  <FolderPlus size={14} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => addChatToRoot()} title="New Global Chat" className="h-7 w-7 text-blue-400 hover:bg-blue-400/10">
                <MessageSquare size={14} />
              </Button>
              <Button variant="ghost" size="icon" onClick={addProject} title="New Project" className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10">
                <Plus size={14} />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <ProjectList type="personal" title="Personal Vault" icon={ShieldCheck} colorClass="text-blue-400" />
          <ProjectList type="org" title="Org Network" icon={Globe} colorClass="text-emerald-500" />
          <ProjectList type="shared" title="Shared Channels" icon={Activity} colorClass="text-amber-500" />
        </ScrollArea>
        
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wider">CASH Integration</p>
              <p className="text-[9px] text-zinc-500 font-mono">Neural Link: ACTIVE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-16 glass-card glass-card-dark rounded-none border-b border-border flex items-center justify-between px-8 backdrop-blur-md">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{activeData?.project.name}</span>
                    <ChevronRight size={10} className="text-zinc-600" />
                    {activeData?.folder && (
                      <>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{activeData.folder.name}</span>
                        <ChevronRight size={10} className="text-zinc-600" />
                      </>
                    )}
                  </div>
                  <h2 className="text-sm font-bold text-zinc-100 tracking-tight flex items-center gap-2 text-crisp">
                    {activeChat.title}
                  </h2>
                </div>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-2 h-8">
                  <Sheet>
                    <SheetTrigger
                      nativeButton={false}
                      render={
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0 h-5 bg-opacity-10 border cursor-pointer hover:bg-opacity-20 transition-all",
                            activeProjectId
                              ? "bg-emerald-500 text-emerald-500 border-emerald-500/20"
                              : "bg-blue-500 text-blue-400 border-blue-500/20"
                          )}
                        >
                          {activeProjectId ? (
                            <>
                              <Folder size={10} className="mr-1" /> Context: G+P+S
                            </>
                          ) : (
                            <>
                              <Globe size={10} className="mr-1" /> Context: G+S
                            </>
                          )}
                        </Badge>
                      }
                    />
                    <MemoryManagerSheet
                      activeProjectId={activeProjectId}
                      chatId={activeChatId}
                      disabledIds={disabledMemoryIds}
                      setDisabledIds={setDisabledMemoryIds}
                    />
                  </Sheet>
                  {activeProjectId && (
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight italic">
                      Project Memory Secured
                    </span>
                  )}
                </div>

                <div className="h-8 w-[1px] bg-border mx-2" />

                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Active Intelligence</span>
                    <Select value={selectedAgentId || ""} onValueChange={setSelectedAgentId}>
                      <SelectTrigger className="h-7 min-w-[140px] bg-muted/50 border-border text-[10px] font-bold tracking-tight px-2 focus:ring-0">
                        <div className="flex items-center gap-2">
                          <Bot size={12} className="text-emerald-500" />
                          <SelectValue placeholder="Select Agent" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id} className="text-[10px] font-bold">
                            {agent.name} <span className="text-zinc-500 font-normal ml-1">({agent.role})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Cognitive Model</span>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="h-7 min-w-[120px] bg-muted/50 border-border text-[10px] font-bold tracking-tight px-2 focus:ring-0">
                        <div className="flex items-center gap-2">
                          <Cpu size={12} className="text-blue-400" />
                          <SelectValue placeholder="Model" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="gemini-1.5-flash" className="text-[10px]">1.5 Flash (Standard)</SelectItem>
                        <SelectItem value="gemini-1.5-flash-002" className="text-[10px]">1.5 Flash (v002)</SelectItem>
                        <SelectItem value="gemini-1.5-flash-8b" className="text-[10px]">1.5 Flash-8B (Tiny)</SelectItem>
                        <SelectItem value="gemini-1.5-pro" className="text-[10px]">1.5 Pro (Deep Memory)</SelectItem>
                        <SelectItem value="gemini-1.5-pro-002" className="text-[10px]">1.5 Pro (v002)</SelectItem>
                        <SelectItem value="gemini-2.0-flash-exp" className="text-[10px] text-emerald-500 font-bold">2.0 Flash (Exp)</SelectItem>
                        <SelectItem value="gemini-2.0-pro-exp-02-05" className="text-[10px] text-amber-500 font-bold">2.0 Pro (Exp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2 mr-4">
                   {agents.slice(0, 3).map(a => (
                     <div key={a.id} className="w-6 h-6 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400" title={a.name}>
                        {a.name[0]}
                     </div>
                   ))}
                 </div>
                 <Button variant="outline" size="sm" className="h-8 btn-secondary border-none text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-100">
                   Analyze Context
                 </Button>
              </div>
            </div>

            {/* Chat Body */}
            <ScrollArea className="flex-1 p-8">
              <div className="max-w-3xl mx-auto space-y-8">
                {activeChat.messages.map((m, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={cn(
                      "flex gap-6",
                      m.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0",
                      m.role === "user" ? "bg-muted border-border text-zinc-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    )}>
                      {m.role === "user" ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={cn(
                      "flex-1 space-y-2",
                      m.role === "user" ? "text-right" : "text-left"
                    )}>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {m.role === "user" ? "Directives Issued" : "System Response"}
                      </div>
                      <div className={cn(
                        "rounded-xl p-4 text-sm leading-relaxed glass-card glass-card-dark",
                        m.role === "user" ? "text-zinc-100 inline-block glass-card-accent" : "text-zinc-300"
                      )}>
                        {m.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                      <Loader2 size={20} className="animate-spin" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Neural link processing</div>
                       <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-20" />
              </div>
            </ScrollArea>

            {/* Input Wrapper */}
            <div className="p-8 pb-12 bg-gradient-to-t from-background to-transparent">
              <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
                <div className="relative flex items-end gap-3 glass-card glass-card-dark p-4 rounded-2xl shadow-2xl focus-within:glass-card-accent transition-all duration-300">
                   <textarea 
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Issue system directive..."
                    className="flex-1 bg-transparent border-none py-1 text-sm text-zinc-100 focus:outline-none resize-none max-h-48 scrollbar-hide"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    className="h-10 w-10 btn-primary rounded-xl"
                  >
                    <Send size={18} />
                  </Button>
                </div>
                <p className="mt-3 text-[10px] text-center text-zinc-500 font-medium">
                  Autonomous context analysis is <span className="text-emerald-500">ENABLED</span>. Multi-node synchronization verified.
                </p>
              </div>
            </div>
          </>
        ) : activeProjectOverviewId && activeOverviewProject ? (
          <ProjectOverview 
            project={activeOverviewProject} 
            onUpdate={(updates) => updateProject(activeProjectOverviewId, updates)}
            onAddChat={() => addChat(activeProjectOverviewId, 'project')}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-border flex items-center justify-center mb-6">
              <MessageSquare size={32} className="text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-zinc-100 italic mb-2 tracking-tight">Select Logical Thread</h2>
            <p className="text-sm text-zinc-500 max-w-sm mb-8">
              Open a conversation from the repository or select a project to manage its knowledge and assets.
            </p>
            <Button onClick={() => addProject()} className="btn-primary flex items-center justify-center uppercase tracking-widest text-xs px-6 py-5 rounded-xl">
              Initialize New Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryManagerSheet({ 
  activeProjectId, 
  chatId, 
  disabledIds, 
  setDisabledIds 
}: { 
  activeProjectId: string | null, 
  chatId: string | null, 
  disabledIds: string[], 
  setDisabledIds: (ids: string[]) => void 
}) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/memories/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active_project_id: activeProjectId, chat_id: chatId })
        });
        const data = await response.json();
        setMemories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, [activeProjectId, chatId]);

  const toggleMemory = (id: string) => {
    if (disabledIds.includes(id)) {
      setDisabledIds(disabledIds.filter(d => d !== id));
    } else {
      setDisabledIds([...disabledIds, id]);
    }
  };

  return (
    <SheetContent className="bg-card border-l border-border w-[400px]">
      <SheetHeader>
        <SheetTitle className="text-zinc-100 flex items-center gap-2">
          <Database size={18} className="text-emerald-500" />
          Logical Memory Manager
        </SheetTitle>
        <SheetDescription className="text-zinc-500 italic">
          Toggle available neural fragments for this session.
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-border pb-2">
          <span className="text-crisp">Active Fragments</span>
          <span className="text-crisp">{memories.length - (memories.filter(m => disabledIds.includes(m.id)).length)} Enabled</span>
        </div>

        <ScrollAreaUI className="h-[calc(100vh-200px)]">
          <div className="space-y-3 pr-4">
            {loading ? (
              <p className="text-sm italic text-zinc-600">Querying vector space...</p>
            ) : memories.length === 0 ? (
              <p className="text-sm italic text-zinc-600">No memories found in this context.</p>
            ) : (
              memories.map(m => (
                <div 
                  key={m.id} 
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer group",
                    disabledIds.includes(m.id) 
                      ? "bg-zinc-900/50 border-zinc-800 opacity-50 shadow-inner" 
                      : "bg-muted/30 border-border hover:border-emerald-500/50 shadow-sm"
                  )}
                  onClick={() => toggleMemory(m.id)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-1 py-0 h-4 border",
                      m.scope === 'global' ? "text-blue-400 border-blue-500/20" : "text-emerald-400 border-emerald-500/20"
                    )}>
                      {m.scope}
                    </Badge>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      disabledIds.includes(m.id) ? "bg-zinc-700" : "bg-emerald-500 animate-glow"
                    )} />
                  </div>
                  <h5 className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight mb-1">{m.summary}</h5>
                  <p className="text-[10px] text-zinc-500 italic line-clamp-2 leading-relaxed">{m.content}</p>
                </div>
              ))
            )}
          </div>
        </ScrollAreaUI>
      </div>
    </SheetContent>
  );
}

function ProjectOverview({ 
  project, 
  onUpdate, 
  onAddChat 
}: { 
  project: Project, 
  onUpdate: (updates: Partial<Project>) => void,
  onAddChat: () => void 
}) {
  const [instructions, setInstructions] = useState(project.instructions || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Simulate upload
    const newFiles: ProjectFile[] = (Array.from(files) as File[]).map(f => ({
      id: "f_" + Math.random().toString(36).substr(2, 9),
      name: f.name,
      type: f.type.startsWith('image/') ? 'photo' : 'file',
      size: f.size,
      created_at: Date.now()
    }));
    
    onUpdate({ files: [...(project.files || []), ...newFiles] });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
      <div className="h-16 glass-card glass-card-dark rounded-none border-b border-border flex items-center justify-between px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Layout size={18} className="text-emerald-500" />
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest text-crisp">{project.name} Details</h2>
        </div>
        <Button onClick={onAddChat} className="btn-primary text-[10px] h-8 px-4 uppercase tracking-widest">
          Start Project Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Instructions Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold">
              <Info size={14} />
              <span>Project Instructions</span>
            </div>
            <div className="relative group">
              <textarea 
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                onBlur={() => onUpdate({ instructions })}
                placeholder="What should the agents know about this project?"
                className="w-full min-h-[120px] glass-card glass-card-dark rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:glass-card-accent transition-all resize-none"
              />
              <p className="mt-2 text-[10px] text-zinc-500 italic">These instructions will be automatically injected into every conversation within this project.</p>
            </div>
          </section>

          {/* Knowledge / Files Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-[0.2em] text-[10px] font-bold">
                <Database size={14} />
                <span>Project Knowledge</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="h-7 border-border text-[9px] font-bold uppercase tracking-widest"
              >
                <Upload size={12} className="mr-2" /> Upload Assets
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleUpload} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.files && project.files.length > 0 ? (
                project.files.map(file => (
                  <div key={file.id} className="flex items-center gap-4 p-4 glass-card glass-card-dark border-border/50 hover:glass-card-accent transition-all group">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      file.type === 'photo' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-400"
                    )}>
                      {file.type === 'photo' ? <ImageIcon size={20} /> : <FileIcon size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-200 truncate">{file.name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">{(file.size || 0) / 1024 > 1024 ? `${((file.size || 0) / 1024 / 1024).toFixed(1)} MB` : `${((file.size || 0) / 1024).toFixed(1)} KB`}</p>
                    </div>
                    <button 
                      onClick={() => onUpdate({ files: project.files.filter(f => f.id !== file.id) })}
                      className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-zinc-500 gap-3">
                  <Upload size={24} className="opacity-20" />
                  <p className="text-xs font-medium italic">No assets uploaded to this project yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}

function ChatNode({ 
  chat, 
  active, 
  onClick, 
  onEdit, 
  onDelete, 
  isEditing, 
  editValue, 
  setEditValue, 
  saveEdit 
}: { 
  key?: string | number,
  chat: Chat, 
  active: boolean, 
  onClick: () => void, 
  onEdit: () => void, 
  onDelete: () => void,
  isEditing: boolean,
  editValue: string,
  setEditValue: (v: string) => void,
  saveEdit: () => void
}) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all group",
        active ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-zinc-500 hover:bg-muted/30 hover:text-zinc-300"
      )}
    >
      <FileText size={10} className={cn(active ? "text-blue-400" : "text-zinc-500")} />
      
      {isEditing ? (
        <div className="flex-1 flex items-center gap-1">
          <input 
            value={editValue} 
            autoFocus 
            onChange={e => setEditValue(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && saveEdit()} 
            className="flex-1 bg-transparent border-none p-0 text-[10px] text-zinc-100 focus:outline-none" 
          />
          <button onClick={saveEdit} className="text-emerald-500"><Check size={10} /></button>
        </div>
      ) : (
        <button onClick={onClick} className="flex-1 text-[10px] font-medium truncate text-left">{chat.title}</button>
      )}

      {!isEditing && (
        <div className="hidden group-hover:flex items-center gap-1">
          <button onClick={onEdit} className="p-1 hover:text-zinc-100 transition-colors"><Edit2 size={10} /></button>
          <button onClick={onDelete} className="p-1 hover:text-rose-500 transition-colors"><Trash2 size={10} /></button>
        </div>
      )}
    </div>
  );
}

