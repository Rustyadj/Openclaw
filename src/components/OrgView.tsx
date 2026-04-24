import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  Handle, 
  Position,
  NodeProps,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bot, Mail, MessageSquare, Plus, Network, X, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useNavigate } from 'react-router-dom';
import socket from '../lib/socket';

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
      "px-4 py-3 rounded-xl border w-64 shadow-xl backdrop-blur-sm relative group",
      isHuman 
        ? "bg-zinc-900/90 border-blue-500/30 text-zinc-100" 
        : layer === 'org' 
          ? "bg-emerald-950/40 border-emerald-500/50 text-zinc-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : "bg-zinc-900/90 border-emerald-500/30 text-zinc-100"
    )}>
      <Handle type="target" position={Position.Top} className="w-16 h-1 border-none rounded-b-md bg-zinc-700/50" />
      
      {/* Layer Badge */}
      {!isHuman && (
        <div className={cn(
          "absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border",
          layer === 'org' ? "bg-emerald-500 text-zinc-950 border-emerald-400" : "bg-blue-500 text-zinc-100 border-blue-400"
        )}>
          {layer}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center border shrink-0",
          isHuman 
            ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        )}>
          {isHuman ? <User size={20} /> : <Bot size={20} />}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input 
                className="bg-muted border-none text-sm font-bold w-full focus:outline-none rounded px-1"
                value={editValue}
                autoFocus
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <button onClick={handleSave} className="text-emerald-500"><Plus size={14} className="rotate-45" /></button>
            </div>
          ) : (
            <div className="flex items-center justify-between group/name">
              <span className="font-bold text-sm truncate leading-tight uppercase font-mono">{data.name}</span>
              <button 
                onClick={() => setIsEditing(true)} 
                className="opacity-0 group-hover/name:opacity-100 text-zinc-500 hover:text-zinc-100 transition-opacity"
              >
                <Plus size={10} className="rotate-45" />
              </button>
            </div>
          )}
          <span className="text-[10px] text-zinc-500 truncate font-mono">{data.role}</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 flex-1 text-[10px] uppercase font-bold tracking-widest border-border bg-zinc-950/50 hover:bg-muted"
          onClick={() => data.onChat(data.id, data.name)}
        >
          <MessageSquare size={12} className="mr-1.5" />
          Chat
        </Button>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 h-1 border-none rounded-t-md bg-zinc-700/50" />
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
  const [activeChatModal, setActiveChatModal] = useState<{id: string, name: string} | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'target', content: string}[]>([]);

  // Humans state
  const [humans, setHumans] = useState([
    { id: "h1", name: "Rusty", role: "Chief Architect" },
  ]);

  // Derived ReactFlow state
  const nodes: Node[] = useMemo(() => {
    const orgNodes: Node[] = [];
    
    const handleRename = (id: string, newName: string) => {
      // If human, update local state
      if (id.startsWith('h')) {
        setHumans(prev => prev.map(h => h.id === id ? { ...h, name: newName } : h));
      } else {
        // If agent, emit socket event to backend
        socket.emit("update_agent", { id, name: newName });
      }
    };

    // Position humans at top
    humans.forEach((h, i) => {
      orgNodes.push({
        id: h.id,
        type: 'orgNode',
        position: { x: 250 * i, y: 50 },
        data: {
          id: h.id,
          name: h.name,
          role: h.role,
          type: 'human',
          onRename: handleRename,
          onChat: (id: string, name: string) => setActiveChatModal({id, name})
        }
      });
    });

    // Position agents below
    agents.filter(a => a.type === 'agent').forEach((a, i) => {
      orgNodes.push({
        id: a.id,
        type: 'orgNode',
        position: { x: (250 * i) - (agents.length * 100) + 150, y: 250 },
        data: {
          id: a.id,
          name: a.name,
          role: a.role,
          type: 'agent',
          layer: a.layer,
          onRename: handleRename,
          onChat: (id: string, name: string) => {
            // For agents, navigate directly to the command chat
            // In a fuller implementation we could prepopulate context, but jump to chat is fine.
            navigate('/chat');
          }
        }
      });
    });

    return orgNodes;
  }, [humans, agents, navigate]);

  const edges: Edge[] = useMemo(() => {
    const orgEdges: Edge[] = [];
    
    // Connect humans to all agents for a flat hierarchy visual
    if (humans.length > 0) {
      agents.filter(a => a.type === 'agent').forEach((a) => {
        orgEdges.push({
          id: `e-${humans[0].id}-${a.id}`,
          source: humans[0].id,
          target: a.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#10b981', strokeWidth: 2, opacity: 0.3 },
        });
      });
    }

    return orgEdges;
  }, [humans, agents]);

  const handleSendInvite = () => {
    if (!inviteEmail) return;
    
    // Mock adding human
    const newHuman = {
      id: "h" + Date.now(),
      name: inviteEmail.split('@')[0],
      role: inviteRole
    };
    
    setHumans([...humans, newHuman]);
    setInviteOpen(false);
    setInviteEmail("");
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, {role: 'user', content: chatInput.trim()}]);
    setChatInput("");
    
    // Mock response back
    setTimeout(() => {
      setChatMessages(prev => [...prev, {role: 'target', content: "Got it. I will review coordinates when possible."}]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 italic">Organization Hierarchy</h2>
          <p className="text-zinc-500 text-sm font-medium">Charting humans and autonomous agents across the network.</p>
        </div>
        
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger render={<Button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all" />}>
            <Mail size={14} className="mr-2" /> Invite Member
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold italic tracking-tight">Onboard Human Operator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-sm">
                <label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Email Address</label>
                <input 
                  autoFocus
                  placeholder="operator@system.io" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-2 text-sm">
                <label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Role / Title</label>
                <input 
                  placeholder="Director of Operations" 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <Button onClick={handleSendInvite} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase tracking-widest mt-4">
                Dispatch Invite Vector
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="flex-1 overflow-hidden bg-card/40 border-border backdrop-blur-sm relative border-zinc-800">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background color="#3f3f46" gap={16} size={1} />
        </ReactFlow>
      </Card>

      {/* Human Direct Message Chat Modal */}
      <AnimatePresence>
        {activeChatModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, pointerEvents: 'none' }}
            className="fixed bottom-8 right-8 w-80 bg-zinc-900 border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-3 bg-zinc-800/80 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-widest text-zinc-100">{activeChatModal.name}</span>
              </div>
              <button onClick={() => {setActiveChatModal(null); setChatMessages([])}} className="text-zinc-400 hover:text-zinc-100"><X size={14}/></button>
            </div>
            
            <div className="h-64 p-4 overflow-y-auto space-y-3 flex flex-col bg-zinc-950/50">
              {chatMessages.length === 0 && (
                <div className="text-center text-zinc-600 text-xs mt-4">
                  Direct encrypted channel established.
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn(
                  "p-2.5 rounded-lg text-xs max-w-[85%]",
                  msg.role === 'user' 
                    ? "bg-blue-600/20 text-blue-100 self-end border border-blue-500/20 rounded-tr-none" 
                    : "bg-zinc-800 text-zinc-300 self-start border border-zinc-700 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-border bg-zinc-900 flex items-center gap-2">
              <input 
                 value={chatInput}
                 onChange={e => setChatInput(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()}
                 placeholder="Message..."
                 className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500/50"
              />
              <button 
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim()}
                className="w-7 h-7 rounded bg-blue-500 flex items-center justify-center text-zinc-950 disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
