import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Node, Edge, Handle, Position, NodeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Bot, Mail, MessageSquare, Plus, Network, X, Send, LayoutGrid, List, Filter, Search, Tag, Users, Clock, PlusCircle, Paperclip } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useNavigate } from 'react-router-dom';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { doc, updateDoc, collection, onSnapshot, query, where, addDoc, orderBy } from 'firebase/firestore';

const CustomOrgNode = ({ data }: NodeProps) => {
  const isHuman = data.type === 'human';
  const layer = data.layer || 'personal';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.name);

  const handleSave = () => {
    data.onRename?.(data.id, editValue);
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "px-4 py-3 rounded-xl border w-64 shadow-xl backdrop-blur-md relative group transition-all",
      isHuman 
        ? "bg-white/80 border-blue-200 text-slate-800" 
        : layer === 'org' 
          ? "glass-card-dark border-emerald-500/50 shadow-[0_0_15px_rgba(0,230,168,0.15)]"
          : "glass-card-dark border-slate-600"
    )}>
      <Handle type="target" position={Position.Top} className="w-16 h-1 border-none rounded-b-md bg-slate-300" />
      
      {/* Layer Badge */}
      {!isHuman && (
        <div className={cn(
          "absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
          layer === 'org' ? "bg-[#00E6A8] text-slate-900 border-emerald-400" : "bg-slate-700 text-slate-100 border-slate-600"
        )}>
          {layer}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 text-xl font-bold bg-white/50",
          isHuman 
            ? "border-blue-200 text-blue-600" 
            : "border-emerald-500/30 text-[#00E6A8]"
        )}>
          {isHuman ? 'H' : 'A'}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input 
                className="bg-slate-100 border-none text-sm font-bold w-full focus:outline-none rounded px-1 text-slate-800"
                value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <button onClick={handleSave} className="text-[#00E6A8]"><Plus size={14} className="rotate-45" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-between group/name">
              <span className="font-bold text-sm truncate leading-tight">{data.name}</span>
              <button 
                onClick={() => setIsEditing(true)} 
                className="opacity-0 group-hover/name:opacity-100 text-slate-400 hover:text-slate-800 transition-opacity"
              >
                <Plus size={10} className="rotate-45" />
              </button>
            </div>
          )}
          <span className="text-[11px] text-slate-500 truncate font-medium">{data.role}</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <div className={cn("w-2 h-2 rounded-full mt-1.5", data.status === 'online' ? "bg-green-500" : "bg-slate-300")} />
        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{data.department || 'General'}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 h-1 border-none rounded-t-md bg-slate-300" />
    </div>
  );
};

const nodeTypes = {
  orgNode: CustomOrgNode,
};

export default function OrgView({ agents }: { agents: any[] }) {
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Director of Autonomous Ops");
  const [activeTab, setActiveTab] = useState("chart");
  
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchProj, setSearchProj] = useState("");
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const [humans, setHumans] = useState([
    { id: "h1", name: "Rusty", role: "Chief Architect", department: "Engineering", status: "online" },
    { id: "h2", name: "Cody", role: "Product Lead", department: "Product", status: "online" },
    { id: "h3", name: "Andrea", role: "Operations Director", department: "Operations", status: "online" },
    { id: "h4", name: "Sheryl", role: "Marketing Head", department: "Marketing", status: "offline" }
  ]);

  // Read data from DB
  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;

    const unsubProjects = onSnapshot(query(collection(db, "projects"), where("owner_id", "==", uid)), (snap) => {
      setDbProjects(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });

    // Mock orgId for now based on user
    const unsubChannels = onSnapshot(query(collection(db, "discussionChannels"), where("orgId", "==", uid)), (snap) => {
      const chs = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setChannels(chs);
      if (chs.length > 0 && !activeChannelId) setActiveChannelId(chs[0].id);
    });

    return () => {
      unsubProjects();
      unsubChannels();
    };
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    if (!activeChannelId) return;
    const unsubMessages = onSnapshot(query(collection(db, "discussionMessages"), where("channelId", "==", activeChannelId)), (snap) => {
      setMessages(snap.docs.map(d => {
        const data = d.data();
        return {id: d.id, ...data};
      }).sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0)));
    });
    return () => unsubMessages();
  }, [activeChannelId]);

  const nodes: Node[] = useMemo(() => {
    const orgNodes: Node[] = [];
    
    const handleRename = async (id: string, newName: string) => {
      if (id.startsWith('h')) {
        setHumans(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h));
      } else {
        try {
          await updateDoc(doc(db, "agents", id), { name: newName });
        } catch (error) {
          handleFirestoreError(error, "update", `agents/${id}`);
        }
      }
    };

    // Top tier: humans
    humans.forEach((h, i) => {
      orgNodes.push({
        id: h.id,
        type: 'orgNode',
        position: { x: 300 * i, y: 50 },
        data: {
          id: h.id,
          name: h.name,
          role: h.role,
          department: h.department,
          status: h.status,
          type: 'human',
          onRename: handleRename
        }
      });
    });

    // Tier 2: AI mirrors (assuming agents map to humans initially or just spread them out)
    agents.forEach((a, i) => {
      orgNodes.push({
        id: a.id,
        type: 'orgNode',
        position: { x: 300 * (i % 4), y: 250 + Math.floor(i/4)*200 },
        data: {
          id: a.id,
          name: a.name,
          role: a.role,
          department: a.layer === 'org' ? 'Strategy' : 'Execution',
          status: 'online',
          type: 'agent',
          layer: a.layer,
          onRename: handleRename
        }
      });
    });

    return orgNodes;
  }, [humans, agents, navigate]);

  const edges: Edge[] = useMemo(() => {
    const orgEdges: Edge[] = [];
    agents.forEach((a, i) => {
      if (humans[i % 4]) {
        orgEdges.push({
          id: `e-${humans[i % 4].id}-${a.id}`,
          source: humans[i % 4].id,
          target: a.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2, opacity: 0.8 },
        });
      }
    });
    return orgEdges;
  }, [humans, agents]);

  const handleCreateChannel = async () => {
    if (!auth.currentUser) return;
    const name = prompt("Channel name:");
    if (!name) return;
    try {
      await addDoc(collection(db, "discussionChannels"), {
        orgId: auth.currentUser.uid,
        name: '#' + name.toLowerCase().replace(/\\s+/g, '-'),
        type: 'public',
        createdAt: Date.now()
      });
    } catch(err) {
      handleFirestoreError(err, 'create', 'discussionChannels');
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChannelId || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "discussionMessages"), {
        channelId: activeChannelId,
        senderId: auth.currentUser.uid,
        senderType: 'human',
        content: messageInput,
        createdAt: Date.now()
      });
      setMessageInput("");
    } catch (err) {
      handleFirestoreError(err, 'create', 'discussionMessages');
    }
  };

  const getSenderName = (id: string, type: string) => {
    if (type === 'agent') {
      const a = agents.find(ag => ag.id === id);
      return a ? a.name : 'Unknown Agent';
    } else {
      if (id === auth.currentUser?.uid) return 'You';
      const h = humans.find(hm => hm.id === id);
      return h ? h.name : 'Operator';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Organization Hub</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">SaaS Collaboration Platform & Neural Networks.</p>
        </div>
        
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger render={<Button className="btn-primary" />}>
               <Mail size={16} className="mr-2" /> Invite Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Onboard Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-sm">
                <label className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Email Address</label>
                <Input 
                  autoFocus
                  placeholder="operator@system.io" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2 text-sm">
                <label className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Role / Title</label>
                <Input 
                  placeholder="Director of Operations" 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                />
              </div>
              <Button onClick={() => setInviteOpen(false)} className="w-full btn-primary mt-4">
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-slate-200/50 p-1 rounded-lg w-fit">
          <TabsTrigger value="chart" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md px-6 font-semibold">Org Chart</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md px-6 font-semibold">Projects</TabsTrigger>
          <TabsTrigger value="discussions" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md px-6 font-semibold">Discussions</TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-6 relative min-h-0">
          <TabsContent value="chart" className="absolute inset-0 m-0">
            <Card className="h-full overflow-hidden bg-slate-50 border-slate-200 relative shadow-inner">
              <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
              >
                <Background color="#cbd5e1" gap={20} size={2} />
              </ReactFlow>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="absolute inset-0 m-0 overflow-auto">
             <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="relative flex-1 max-w-sm">
                     <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                     <Input 
                       className="pl-10 bg-white" 
                       placeholder="Search projects..." 
                       value={searchProj}
                       onChange={e => setSearchProj(e.target.value)}
                     />
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-2">
                     <select className="bg-white border text-sm rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:border-[#00E6A8] text-slate-700 font-medium shadow-sm transition-colors" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="all">Status</option>
                        <option value="active">Active</option>
                        <option value="planning">Planning</option>
                        <option value="completed">Completed</option>
                     </select>
                     <select className="bg-white border text-sm rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:border-[#00E6A8] text-slate-700 font-medium shadow-sm transition-colors" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                        <option value="all">Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                     </select>
                     <select className="bg-white border text-sm rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:border-[#00E6A8] text-slate-700 font-medium shadow-sm transition-colors" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                        <option value="all">Department</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="operations">Operations</option>
                     </select>
                     <div className="flex border rounded-md overflow-hidden bg-white shadow-sm ml-1">
                        <button onClick={() => setViewMode('grid')} className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-slate-100 text-[#00E6A8]" : "text-slate-400 hover:text-slate-700")}>
                           <LayoutGrid size={16} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={cn("p-2 transition-colors border-l", viewMode === 'list' ? "bg-slate-100 text-[#00E6A8]" : "text-slate-400 hover:text-slate-700")}>
                           <List size={16} />
                        </button>
                     </div>
                   </div>
                </div>
                
                <div className={cn("gap-6 pb-6", viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
                  {(dbProjects || []).filter(p => {
                    if (!p) return false;
                    if (searchProj && !p.name?.toLowerCase().includes(searchProj.toLowerCase())) return false;
                    if (statusFilter !== 'all' && (p.status || 'planning') !== statusFilter) return false;
                    if (priorityFilter !== 'all' && (p.priority || 'medium') !== priorityFilter) return false;
                    if (departmentFilter !== 'all' && (p.department || 'engineering') !== departmentFilter) return false;
                    return true;
                  }).map(p => (
                    viewMode === 'grid' ? (
                      <Card key={p.id} className="glass-card hover:border-[#00E6A8] transition-all cursor-pointer group flex flex-col items-stretch" onClick={() => navigate('/chat')}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                             <Badge variant="outline" className={cn(
                               "capitalize",
                               (p.status || 'planning') === 'active' ? "bg-blue-50 text-blue-700 border-blue-200" :
                               (p.status || 'planning') === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                             )}>{p.status || 'Planning'}</Badge>
                             <div className="flex flex-col gap-1 items-end">
                                <AvatarStack agents={(agents || []).slice(0,3)} size="sm" />
                             </div>
                          </div>
                          <CardTitle className="text-lg leading-tight mt-3 text-slate-800 group-hover:text-[#00cfa0] transition-colors">{p.name || "Untitled"}</CardTitle>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">{(p.department || 'Engineering')} • {(p.priority || 'Medium')} Priority</p>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-end">
                          <p className="text-sm text-slate-500 my-4 line-clamp-2 min-h-[40px] italic">{p.instructions || "No detailed description provided... "}</p>
                          <div className="flex flex-col gap-2 mt-auto">
                             <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                               <span>Progress</span>
                               <span className="text-slate-700">{p.progress || 0}%</span>
                             </div>
                             <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                               <div className="bg-[#00E6A8] h-full rounded-full transition-all duration-500" style={{ width: `${p.progress || 0}%` }} />
                             </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                             <span className="flex items-center gap-1 font-mono"><Clock size={12} className="text-slate-400"/> {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'No Due Date'}</span>
                             <span className="flex items-center gap-1 font-mono text-slate-400 font-semibold"><Users size={12}/> {p.teamMembers?.length || 2}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card key={p.id} className="glass-card hover:border-[#00E6A8] transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between p-4 px-6" onClick={() => navigate('/chat')}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-shrink-0">
                             <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xl group-hover:text-[#00e6a8] group-hover:bg-[#00e6a8]/10 transition-colors">
                               {(p.name || 'P').slice(0, 1).toUpperCase()}
                             </div>
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex items-center gap-2 mb-1">
                               <h3 className="font-bold text-lg text-slate-800 truncate group-hover:text-[#00cfa0] transition-colors">{p.name || "Untitled"}</h3>
                               <Badge variant="outline" className={cn(
                                 "capitalize text-[10px] h-5",
                                 (p.status || 'planning') === 'active' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                 (p.status || 'planning') === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-300"
                               )}>{p.status || 'Planning'}</Badge>
                             </div>
                             <p className="text-xs text-slate-500 truncate mb-1"><span className="font-medium text-slate-600">{(p.department || 'Engineering')}</span> • <span className="font-medium">{(p.priority || 'Medium').toUpperCase()}_PRI</span> • {p.instructions || "No description."}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 md:mt-0 flex-shrink-0 min-w-[300px]">
                            <div className="flex flex-col gap-1 flex-1">
                               <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                 <span>Progress</span>
                                 <span className="text-slate-800">{p.progress || 0}%</span>
                               </div>
                               <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                 <div className="bg-[#00E6A8] h-full rounded-full transition-all duration-500" style={{ width: `${p.progress || 0}%` }} />
                               </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Team</span>
                               <AvatarStack agents={(agents || []).slice(0,3)} size="sm" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400 whitespace-nowrap hidden lg:flex"><Clock size={12}/> {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'No date'}</span>
                        </div>
                      </Card>
                    )
                  ))}
                  {dbProjects.length === 0 && (
                     <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-xl border border-dashed border-slate-300">
                        <LayoutGrid size={48} className="mb-4 text-slate-300"/>
                        <p className="font-medium text-slate-600">No projects found.</p>
                        <Button className="mt-4 btn-primary" onClick={() => navigate('/chat')}>Create Project</Button>
                     </div>
                  )}
                </div>
             </div>
          </TabsContent>

          <TabsContent value="discussions" className="absolute inset-0 m-0">
             <Card className="h-full flex overflow-hidden border-slate-200 bg-white">
                <div className="w-64 border-r border-slate-100 bg-slate-50 flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="font-bold text-slate-700 text-sm">Channels</h3>
                     <button onClick={handleCreateChannel} className="text-slate-400 hover:text-slate-800 transition-colors"><PlusCircle size={16}/></button>
                  </div>
                  <ScrollArea className="flex-1 p-2">
                     <div className="space-y-1">
                       {channels.map(ch => (
                         <button 
                           key={ch.id} 
                           onClick={() => setActiveChannelId(ch.id)}
                           className={cn(
                             "w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors",
                             activeChannelId === ch.id ? "bg-emerald-50 text-[#00cfa0]" : "text-slate-600 hover:bg-slate-100"
                           )}
                         >
                           <MessageSquare size={14} className={activeChannelId === ch.id ? "text-[#00E6A8]" : "text-slate-400"} />
                           {ch.name}
                         </button>
                       ))}
                       {channels.length === 0 && <p className="text-xs text-slate-400 px-3 py-2">No channels.</p>}
                     </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-slate-100">
                     <h3 className="font-bold text-slate-700 text-sm mb-3">Online</h3>
                     <div className="space-y-3">
                        {humans.filter(h => h.status === 'online').map(h => (
                           <div key={h.id} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex justify-center items-center font-bold">H</div>
                              {h.name}
                           </div>
                        ))}
                     </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col bg-white">
                  <div className="p-4 border-b border-slate-100 flex items-center shadow-sm z-10">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <MessageSquare size={18} className="text-slate-400"/> 
                       {channels.find(c => c.id === activeChannelId)?.name || 'Select a channel'}
                    </h3>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      {messages.map((m, i) => (
                        <div key={i} className={cn("flex gap-4 max-w-2xl", m.senderId === auth.currentUser?.uid && "ml-auto flex-row-reverse")}>
                           <div className={cn(
                             "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-lg",
                             m.senderType === 'agent' ? "bg-emerald-100 text-[#00E6A8]" : "bg-blue-100 text-blue-600"
                           )}>
                             {m.senderType === 'agent' ? 'A' : m.senderId === auth.currentUser?.uid ? 'U' : 'H'}
                           </div>
                           <div className={cn("flex flex-col gap-1", m.senderId === auth.currentUser?.uid && "items-end")}>
                             <div className="flex items-baseline gap-2">
                               <span className="font-bold text-slate-800 text-sm">{getSenderName(m.senderId, m.senderType)}</span>
                               <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <div className={cn(
                               "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                               m.senderId === auth.currentUser?.uid ? "bg-[#00E6A8] text-slate-900 rounded-tr-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"
                             )}>
                               {m.content}
                             </div>
                           </div>
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <div className="text-center text-slate-400 py-10">No messages in this discussion yet.</div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-slate-100 bg-white">
                     <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-[#00E6A8] focus-within:ring-1 focus-within:ring-[#00E6A8] transition-all">
                       <Input 
                         className="flex-1 border-none shadow-none bg-transparent focus-visible:ring-0 py-6"
                         placeholder={`Message ${channels.find(c => c.id === activeChannelId)?.name || '...'}`}
                         value={messageInput}
                         onChange={e => setMessageInput(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                       />
                       <button onClick={handleSendMessage} className="p-3 m-2 bg-[#00E6A8] hover:bg-[#00cfa0] text-slate-900 rounded-lg transition-colors">
                         <Send size={18}/>
                       </button>
                     </div>
                  </div>
                </div>
             </Card>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
}

function AvatarStack({ agents, size = "md" }: { agents: any[], size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <div className="flex -space-x-2">
      {agents.map((a, i) => (
        <div key={i} title={a.name} className={cn("rounded-full bg-slate-800 text-[#00E6A8] border-2 border-white flex items-center justify-center font-bold object-cover", s)}>
          {a.name.slice(0, 2).toUpperCase()}
        </div>
      ))}
    </div>
  )
}
