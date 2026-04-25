import React, { useState } from 'react';

// ── Shared ─────────────────────────────────────────────────

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={{ padding: '18px 20px', ...style }}>{children}</div>;
}
function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{children}</span>
      {action}
    </div>
  );
}

// ── WORKFLOWS ──────────────────────────────────────────────

const WF_NODES = [
  { id: 'trigger', label: 'New Event',     type: 'trigger', color: '#00E6A8', icon: '⚡', top: 30, left: '50%' },
  { id: 'agent',   label: 'Orchestrator',  type: 'agent',   color: '#3B82F6', icon: '◎', top: 130, left: '50%' },
  { id: 'skill',   label: 'Data Parser',   type: 'skill',   color: '#8B5CF6', icon: '⚙', top: 230, left: '50%' },
  { id: 'store',   label: 'Memory Vault',  type: 'storage', color: '#64748B', icon: '◫', top: 330, left: '50%' },
];

export function Workflows() {
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Workflow Canvas</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Visual pipeline builder for autonomous agent sequences</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>Save Draft</button>
          <button style={{ background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 9, padding: '8px 16px', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,230,168,0.3)' }}>▶ Deploy Pipeline</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, flex: 1 }}>
        {/* Canvas */}
        <div className="glass-card" style={{
          padding: 0, minHeight: 500, position: 'relative', overflow: 'hidden',
          background: 'rgba(255,255,255,0.35)',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)',
          backgroundSize: '24px 24px',
        }}>
          {/* Insert toolbar */}
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2 }}>
            <button style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>+ Insert Component</button>
          </div>

          {/* SVG connectors */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {[{y1:75,y2:130},{y1:175,y2:230},{y1:275,y2:330}].map(({y1,y2},i) => (
              <line key={i} x1="50%" y1={y1} x2="50%" y2={y2} stroke="rgba(0,0,0,0.12)" strokeWidth="2" strokeDasharray="4 3" />
            ))}
          </svg>

          {/* Nodes */}
          {WF_NODES.map(n => (
            <div key={n.id} style={{
              position: 'absolute', top: n.top, left: n.left, transform: 'translateX(-50%)',
              background: `${n.color}12`, border: `1.5px solid ${n.color}40`,
              borderRadius: 12, padding: '10px 20px',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: 'grab', userSelect: 'none', whiteSpace: 'nowrap',
              backdropFilter: 'blur(12px)',
              boxShadow: `0 4px 16px ${n.color}20`,
              transition: 'box-shadow 0.15s',
            }}>
              <span style={{ fontSize: 16, color: n.color }}>{n.icon}</span>
              <div>
                <div style={{ fontSize: 9, color: n.color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>{n.type}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 1 }}>{n.label}</div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', marginLeft: 4 }}>⋯</button>
            </div>
          ))}

          {/* Zoom controls */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['+','−','⊡','🔒'].map(c => (
              <button key={c} style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c}</button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {WF_NODES.map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{n.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <GlassCard>
            <SectionTitle>System Overview</SectionTitle>
            {[['Cluster Pop.','3 ↑12%','#00C97A'],['Skill Manifest','14','var(--text-primary)'],['Network Latency','42ms','#00C97A'],['Token Velocity','1.2k/min','var(--text-secondary)']].map(([k,v,c]) => (
              <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: c as string, fontFamily: 'DM Mono, monospace' }}>{v}</span>
              </div>
            ))}
          </GlassCard>
          <GlassCard style={{ background: 'linear-gradient(135deg, rgba(0,230,168,0.07), rgba(59,130,246,0.05))', borderColor: 'rgba(0,230,168,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <SectionTitle>Efficiency</SectionTitle>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#00E6A8' }}>92%</span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Autonomous scaling active. Prioritizing low-latency inference routes.</p>
          </GlassCard>
          <GlassCard>
            <SectionTitle>Saved Pipelines</SectionTitle>
            {['Legal Intake Flow', 'Daily Digest', 'Memory Compact'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer' }}>
                <span style={{ fontSize: 14 }}>⟐</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', flex: 1 }}>{p}</span>
                <span className="tag tag-green">Active</span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ── MEMORY VAULT ───────────────────────────────────────────

const MEMORIES = [
  { key: 'user_profile',       preview: '{ name: Rusty, tz: Chicago, role: owner }',       scope: 'Global',   updated: '2h ago' },
  { key: 'law_firm_context',   preview: '{ beta_users: [James, Patricia], model: sub }',   scope: 'Org',      updated: '4h ago' },
  { key: 'agent_config',       preview: '{ orchestrator: claude-sonnet, ... }',            scope: 'Global',   updated: '1d ago' },
  { key: 'session_20260424',   preview: 'Dashboard UI build, GitHub repo reviewed',        scope: 'Session',  updated: '30m ago' },
  { key: 'cron_state',         preview: '{ discord: ok, cost_report: due }',               scope: 'Global',   updated: '6h ago' },
  { key: 'beta_attorneys',     preview: '[James Holloway, Patricia Cruz]',                 scope: 'Org',      updated: '1d ago' },
];

export function MemoryVault() {
  const [active, setActive] = useState(MEMORIES[0]);
  const [search, setSearch] = useState('');
  const [scopeFilter, setScopeFilter] = useState('All');

  const filtered = MEMORIES.filter(m =>
    (scopeFilter === 'All' || m.scope === scopeFilter) &&
    (m.key.includes(search) || m.preview.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Memory Vault</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>Compact All</button>
          <button style={{ background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 9, padding: '8px 16px', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,230,168,0.3)' }}>+ New Entry</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, flex: 1 }}>
        {/* List */}
        <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memory..." style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '8px 12px', fontSize: 12, width: '100%' }} />

          {/* Scope filter */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['All','Global','Org','Session','Personal'].map(s => (
              <button key={s} onClick={() => setScopeFilter(s)} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', background: scopeFilter === s ? 'var(--accent)' : 'rgba(0,0,0,0.06)', color: scopeFilter === s ? '#fff' : 'var(--text-muted)', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>{s}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
            {filtered.map(m => (
              <div key={m.key} onClick={() => setActive(m)} style={{
                padding: '10px 12px', borderRadius: 9, cursor: 'pointer',
                background: active.key === m.key ? 'rgba(0,230,168,0.1)' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${active.key === m.key ? 'rgba(0,230,168,0.3)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.12s',
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{m.key}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.preview}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 5, alignItems: 'center' }}>
                  <span className="tag tag-gray" style={{ fontSize: 9 }}>{m.scope}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>{active.key}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span className="tag tag-accent">{active.scope}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated {active.updated}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>Edit</button>
              <button style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--status-red)' }}>Delete</button>
            </div>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, padding: '16px', fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {`// ${active.key}\n${active.preview}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DOCUMENTS ──────────────────────────────────────────────

const DOCS = [
  { title: 'Attorney One-Pager — Contract AI',    type: 'Document', updated: '1h ago',  tag: 'tag-accent', tagLabel: 'AI Generated' },
  { title: 'Legal Intake Process SOP',            type: 'Document', updated: '3d ago',  tag: 'tag-blue',   tagLabel: 'SOP' },
  { title: 'OpenClaw Setup Guide',                type: 'Guide',    updated: '1w ago',  tag: 'tag-violet', tagLabel: 'Guide' },
  { title: 'Beta Attorney Feedback Notes',        type: 'Notes',    updated: '2d ago',  tag: 'tag-amber',  tagLabel: 'Notes' },
  { title: 'API Cost Optimization Report',        type: 'Report',   updated: '4d ago',  tag: 'tag-green',  tagLabel: 'Report' },
];

export function Documents() {
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Documents</h2>
        <button style={{ background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 9, padding: '8px 16px', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,230,168,0.3)' }}>+ New Document</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <input placeholder="AI search across all documents..." style={{ width: '100%', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '10px 16px 10px 40px', fontSize: 13 }} />
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--text-muted)' }}>⌕</span>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {['Title', 'Type', 'Tag', 'Updated', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCS.map((d, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>❏</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.title}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{d.type}</td>
                <td style={{ padding: '12px 16px' }}><span className={`tag ${d.tag}`}>{d.tagLabel}</span></td>
                <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-muted)' }}>{d.updated}</td>
                <td style={{ padding: '12px 16px' }}><button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)' }}>⋯</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── METRICS ────────────────────────────────────────────────

export function Metrics() {
  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Metrics & Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Tokens (7d)',  val: '2.1M',   delta: '↑ 14%', color: '#00E6A8' },
          { label: 'Total Cost (7d)',    val: '$2.18',  delta: '↓ 8%',  color: '#3B82F6' },
          { label: 'Avg Latency',        val: '4ms',    delta: '↓ 2ms', color: '#8B5CF6' },
        ].map(m => (
          <div key={m.label} className="glass-card" style={{ padding: '16px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${m.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', color: 'var(--text-primary)' }}>{m.val}</div>
            <div style={{ fontSize: 11, color: 'var(--status-green)', fontWeight: 600, marginTop: 6 }}>{m.delta} vs prior week</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Cost by agent */}
        <GlassCard>
          <SectionTitle>Cost by Agent (7d)</SectionTitle>
          {[['Orchestrator', 1.47, '#00E6A8'], ['DataAgent', 0.63, '#8B5CF6'], ['LawAssist', 0.28, '#3B82F6']].map(([name, cost, color]) => (
            <div key={name as string} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>${(cost as number).toFixed(2)}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${((cost as number) / 2.18) * 100}%`, background: color as string, borderRadius: 99, transition: 'width 0.8s' }} />
              </div>
            </div>
          ))}
        </GlassCard>

        {/* Model usage */}
        <GlassCard>
          <SectionTitle>Model Distribution</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#00E6A8" strokeWidth="12" strokeDasharray="148 91" strokeLinecap="round" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="49 190" strokeDashoffset="-148" strokeLinecap="round" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="12" strokeDasharray="42 197" strokeDashoffset="-197" strokeLinecap="round" transform="rotate(-90 50 50)" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['claude-sonnet','#00E6A8','65%'],['deepseek-r1','#8B5CF6','25%'],['gemini-flash','#3B82F6','10%']].map(([m,c,p]) => (
                <div key={m as string} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: c as string, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginLeft: 'auto' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ── TERMINAL ───────────────────────────────────────────────

export function Terminal() {
  const [cmd, setCmd] = useState('');
  const [lines, setLines] = useState([
    { type: 'prompt', text: 'status --all' },
    { type: 'out-green', text: '✓ Gateway running (pid 2847)' },
    { type: 'out-green', text: '✓ 3 agents active' },
    { type: 'out-green', text: '✓ 14 skills loaded' },
    { type: 'out-amber', text: '⚠ cron/cost-report: overdue' },
    { type: 'out', text: 'Cluster: GCP-US-CENTRAL | Uptime: 14d 6h 22m' },
    { type: 'prompt', text: 'agents list' },
    { type: 'out', text: 'ID: orchestrator  | Model: claude-sonnet-4-6  | Status: active | Sessions: 3' },
    { type: 'out', text: 'ID: lawassist     | Model: gemini-flash-3      | Status: active | Sessions: 1' },
    { type: 'out', text: 'ID: dataagent     | Model: deepseek-r1-0528    | Status: busy   | Sessions: 2' },
  ]);

  const run = () => {
    if (!cmd.trim()) return;
    setLines(l => [...l, { type: 'prompt', text: cmd }, { type: 'out', text: `> ${cmd} executed` }]);
    setCmd('');
  };

  return (
    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Terminal</h2>
        <span className="tag tag-green">GCP-US-CENTRAL · Connected</span>
      </div>
      <div style={{
        flex: 1, background: '#0F1117', borderRadius: 14,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        {/* Traffic lights */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 6, alignItems: 'center' }}>
          {['#FF5F57','#FFBD2E','#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 8, fontFamily: 'DM Mono, monospace' }}>openclaw — GCP-US-CENTRAL</span>
        </div>
        {/* Output */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              fontFamily: 'DM Mono, monospace', fontSize: 13, lineHeight: 1.7,
              color: l.type === 'prompt' ? '#00E6A8' : l.type === 'out-amber' ? '#F59E0B' : 'rgba(255,255,255,0.65)',
              paddingLeft: l.type !== 'prompt' ? 20 : 0,
            }}>
              {l.type === 'prompt' && <span style={{ color: 'rgba(255,255,255,0.3)' }}>openclaw $ </span>}
              {l.text}
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#00E6A8', flexShrink: 0 }}>openclaw $</span>
          <input
            value={cmd}
            onChange={e => setCmd(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
            style={{ flex: 1, background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.85)', caretColor: '#00E6A8' }}
            placeholder="type a command..."
          />
        </div>
      </div>
    </div>
  );
}
