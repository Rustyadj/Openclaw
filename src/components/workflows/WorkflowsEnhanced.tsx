import React, { useState } from 'react';

type NodeType = 'trigger' | 'agent' | 'skill' | 'condition' | 'storage' | 'output';

interface WFNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  color: string;
  icon: string;
}

interface Pipeline {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  nodes: WFNode[];
  lastRun: string;
  runs: number;
}

const NODE_PALETTE: { type: NodeType; label: string; icon: string; color: string; desc: string }[] = [
  { type: 'trigger',   label: 'Trigger',   icon: '⚡', color: '#00E6A8', desc: 'Start the workflow on an event' },
  { type: 'agent',     label: 'Agent',     icon: '◎',  color: '#3B82F6', desc: 'Route to an AI agent' },
  { type: 'skill',     label: 'Skill',     icon: '⚙',  color: '#8B5CF6', desc: 'Execute a capability' },
  { type: 'condition', label: 'Condition', icon: '◈',  color: '#F59E0B', desc: 'Branch on a condition' },
  { type: 'storage',   label: 'Storage',   icon: '◫',  color: '#64748B', desc: 'Read/write memory or docs' },
  { type: 'output',    label: 'Output',    icon: '↗',  color: '#EC4899', desc: 'Send result to a channel' },
];

const TRIGGER_OPTIONS = ['New Message (Discord)', 'New Message (Telegram)', 'Cron Schedule', 'Webhook', 'File Upload', 'API Call'];
const AGENT_OPTIONS   = ['Orchestrator', 'LawAssist', 'DataAgent'];
const SKILL_OPTIONS   = ['Tavily Web Search', 'Legal Doc Parser', 'Memory Summarizer', 'Data Parser', 'PollyReach Phone'];
const STORAGE_OPTIONS = ['Memory Vault (Read)', 'Memory Vault (Write)', 'Documents (Read)', 'Documents (Write)'];
const OUTPUT_OPTIONS  = ['Reply to sender', 'Send to Discord', 'Send to Telegram', 'Log to Terminal', 'Store result'];

const INITIAL_PIPELINES: Pipeline[] = [
  {
    id: 'p1', name: 'Legal Intake Flow', status: 'active', lastRun: '2m ago', runs: 47,
    nodes: [
      { id: 'n1', type: 'trigger',   label: 'New Message',     sublabel: 'Telegram',          x: 200, y: 40,  color: '#00E6A8', icon: '⚡' },
      { id: 'n2', type: 'agent',     label: 'LawAssist',       sublabel: 'gemini-flash-3',     x: 200, y: 150, color: '#3B82F6', icon: '◎' },
      { id: 'n3', type: 'skill',     label: 'Legal Doc Parser', sublabel: 'clawhub v1.0.4',   x: 200, y: 260, color: '#8B5CF6', icon: '⚙' },
      { id: 'n4', type: 'storage',   label: 'Memory Vault',    sublabel: 'Write · Org scope',  x: 200, y: 370, color: '#64748B', icon: '◫' },
      { id: 'n5', type: 'output',    label: 'Reply',           sublabel: 'Send to sender',     x: 200, y: 480, color: '#EC4899', icon: '↗' },
    ],
  },
  {
    id: 'p2', name: 'Daily Digest', status: 'active', lastRun: '6h ago', runs: 14,
    nodes: [
      { id: 'n1', type: 'trigger',   label: 'Cron',            sublabel: '0 8 * * *',          x: 200, y: 40,  color: '#00E6A8', icon: '⚡' },
      { id: 'n2', type: 'skill',     label: 'Tavily Search',   sublabel: 'tavily v2.1.0',      x: 200, y: 150, color: '#8B5CF6', icon: '⚙' },
      { id: 'n3', type: 'agent',     label: 'Orchestrator',    sublabel: 'claude-sonnet',      x: 200, y: 260, color: '#3B82F6', icon: '◎' },
      { id: 'n4', type: 'output',    label: 'Send Brief',      sublabel: 'Telegram · Rusty',   x: 200, y: 370, color: '#EC4899', icon: '↗' },
    ],
  },
  {
    id: 'p3', name: 'Memory Compact', status: 'active', lastRun: '6h ago', runs: 30,
    nodes: [
      { id: 'n1', type: 'trigger',   label: 'Cron',            sublabel: '0 3 * * *',          x: 200, y: 40,  color: '#00E6A8', icon: '⚡' },
      { id: 'n2', type: 'skill',     label: 'Mem Summarizer',  sublabel: 'openclaw v3.0.1',    x: 200, y: 150, color: '#8B5CF6', icon: '⚙' },
      { id: 'n3', type: 'storage',   label: 'Memory Vault',    sublabel: 'Write compact',      x: 200, y: 260, color: '#64748B', icon: '◫' },
    ],
  },
];

function NodeBlock({ node, selected, onClick }: { node: WFNode; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', top: node.y, left: node.x,
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: `${node.color}12`,
        border: `1.5px solid ${selected ? node.color : node.color + '40'}`,
        borderRadius: 12, padding: '10px 18px',
        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
        backdropFilter: 'blur(12px)',
        boxShadow: selected ? `0 0 0 3px ${node.color}30, 0 4px 20px ${node.color}25` : `0 4px 16px ${node.color}15`,
        transition: 'all 0.18s', minWidth: 200,
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${node.color}20`, border: `1px solid ${node.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: node.color, flexShrink: 0 }}>{node.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: node.color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>{node.type}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{node.label}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{node.sublabel}</div>
      </div>
      <button onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', padding: '2px 4px' }}>⋯</button>
    </div>
  );
}

function NodeConnectors({ nodes }: { nodes: WFNode[] }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="rgba(255,255,255,0.2)" />
        </marker>
      </defs>
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        const x1 = 200, y1 = n.y + 52, x2 = 200, y2 = next.y;
        const mx = x1, my = (y1 + y2) / 2;
        return (
          <g key={n.id}>
            <path d={`M${x1},${y1} C${mx},${my} ${mx},${my} ${x2},${y2}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />
          </g>
        );
      })}
    </svg>
  );
}

const darkInp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontFamily: "'Outfit',sans-serif", marginTop: 6, color: 'var(--text-primary)' };

function NodePropertiesPanel({ node, onUpdateNode, onRemoveNode, onClose }: {
  node: WFNode;
  onUpdateNode: (id: string, label: string, sublabel: string) => void;
  onRemoveNode: (id: string) => void;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(node.label);
  const [sublabel, setSublabel] = useState(node.sublabel);
  const options = node.type === 'trigger' ? TRIGGER_OPTIONS : node.type === 'agent' ? AGENT_OPTIONS : node.type === 'skill' ? SKILL_OPTIONS : node.type === 'storage' ? STORAGE_OPTIONS : OUTPUT_OPTIONS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${node.color}20`, border: `1px solid ${node.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: node.color }}>{node.icon}</div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{node.type} node</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>✕</button>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Label</div>
        <input value={label} onChange={e => setLabel(e.target.value)} style={darkInp} />
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>{node.type === 'trigger' ? 'Trigger Source' : node.type === 'agent' ? 'Agent' : node.type === 'skill' ? 'Skill' : node.type === 'storage' ? 'Storage' : 'Output'}</div>
        <select value={sublabel} onChange={e => setSublabel(e.target.value)} style={{ ...darkInp, cursor: 'pointer' }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {node.type === 'trigger' && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Filter / Pattern</div>
          <input placeholder="e.g. starts with /intake" style={darkInp} />
        </div>
      )}
      {node.type === 'condition' && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Condition Expression</div>
          <input placeholder="e.g. output.confidence > 0.8" style={darkInp} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-green)', textAlign: 'center', padding: '6px', background: 'rgba(0,230,168,0.08)', border: '1px solid rgba(0,230,168,0.2)', borderRadius: 7 }}>True →</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--status-red)', textAlign: 'center', padding: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7 }}>False →</div>
          </div>
        </div>
      )}
      {(node.type === 'agent' || node.type === 'skill') && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>System Prompt / Instructions</div>
          <textarea rows={3} placeholder="Override instructions for this step..." style={{ ...darkInp, resize: 'none', lineHeight: 1.5 }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 7 }}>
        <button onClick={() => onUpdateNode(node.id, label, sublabel)} style={{ flex: 1, background: 'linear-gradient(135deg,#00E6A8,#00C494)', border: 'none', borderRadius: 8, padding: '8px', color: '#021a0f', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save Node</button>
        <button onClick={() => onRemoveNode(node.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: 'var(--status-red)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
      </div>
    </div>
  );
}

export function WorkflowsEnhanced() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_PIPELINES);
  const [activePipelineId, setActivePipelineId] = useState('p1');
  const [selectedNode, setSelectedNode] = useState<WFNode | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const activePipeline = pipelines.find(p => p.id === activePipelineId)!;
  const canvasHeight = Math.max(600, activePipeline.nodes.length * 110 + 80);

  const setActivePipeline = (p: Pipeline) => {
    setActivePipelineId(p.id);
    setSelectedNode(null);
    setShowPalette(false);
  };

  const updateActivePipeline = (updater: (p: Pipeline) => Pipeline) => {
    setPipelines(ps => ps.map(p => p.id === activePipelineId ? updater(p) : p));
  };

  const startEditName = () => {
    setNameInput(activePipeline.name);
    setEditingName(true);
  };

  const saveName = () => {
    if (nameInput.trim()) updateActivePipeline(p => ({ ...p, name: nameInput.trim() }));
    setEditingName(false);
  };

  const createPipeline = () => {
    const id = `p${Date.now()}`;
    const newP: Pipeline = {
      id, name: 'New Pipeline', status: 'draft', lastRun: 'Never', runs: 0,
      nodes: [{ id: 'n1', type: 'trigger', label: 'Trigger', sublabel: 'Click to configure', x: 200, y: 40, color: '#00E6A8', icon: '⚡' }],
    };
    setPipelines(ps => [...ps, newP]);
    setActivePipelineId(id);
    setSelectedNode(null);
    setTimeout(() => { setNameInput('New Pipeline'); setEditingName(true); }, 50);
  };

  const addNode = (type: NodeType) => {
    const def = NODE_PALETTE.find(n => n.type === type)!;
    const newNode: WFNode = {
      id: `n${Date.now()}`, type,
      label: def.label, sublabel: 'Click to configure',
      x: 200, y: activePipeline.nodes.length * 110 + 40,
      color: def.color, icon: def.icon,
    };
    updateActivePipeline(p => ({ ...p, nodes: [...p.nodes, newNode] }));
    setShowPalette(false);
    setSelectedNode(newNode);
  };

  const updateNode = (id: string, label: string, sublabel: string) => {
    updateActivePipeline(p => ({ ...p, nodes: p.nodes.map(n => n.id === id ? { ...n, label, sublabel } : n) }));
    setSelectedNode(prev => prev?.id === id ? { ...prev!, label, sublabel } : prev);
  };

  const removeNode = (id: string) => {
    updateActivePipeline(p => ({ ...p, nodes: p.nodes.filter(n => n.id !== id) }));
    setSelectedNode(null);
  };

  const panelBg = 'rgba(255,255,255,0.03)';
  const borderColor = 'rgba(255,255,255,0.07)';
  const btnBase: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", color: 'var(--text-secondary)' };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Left: pipeline list */}
      <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${borderColor}`, background: panelBg, backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px 10px', borderBottom: `1px solid ${borderColor}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Pipelines</div>
          <button onClick={createPipeline} style={{ width: '100%', background: 'linear-gradient(135deg,#00E6A8,#00C494)', border: 'none', borderRadius: 9, padding: '8px', color: '#021a0f', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,230,168,0.3)' }}>+ New Pipeline</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {pipelines.map(p => (
            <div key={p.id} onClick={() => setActivePipeline(p)} style={{ padding: '10px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 4, background: activePipeline.id === p.id ? 'rgba(0,230,168,0.10)' : 'transparent', border: `1px solid ${activePipeline.id === p.id ? 'rgba(0,230,168,0.3)' : 'transparent'}`, transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 13 }}>⟐</span>
                <span style={{ fontSize: 12, fontWeight: activePipeline.id === p.id ? 700 : 500, color: activePipeline.id === p.id ? '#00E6A8' : 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className={`tag tag-${p.status === 'active' ? 'green' : p.status === 'draft' ? 'gray' : 'amber'}`}>{p.status}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.runs} runs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${borderColor}`, background: panelBg, backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {editingName ? (
              <input
                autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)}
                onBlur={saveName} onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,230,168,0.4)', borderRadius: 7, padding: '3px 9px', color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif", outline: 'none' }}
              />
            ) : (
              <div onClick={startEditName} title="Click to rename" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)', cursor: 'text', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {activePipeline.name}
                <span style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.5 }}>✎</span>
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {activePipeline.nodes.length} nodes · Last run: {activePipeline.lastRun} · {activePipeline.runs} total runs
            </div>
          </div>
          <button onClick={() => setShowPalette(!showPalette)} style={btnBase}>+ Insert Node</button>
          <button onClick={() => updateActivePipeline(p => ({ ...p, status: 'draft' as const }))} style={btnBase}>Save Draft</button>
          <button style={{ background: 'linear-gradient(135deg,#00E6A8,#00C494)', border: 'none', borderRadius: 9, padding: '8px 16px', color: '#021a0f', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,230,168,0.3)' }}>▶ Deploy</button>
        </div>

        {/* Node palette dropdown */}
        {showPalette && (
          <div className="animate-fade-up" style={{ position: 'absolute', top: 140, left: 280, zIndex: 50, background: 'rgba(10,12,20,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '10px', boxShadow: '0 12px 40px rgba(0,0,0,0.7)', width: 280 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px', marginBottom: 8 }}>Add Node</div>
            {NODE_PALETTE.map(n => (
              <div key={n.type} onClick={() => addNode(n.type)} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '9px 10px', borderRadius: 9, cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '')}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${n.color}18`, border: `1px solid ${n.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: n.color, flexShrink: 0 }}>{n.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{n.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Canvas */}
        <div onClick={() => { setSelectedNode(null); setShowPalette(false); }} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.01)', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '28px 28px' }}>
          <div style={{ position: 'relative', minHeight: canvasHeight, minWidth: 400 }}>
            <NodeConnectors nodes={activePipeline.nodes} />
            {activePipeline.nodes.map(node => (
              <NodeBlock key={node.id} node={node} selected={selectedNode?.id === node.id} onClick={() => { setSelectedNode(node); setShowPalette(false); }} />
            ))}
          </div>
          <div style={{ position: 'sticky', bottom: 16, right: 0, display: 'flex', flexDirection: 'column', gap: 4, width: 36, marginLeft: 'auto', marginRight: 16 }}>
            {['+', '−', '⊡'].map(c => (
              <button key={c} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', color: 'var(--text-secondary)' }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: properties panel */}
      <div style={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${borderColor}`, background: panelBg, backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedNode ? (
          <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
            <NodePropertiesPanel node={selectedNode} onUpdateNode={updateNode} onRemoveNode={removeNode} onClose={() => setSelectedNode(null)} />
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Pipeline Info</div>

            <div className="glass-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Stats</div>
              {[['Nodes', activePipeline.nodes.length], ['Total Runs', activePipeline.runs], ['Last Run', activePipeline.lastRun], ['Status', activePipeline.status]].map(([k, v]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{v as string}</span>
                </div>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Node Types</div>
              {NODE_PALETTE.map(n => {
                const count = activePipeline.nodes.filter(nd => nd.type === n.type).length;
                if (!count) return null;
                return (
                  <div key={n.type} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                    <span style={{ color: n.color, fontSize: 14 }}>{n.icon}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, textTransform: 'capitalize' }}>{n.type}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>×{count}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 'auto' }}>
              <button style={{ background: 'linear-gradient(135deg,#00E6A8,#00C494)', border: 'none', borderRadius: 9, padding: '10px', color: '#021a0f', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,230,168,0.3)' }}>▶ Deploy Pipeline</button>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '9px', color: 'var(--text-secondary)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Run History</button>
              {activePipeline.status === 'active' && (
                <button onClick={() => updateActivePipeline(p => ({ ...p, status: 'paused' as const }))} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 9, padding: '9px', color: 'var(--status-amber)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>⏸ Pause Pipeline</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
