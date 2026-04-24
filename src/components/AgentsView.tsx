import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Play, 
  Settings, 
  Trash2, 
  MoreVertical,
  Cpu,
  Layers,
  Activity,
  GitBranch,
  Globe,
  Database,
  Plus,
  Terminal,
  User,
  Bot,
  ShieldCheck,
  Zap,
  Search,
  ArrowRight,
  Shuffle,
  GitMerge,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";
import socket from "../lib/socket";
import { db, auth, handleFirestoreError } from "../lib/firebase";
import { doc, setDoc, deleteDoc, collection, addDoc, updateDoc } from "firebase/firestore";

export default function AgentsView({ agents }: { agents: any[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [expandedAgentIds, setExpandedAgentIds] = useState<string[]>([]);
  const [collaborationRules, setCollaborationRules] = useState<any[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  
  const selectedAgents = agents.filter(a => selectedAgentIds.includes(a.id));
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    model: "gemini-1.5-flash",
    type: "agent",
    layer: "personal",
    personality: "professional",
    temperature: 0.7,
    taskPrioritization: 0.5,
    maxTokens: 2048,
    instructions: "",
    memory_provider: "LanceDB-Standard",
    tools: [] as string[],
    skills: [] as string[],
    toolsEnabled: true,
    permissions: {
      read: true,
      write: true,
      remember: true,
      share: false
    }
  });
  const [skillSearch, setSkillSearch] = useState("");

  const availableTools = [
    { id: "web_search", name: "Web Search", icon: Globe },
    { id: "code_interpreter", name: "Code Interpreter", icon: Terminal },
    { id: "git_access", name: "Git Access", icon: GitBranch },
    { id: "image_gen", name: "Image Generator", icon: Zap },
    { id: "memory_vault", name: "Long-term Memory", icon: Database },
    { id: "neural_defense", name: "Neural Defense", icon: ShieldCheck }
  ];

  const availableSkills = [
    "Strategic Planning", "Data Analysis", "Cyber Defense", 
    "System Architecture", "Rapid Prototyping", "Natural Language",
    "Conflict Resolution", "Resource Management", "Neural Mapping",
    "Orbital Logistics", "Quantum Encryption", "Social Engineering",
    "Heuristic Search", "Pattern Recognition", "Signal Intelligence",
    "Mesh Networking", "Biometric Scanning", "Autonomous Flight",
    "Market Prediction", "Linguistic Analysis", "Psychological Profiling"
  ];

  const toggleTool = (toolId: string) => {
    const tools = formData.tools.includes(toolId)
      ? formData.tools.filter(t => t !== toolId)
      : [...formData.tools, toolId];
    setFormData({ ...formData, tools });
  };

  const openEditDialog = (agent: any) => {
    setFormData({
      name: agent.name || "",
      role: agent.role || "",
      model: agent.model || "gemini-1.5-flash",
      type: agent.type || "agent",
      layer: agent.layer || "personal",
      personality: agent.personality || "professional",
      temperature: agent.temperature || 0.7,
      taskPrioritization: agent.taskPrioritization || 0.5,
      maxTokens: agent.maxTokens || 2048,
      instructions: agent.instructions || "",
      memory_provider: agent.memory_provider || "LanceDB-Standard",
      tools: agent.tools || [],
      skills: agent.skills || [],
      toolsEnabled: agent.toolsEnabled ?? true,
      permissions: agent.permissions || {
        read: true,
        write: true,
        remember: true,
        share: false
      }
    });
    setEditingAgentId(agent.id);
    setIsCreateOpen(true);
  };

  const runAgent = (agentId: string) => {
    socket.emit("run_agent", agentId);
  };

  const decommissionAgent = async (agentId: string) => {
    try {
      await deleteDoc(doc(db, "agents", agentId));
      if (selectedAgent?.id === agentId) setSelectedAgent(null);
    } catch (error) {
      handleFirestoreError(error, "delete", `agents/${agentId}`);
    }
  };

  const decommissionSelected = async () => {
    for (const id of selectedAgentIds) {
      await decommissionAgent(id);
    }
    setSelectedAgentIds([]);
  };

  const handleCreate = async () => {
    if (!formData.name || !auth.currentUser) return;
    
    try {
      const agentData = {
        ...formData,
        userId: auth.currentUser.uid,
        updatedAt: new Date().toISOString()
      };

      if (editingAgentId) {
        await updateDoc(doc(db, "agents", editingAgentId), agentData);
      } else {
        await addDoc(collection(db, "agents"), {
          ...agentData,
          status: "idle",
          createdAt: new Date().toISOString()
        });
      }
      
      setIsCreateOpen(false);
      setEditingAgentId(null);
      setFormData({ 
        name: "", 
        role: "", 
        model: "gemini-1.5-flash", 
        type: "agent", 
        layer: "personal",
        personality: "professional",
        temperature: 0.7,
        taskPrioritization: 0.5,
        maxTokens: 2048,
        instructions: "",
        memory_provider: "LanceDB-Standard",
        tools: [],
        skills: [],
        toolsEnabled: true,
        permissions: { read: true, write: true, remember: true, share: false }
      });
    } catch (error) {
      handleFirestoreError(error, editingAgentId ? "update" : "create", "agents");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic text-crisp">Agent Workforce</h2>
          <p className="text-zinc-500 text-sm font-medium text-crisp">Managing autonomous nodes across active sectors.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setEditingAgentId(null);
            setFormData({ 
              name: "", 
              role: "", 
              model: "gemini-1.5-flash", 
              type: "agent", 
              layer: "personal",
              personality: "professional",
              temperature: 0.7,
              taskPrioritization: 0.5,
              maxTokens: 2048,
              instructions: "",
              memory_provider: "LanceDB-Standard",
              tools: [],
              skills: [],
              toolsEnabled: true,
              permissions: { read: true, write: true, remember: true, share: false }
            });
          }
        }}>
          <DialogTrigger render={<Button className="btn-primary text-xs shadow-lg shadow-emerald-500/20 px-6 h-10" />}>
            <Plus size={14} className="mr-2" /> New Agent
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-card border-border text-zinc-100 overflow-hidden flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold italic tracking-tight">
                {editingAgentId ? `Configure Node: ${formData.name}` : "Deploy New AI Node"}
              </DialogTitle>
              <DialogDescription className="text-zinc-500">
                Configure advanced parameters for your autonomous intelligence.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="identity" className="w-full flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="intelligence">Cognition</TabsTrigger>
                <TabsTrigger value="neural">Neural</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 pr-4 -mr-4">
                <TabsContent value="identity" className="space-y-4 mt-0">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Node Designation</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Sentinel-4" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-muted border-border text-zinc-100 focus:border-emerald-500/50" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Functional Role</Label>
                    <Input 
                      id="role" 
                      placeholder="e.g. Lead Orchestrator" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="bg-muted border-border text-zinc-100 focus:border-emerald-500/50" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Personality Vector</Label>
                    <Select 
                      value={formData.personality} 
                      onValueChange={(val) => setFormData({ ...formData, personality: val })}
                    >
                      <SelectTrigger className="bg-muted border-border text-zinc-100 italic h-9 text-xs">
                        <SelectValue placeholder="Select personality" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-zinc-100 italic">
                        <SelectItem value="professional" className="text-xs">Professional</SelectItem>
                        <SelectItem value="aggressive" className="text-xs">Aggressive Tactical</SelectItem>
                        <SelectItem value="concise" className="text-xs">Minimalist</SelectItem>
                        <SelectItem value="creative" className="text-xs">Creative Solver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Core Directives</Label>
                    <Textarea 
                      placeholder="Behavior overrides and specific task instructions..." 
                      className="bg-muted border-border text-xs min-h-[120px] focus:border-emerald-500/50"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="intelligence" className="space-y-4 mt-0">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Model Route</Label>
                    <Select 
                      value={formData.model} 
                      onValueChange={(val) => setFormData({ ...formData, model: val })}
                    >
                      <SelectTrigger className="bg-muted border-border text-zinc-100 italic h-9 text-xs">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-zinc-100">
                        <SelectItem value="gemini-1.5-flash" className="text-xs tracking-tight font-medium">1.5 Flash (Standard)</SelectItem>
                        <SelectItem value="gemini-1.5-flash-002" className="text-xs tracking-tight font-medium">1.5 Flash (v002)</SelectItem>
                        <SelectItem value="gemini-1.5-flash-8b" className="text-xs tracking-tight font-medium">1.5 Flash-8B (Tiny)</SelectItem>
                        <SelectItem value="gemini-1.5-pro" className="text-xs tracking-tight font-medium">1.5 Pro (Standard)</SelectItem>
                        <SelectItem value="gemini-1.5-pro-002" className="text-xs tracking-tight font-medium">1.5 Pro (v002)</SelectItem>
                        <SelectItem value="gemini-2.0-flash-exp" className="text-xs tracking-tight text-emerald-500 font-bold">2.0 Flash (Exp)</SelectItem>
                        <SelectItem value="gemini-2.0-pro-exp-02-05" className="text-xs tracking-tight text-amber-500 font-bold">2.0 Pro (Exp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Creativity (Temp)</Label>
                      <span className="text-[10px] font-mono text-emerald-500">{formData.temperature}</span>
                    </div>
                    <Slider 
                      min={0} 
                      max={2} 
                      step={0.1} 
                      value={[formData.temperature]} 
                      onValueChange={(vals) => setFormData({ ...formData, temperature: vals[0] })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Memory Infrastructure</Label>
                    <Select 
                      value={formData.memory_provider} 
                      onValueChange={(val) => setFormData({ ...formData, memory_provider: val })}
                    >
                      <SelectTrigger className="bg-muted border-border text-zinc-100 italic h-9 text-xs">
                        <SelectValue placeholder="Select Database" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-zinc-100 font-mono italic">
                        <SelectItem value="LanceDB-Standard" className="text-xs font-medium italic">LanceDB (Standard Vector)</SelectItem>
                        <SelectItem value="LanceDB-Org" className="text-xs font-medium italic">LanceDB-Org (Private Cloud)</SelectItem>
                        <SelectItem value="Pinecone-Helix" className="text-xs font-medium italic">Pinecone (Enterprise Hub)</SelectItem>
                        <SelectItem value="Mem0-Core" className="text-xs font-medium italic">Mem0 (Personal Neural)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Augmented Tools</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTools.map(tool => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => toggleTool(tool.id)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase transition-all",
                            formData.tools.includes(tool.id) 
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-400" 
                              : "bg-muted border-border text-zinc-500"
                          )}
                        >
                          <tool.icon size={12} />
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pb-4 border-b border-border/30">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Skills Manifest [ClawHub Sync]</Label>
                      <Badge variant="outline" className="text-[8px] bg-amber-500/10 text-amber-500 border-none px-1 h-4 animate-pulse">Live Link</Badge>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
                      <Input 
                        placeholder="Search ClawHub for skills..." 
                        className="bg-muted/50 border-border h-8 pl-8 text-[10px] font-mono italic"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1 custom-scrollbar">
                      {availableSkills
                        .filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()))
                        .map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => {
                            const skillsList = formData.skills.includes(skill)
                              ? formData.skills.filter(s => s !== skill)
                              : [...formData.skills, skill];
                            setFormData({ ...formData, skills: skillsList });
                          }}
                          className={cn(
                            "px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all border",
                            formData.skills.includes(skill)
                              ? "bg-emerald-500 border-emerald-400 text-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              : "bg-muted/30 border-border/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                      {availableSkills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).length === 0 && (
                        <div className="w-full py-4 text-center">
                          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">No skill nodes found in mesh with matching signature</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                      <span className="text-[9px] text-zinc-500 font-medium">Want more skills?</span>
                      <div className="flex items-center gap-3">
                        <a href="https://clawhub.com" target="_blank" rel="noopener noreferrer" className="text-[9px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                          <Globe size={10} /> ClawHub
                        </a>
                        <a href="https://github.com/Antigravity-Inc/openclaw" target="_blank" rel="noopener noreferrer" className="text-[9px] text-zinc-400 hover:text-zinc-200 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                          <GitBranch size={10} /> GitHub
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Personality Architecture</Label>
                    </div>
                    <Select 
                      value={formData.personality} 
                      onValueChange={(val) => setFormData({ ...formData, personality: val })}
                    >
                      <SelectTrigger className="bg-muted border-border text-zinc-100 italic h-9 text-xs">
                        <SelectValue placeholder="Standard" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-zinc-100 italic">
                        <SelectItem value="Professional" className="text-xs">Professional</SelectItem>
                        <SelectItem value="Aggressive" className="text-xs">Aggressive Tactical</SelectItem>
                        <SelectItem value="Concise" className="text-xs">Minimalist</SelectItem>
                        <SelectItem value="Creative" className="text-xs">Creative Solver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cognitive Temperature</Label>
                      <span className="text-[10px] font-mono text-blue-400">{formData.temperature}</span>
                    </div>
                    <Slider min={0} max={1} step={0.1} value={[formData.temperature]} onValueChange={(v) => setFormData({...formData, temperature: v[0]})} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Task Prioritization</Label>
                      <span className="text-[10px] font-mono text-emerald-500">{formData.taskPrioritization}</span>
                    </div>
                    <Slider 
                      min={0} 
                      max={1} 
                      step={0.1} 
                      value={[formData.taskPrioritization]} 
                      onValueChange={(vals) => setFormData({ ...formData, taskPrioritization: vals[0] })}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Max Response Length</Label>
                      <span className="text-[10px] font-mono text-emerald-500">{formData.maxTokens}</span>
                    </div>
                    <Slider 
                      min={256} 
                      max={8192} 
                      step={256} 
                      value={[formData.maxTokens]} 
                      onValueChange={(vals) => setFormData({ ...formData, maxTokens: vals[0] })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="neural" className="space-y-4 mt-0">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Architecture & Layer</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                        <SelectTrigger className="bg-muted border-border text-zinc-100 italic h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-border"><SelectItem value="agent">Agent</SelectItem><SelectItem value="sub-agent">Sub-Agent</SelectItem></SelectContent>
                      </Select>
                      <Select value={formData.layer} onValueChange={(val) => setFormData({ ...formData, layer: val })}>
                        <SelectTrigger className="bg-muted border-border text-zinc-100 h-9 text-xs font-bold uppercase text-emerald-500"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-card border-border"><SelectItem value="personal">Personal</SelectItem><SelectItem value="org">Org</SelectItem><SelectItem value="dept">Dept</SelectItem><SelectItem value="role">Role</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Neural Permissions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(formData.permissions).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, permissions: { ...formData.permissions, [key]: !value } })}
                          className={cn("flex items-center justify-between px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase transition-all", value ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500" : "bg-muted border-border text-zinc-500")}
                        >
                          {key}
                          <div className={cn("w-1.5 h-1.5 rounded-full", value ? "bg-emerald-500 animate-pulse" : "bg-zinc-700")} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="space-y-0.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-100">Tools Access</Label>
                      <p className="text-[9px] text-zinc-500">Allow node to execute functions.</p>
                    </div>
                    <Switch checked={formData.toolsEnabled} onCheckedChange={(val) => setFormData({ ...formData, toolsEnabled: val })} />
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="pt-4 border-t border-border mt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="btn-secondary h-10 px-6 border-none">Abort</Button>
              <Button onClick={handleCreate} className="btn-primary h-10 px-8">
                {editingAgentId ? "Update Configuration" : "Initiate Deployment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="glass-card-dark/10 p-0.5 rounded-lg w-fit mb-4">
        <TabsList className="bg-transparent border border-border/50">
          <TabsTrigger value="all" className="text-[10px] uppercase font-bold tracking-widest h-7">All Units</TabsTrigger>
          <TabsTrigger value="personal" className="text-[10px] uppercase font-bold tracking-widest h-7">Personal</TabsTrigger>
          <TabsTrigger value="org" className="text-[10px] uppercase font-bold tracking-widest h-7">Organization</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents
          .filter(a => activeTab === 'all' || a.layer === activeTab)
          .map((agent) => {
            const isExpanded = expandedAgentIds.includes(agent.id);
            const isSelected = selectedAgentIds.includes(agent.id);

            return (
              <Card 
                key={agent.id} 
                className={cn(
                  "glass-card glass-card-dark group hover:border-emerald-500/20 transition-all relative overflow-hidden",
                  isSelected ? "shadow-[0_0_15px_rgba(255,90,0,0.1)] border-emerald-500/30" : ""
                )}
              >
                {/* Architecture & Status Indicator */}
                <div className="absolute top-0 right-0 flex">
                  <div className={cn(
                    "px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-widest border-l border-b border-white/5",
                    agent.status === 'running' ? "text-emerald-400 bg-emerald-900/10" : 
                    agent.status === 'failed' ? "text-rose-400 bg-rose-900/10" : "text-zinc-500 bg-zinc-900/5"
                  )}>
                    {agent.status}
                  </div>
                </div>

                <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between border-b border-white/5 bg-white/2">
                  <div className="flex items-center gap-2.5">
                    <button 
                      className={cn(
                        "w-5 h-5 rounded border transition-all flex items-center justify-center",
                        isSelected ? "bg-emerald-500 border-emerald-400" : "bg-zinc-800/50 border-white/5 hover:border-zinc-500"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgentIds(prev => prev.includes(agent.id) ? prev.filter(id => id !== agent.id) : [...prev, agent.id]);
                      }}
                    >
                      <CheckCircle size={10} className={isSelected ? "text-white" : "text-transparent"} />
                    </button>

                    <div 
                      className="flex items-center gap-2 p-1 rounded pr-3"
                    >
                      <div className={cn(
                        "w-7 h-7 rounded border border-white/5 flex items-center justify-center bg-white/5",
                        agent.type === 'sub-agent' ? "text-blue-400" : "text-emerald-500"
                      )}>
                        {agent.type === 'sub-agent' ? <Layers size={14} /> : <Bot size={14} />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <input 
                          className="text-xs font-bold bg-transparent border-none text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 rounded px-1 -ml-1 w-full"
                          value={agent.name}
                          onChange={async (e) => {
                            try {
                              await updateDoc(doc(db, "agents", agent.id), { name: e.target.value });
                            } catch (err) {
                              handleFirestoreError(err, "update", `agents/${agent.id}`);
                            }
                          }}
                        />
                        <input 
                          className="text-[9px] font-mono bg-transparent border-none text-emerald-500/70 font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500/30 rounded px-1 -ml-1 w-full"
                          value={agent.role}
                          onChange={async (e) => {
                            try {
                              await updateDoc(doc(db, "agents", agent.id), { role: e.target.value });
                            } catch (err) {
                              handleFirestoreError(err, "update", `agents/${agent.id}`);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedAgentIds(prev => 
                          prev.includes(agent.id) ? prev.filter(id => id !== agent.id) : [...prev, agent.id]
                        );
                      }}
                      className="p-1.5 rounded hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-100" />}>
                        <MoreVertical size={14} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border text-zinc-300">
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); openEditDialog(agent); }}
                          className="focus:bg-muted focus:text-zinc-100 text-xs"
                        >
                          <Settings size={12} className="mr-2" /> Configure Node
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); runAgent(agent.id); }}
                          disabled={agent.status === 'running'}
                          className="focus:bg-muted focus:text-zinc-100 text-xs"
                        >
                          <Play size={12} className="mr-2" /> Initiate Mission
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); decommissionAgent(agent.id); }}
                          className="focus:bg-muted focus:text-zinc-100 text-xs text-rose-400"
                        >
                          <Trash2 size={12} className="mr-2" /> Decommission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex-shrink-0">Model:</span>
                      <Select 
                        value={agent.model} 
                        onValueChange={async (val) => {
                          try {
                            await updateDoc(doc(db, "agents", agent.id), { model: val });
                          } catch (err) {
                            handleFirestoreError(err, "update", `agents/${agent.id}`);
                          }
                        }}
                      >
                        <SelectTrigger className="h-5 bg-white/5 border-white/5 text-[8px] font-mono text-zinc-400 py-0 px-1 w-fit focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="gemini-1.5-flash" className="text-[10px]">1.5 Flash</SelectItem>
                          <SelectItem value="gemini-1.5-pro" className="text-[10px]">1.5 Pro</SelectItem>
                          <SelectItem value="gemini-2.0-flash-exp" className="text-[10px]">2.0 Flash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Status:</span>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        agent.status === 'running' ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : 
                        agent.status === 'failed' ? "bg-rose-500" : "bg-zinc-700"
                      )} />
                    </div>
                  </div>

                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="space-y-4 pt-2 border-t border-white/5"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Authority Layer</span>
                          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-blue-500/5 text-blue-400 border-blue-500/20 py-0 h-4">
                            {agent.layer || 'personal'}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Personality</span>
                          <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest bg-amber-500/5 text-amber-500 border-amber-500/20 py-0 h-4">
                            {agent.personality || 'Standard'}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Cognitive Temp</span>
                          <p className="text-xs font-mono text-zinc-300">{agent.temperature || 0.7}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Task Priority</span>
                          <p className="text-xs font-mono text-emerald-500">{agent.taskPrioritization || 0.5}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Augmented Tools</span>
                        <div className="flex flex-wrap gap-1">
                          {(agent.tools || []).map((toolId: string) => {
                            const tool = availableTools.find(t => t.id === toolId);
                            if (!tool) return null;
                            return (
                              <Badge key={toolId} variant="outline" className="text-[7px] bg-blue-500/5 border-blue-500/10 text-blue-400 font-bold uppercase py-0 px-1">
                                {tool.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Skills Manifest</span>
                        <div className="flex flex-wrap gap-1">
                          {agent.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-[7px] bg-zinc-800/50 border border-white/5 text-zinc-500 font-bold uppercase py-0 px-1">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          onClick={(e) => { e.stopPropagation(); runAgent(agent.id); }}
                          disabled={agent.status === 'running'}
                          className={cn(
                            "w-full font-bold text-[9px] uppercase tracking-widest transition-all h-8",
                            agent.status === 'running' 
                              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                              : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                          )}
                        >
                          <Play size={10} className="mr-1.5 fill-current" />
                          Initiate Mission
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="mt-12 p-6 glass-card glass-card-dark">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-4 flex items-center gap-2">
          <Shuffle size={16} /> Collaboration Hub
        </h3>
        {selectedAgents.length < 2 ? (
          <p className="text-xs text-zinc-500 italic">Select at least two agents to establish a communication channel.</p>
        ) : (
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label className="text-[10px] text-zinc-500 font-bold uppercase">Source</Label>
              <Select onValueChange={setSourceId}>
                <SelectTrigger className="w-32 bg-muted h-9 text-xs"><SelectValue placeholder="Source"/></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {selectedAgents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <ArrowRight className="text-zinc-600 mb-2" />
            <div className="space-y-1">
              <Label className="text-[10px] text-zinc-500 font-bold uppercase">Target</Label>
              <Select onValueChange={setTargetId}>
                <SelectTrigger className="w-32 bg-muted h-9 text-xs"><SelectValue placeholder="Target"/></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {selectedAgents.filter(a => a.id !== sourceId).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => {
                if (sourceId && targetId) {
                  setCollaborationRules([...collaborationRules, {sourceId, targetId, id: Date.now()}]);
                }
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs h-9"
            >
              <GitMerge size={12} className="mr-2" /> Establish Link
            </Button>
          </div>
        )}
        
        {collaborationRules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Channels</h4>
            {collaborationRules.map(rule => (
              <div key={rule.id} className="flex items-center gap-2 bg-muted/30 p-2 rounded text-xs font-mono text-zinc-400">
                <CheckCircle size={10} className="text-emerald-500" />
                <span>{agents.find(a => a.id === rule.sourceId)?.name}</span>
                <ArrowRight size={10} />
                <span>{agents.find(a => a.id === rule.targetId)?.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Detail Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="sm:max-w-[700px] bg-card border-border text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold italic tracking-tight">{selectedAgent?.name} - Inspection</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Detailed technical specifications and audit trail.
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded border border-border">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Metadata</span>
                  <div className="mt-2 text-xs font-mono space-y-1">
                    <div className="flex justify-between"><span className="text-zinc-500">ID:</span> <span>{selectedAgent.id}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Role:</span> <span>{selectedAgent.role}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Model:</span> <span>{selectedAgent.model}</span></div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded border border-border">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Core Directives</span>
                  <p className="mt-2 text-xs text-zinc-400 italic">
                    {selectedAgent.instructions || "No custom instructions defined."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Activity Audit</span>
                <ScrollArea className="h-40 bg-zinc-900 p-3 rounded font-mono text-[10px] text-zinc-500 border border-border">
                  <div className="space-y-1">
                    <p>[09:12:01] System: Bootsequence established.</p>
                    <p>[09:15:33] Tool: WebSearch [SUCCESS]</p>
                    <p>[10:02:11] Memory: Vector index update complete.</p>
                    <p>[12:44:55] Action: Initiated Mission-209-A</p>
                    <p>[13:10:02] Log: Neural defense active.</p>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAgent(null)}>Close Inspection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
