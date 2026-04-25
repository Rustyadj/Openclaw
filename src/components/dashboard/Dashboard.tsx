import React from 'react';

const KPI = [
  { label: 'Active Agents',  val: '3',      delta: '+1',   good: true, icon: '◎', color: '#00E6A8', glow: 'rgba(0,230,168,0.3)' },
  { label: 'Token Velocity', val: '1.2k/m', delta: '+12%', good: true, icon: '⚡', color: '#60A5FA', glow: 'rgba(96,165,250,0.3)' },
  { label: 'Daily Cost',     val: '$0.34',  delta: '-8%',  good: true, icon: '◷', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  { label: 'System Latency', val: '4ms',    delta: 'p99',  good: true, icon: '◌', color: '#00E6A8', glow: 'rgba(0,230,168,0.3)' },
];

const ACTIVITY = [
  { time: '2m ago',  icon: '◎', text: 'Orchestrator completed contract review task',  tag: 'Agent',    tagClass: 'tag-accent' },
  { time: '8m ago',  icon: '⚡', text: 'Tavily web search executed — 12 results',      tag: 'Skill',    tagClass: 'tag-blue' },
  { time: '15m ago', icon: '👤', text: 'Sarah K. joined the organization',             tag: 'Org',      tagClass: 'tag-violet' },
  { time: '1h ago',  icon: '◫', text: 'Memory vault compacted — 340 entries pruned',  tag: 'Memory',   tagClass: 'tag-gray' },
  { time: '2h ago',  icon: '⟐', text: 'Legal Intake pipeline deployed',               tag: 'Workflow', tagClass: 'tag-green' },
  { time: '3h ago',  icon: '⚙', text: 'DeepSeek R1 model route updated',              tag: 'Config',   tagClass: 'tag-gray' },
];

const QUICK_ACTIONS = [
  { label: 'New Agent',     icon: '◎', color: '#00E6A8', glow: 'rgba(0,230,168,0.25)' },
  { label: 'Run Workflow',  icon: '⟐', color: '#60A5FA', glow: 'rgba(96,165,250,0.25)' },
  { label: 'Add Member',   icon: '👤', color: '#A78BFA', glow: 'rgba(167,139,250,0.25)' },
  { label: 'Install Skill', icon: '⚡', color: '#FBBF24', glow: 'rgba(251,191,36,0.25)' },
];

const AGENTS_STATUS = [
  { name: 'Orchestrator', model: 'claude-sonnet-4-6', status: 'active', load: 34, cost: '$0.21', color: '#00E6A8' },
  { name: 'LawAssist',    model: 'gemini-flash-3',    status: 'active', load: 12, cost: '$0.04', color: '#60A5FA' },
  { name: 'DataAgent',    model: 'deepseek-r1-0528',  status: 'busy',   load: 67, cost: '$0.09', color: '#A78BFA' },
];

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="glass-card animate-fade-up" style={{ padding: '18px 20px', ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{title}</span>
      {action}
    </div>
  );
}

export default function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div style={{ padding: '28px 28px 48px', display: 'flex', flexDirection: 'column', gap: 22, height: '100%', overflowY: 'auto' }}>

      {/* Greeting */}
      <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>
            Good morning, Rusty
          </h1>
          <span style={{ fontSize: 24 }}>👋</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.01em', marginTop: 4 }}>
          3 agents active &nbsp;·&nbsp; $0.34 spent today &nbsp;·&nbsp; All systems healthy
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPI.map(k => (
          <div key={k.label} className="glass-card animate-fade-up" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${k.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${k.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k.label}</div>
              <div style={{ fontSize: 16, color: k.color }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 10 }}>{k.val}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: k.good ? 'var(--status-green)' : 'var(--status-red)', background: k.good ? 'rgba(0,230,168,0.10)' : 'rgba(255,90,110,0.10)', padding: '2px 7px', borderRadius: 99, border: `1px solid ${k.good ? 'rgba(0,230,168,0.20)' : 'rgba(255,90,110,0.20)'}` }}>{k.delta}</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>vs yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>

        {/* Left col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Agent Status */}
          <Card>
            <CardHeader title="Agent Status" action={
              <button onClick={() => onNav('agents')} style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>View all →</button>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {AGENTS_STATUS.map(a => (
                <div key={a.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 11,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.status === 'busy' ? 'var(--status-amber)' : a.color, boxShadow: a.status === 'busy' ? '0 0 8px rgba(251,191,36,0.6)' : `0 0 8px ${a.color}80`, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>{a.model}</div>
                  </div>
                  <div style={{ width: 90 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Context</span>
                      <span style={{ fontSize: 10, color: a.load > 60 ? 'var(--status-amber)' : a.color, fontWeight: 700 }}>{a.load}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${a.load}%`, background: a.load > 60 ? 'var(--status-amber)' : a.color, borderRadius: 99, boxShadow: `0 0 6px ${a.color}60`, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', minWidth: 40, textAlign: 'right' }}>{a.cost}</div>
                  <span className={`tag tag-${a.status === 'busy' ? 'amber' : 'green'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {QUICK_ACTIONS.map(qa => (
                <button key={qa.label} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
                  padding: '16px 10px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer', transition: 'all 0.18s',
                  fontFamily: "'Outfit', sans-serif",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${qa.glow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `${qa.color}14`, border: `1px solid ${qa.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: qa.color, boxShadow: `0 0 12px ${qa.glow}` }}>{qa.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{qa.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Cost Trend */}
          <Card>
            <CardHeader title="7-Day Cost Trend" action={<span style={{ fontSize: 11, color: 'var(--status-green)', fontWeight: 700, background: 'rgba(0,230,168,0.10)', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(0,230,168,0.20)' }}>↓ 8% this week</span>} />
            <svg width="100%" height="72" viewBox="0 0 400 72" preserveAspectRatio="none">
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#00E6A8" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#00E6A8" stopOpacity="0" />
                </linearGradient>
                <filter id="ln-glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M0,54 C30,50 60,56 90,44 C120,32 150,40 180,36 C210,32 240,24 270,28 C300,32 330,18 360,14 C380,12 390,10 400,8 L400,72 L0,72Z" fill="url(#costGrad)" />
              <path d="M0,54 C30,50 60,56 90,44 C120,32 150,40 180,36 C210,32 240,24 270,28 C300,32 330,18 360,14 C380,12 390,10 400,8" fill="none" stroke="#00E6A8" strokeWidth="2" strokeLinecap="round" filter="url(#ln-glow)" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Today'].map(d => (
                <span key={d} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ flex: 1 }}>
            <CardHeader title="Activity Feed" action={
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-green)', boxShadow: '0 0 6px rgba(0,230,168,0.7)' }} />
                <span style={{ fontSize: 10, color: 'var(--status-green)', fontWeight: 700 }}>Live</span>
              </div>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.45, fontWeight: 500 }}>{a.text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.time}</span>
                      <span className={`tag ${a.tagClass}`}>{a.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="AI Summary" />
            <div style={{ background: 'linear-gradient(135deg, rgba(0,230,168,0.07), rgba(59,130,246,0.05))', border: '1px solid rgba(0,230,168,0.16)', borderRadius: 11, padding: '13px 15px', boxShadow: '0 0 20px rgba(0,230,168,0.06)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #00E6A8, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#021a0f', flexShrink: 0, boxShadow: '0 0 10px rgba(0,230,168,0.4)' }}>◎</div>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>Orchestrator · 2 min ago</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                System running smoothly. DataAgent context at 67% — recommend compacting before the scheduled cron at 03:00. Two beta attorneys pending follow-up.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
