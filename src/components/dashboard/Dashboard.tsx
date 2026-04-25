import React from 'react';

const KPI = [
  { label: 'Active Agents',   val: '3',      delta: '+1',   good: true,  icon: '◎', color: '#00E6A8' },
  { label: 'Token Velocity',  val: '1.2k/m', delta: '+12%', good: true,  icon: '⚡', color: '#3B82F6' },
  { label: 'Daily Cost',      val: '$0.34',  delta: '-8%',  good: true,  icon: '◷', color: '#8B5CF6' },
  { label: 'System Latency',  val: '4ms',    delta: 'p99',  good: true,  icon: '◌', color: '#00E6A8' },
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
  { label: 'New Agent',      icon: '◎', color: '#00E6A8' },
  { label: 'Run Workflow',   icon: '⟐', color: '#3B82F6' },
  { label: 'Add Member',     icon: '👤', color: '#8B5CF6' },
  { label: 'Install Skill',  icon: '⚡', color: '#F59E0B' },
];

const AGENTS_STATUS = [
  { name: 'Orchestrator', model: 'claude-sonnet-4-6', status: 'active',  load: 34, cost: '$0.21' },
  { name: 'LawAssist',    model: 'gemini-flash-3',    status: 'active',  load: 12, cost: '$0.04' },
  { name: 'DataAgent',    model: 'deepseek-r1-0528',  status: 'busy',    load: 67, cost: '$0.09' },
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
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{title}</span>
      {action}
    </div>
  );
}

export default function Dashboard({ onNav }: { onNav: (id: string) => void }) {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }}>

      {/* Greeting */}
      <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          Good morning, Rusty 👋
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
          Your 3 agents are active · $0.34 spent today · System healthy
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {KPI.map(k => (
          <div key={k.label} className="glass-card animate-fade-up" style={{ padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
            {/* Accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${k.color}, transparent)`, borderRadius: '16px 16px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{k.label}</div>
              <div style={{ fontSize: 18, opacity: 0.7 }}>{k.icon}</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', lineHeight: 1 }}>{k.val}</div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, color: k.good ? 'var(--status-green)' : 'var(--status-red)', fontWeight: 600 }}>{k.delta}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>vs yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Agent Status */}
          <Card>
            <CardHeader title="Agent Status" action={
              <button onClick={() => onNav('agents')} style={{ fontSize: 11, color: 'var(--accent-dark)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AGENTS_STATUS.map(a => (
                <div key={a.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <span className={`status-dot ${a.status === 'busy' ? 'busy' : 'online'}`} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{a.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{a.model}</div>
                  </div>
                  {/* Load bar */}
                  <div style={{ width: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Context</span>
                      <span style={{ fontSize: 10, color: a.load > 60 ? 'var(--status-amber)' : 'var(--status-green)', fontWeight: 600 }}>{a.load}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${a.load}%`, background: a.load > 60 ? 'var(--status-amber)' : 'var(--accent)', borderRadius: 99, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', minWidth: 36, textAlign: 'right' }}>{a.cost}</div>
                  <span className={`tag ${a.status === 'busy' ? 'tag-amber' : 'tag-green'}`}>{a.status}</span>
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
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '14px 10px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'Outfit', sans-serif",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.8)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.5)';
                    (e.currentTarget as HTMLElement).style.transform = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${qa.color}18`,
                    border: `1px solid ${qa.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>{qa.icon}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{qa.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Cost chart sparkline */}
          <Card>
            <CardHeader title="7-Day Cost Trend" action={<span style={{ fontSize: 11, color: 'var(--status-green)', fontWeight: 600 }}>↓ 8% this week</span>} />
            <svg width="100%" height="70" viewBox="0 0 400 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E6A8" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#00E6A8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,52 C30,48 60,54 90,42 C120,30 150,38 180,34 C210,30 240,22 270,26 C300,30 330,18 360,14 C380,12 390,10 400,8" fill="none" stroke="#00E6A8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0,52 C30,48 60,54 90,42 C120,30 150,38 180,34 C210,30 240,22 270,26 C300,30 330,18 360,14 C380,12 390,10 400,8 L400,70 L0,70Z" fill="url(#costGrad)" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Today'].map(d => (
                <span key={d} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column - Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ flex: 1 }}>
            <CardHeader title="Activity Feed" action={
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Live</span>
            } />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, flexShrink: 0,
                  }}>{a.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 500 }}>{a.text}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.time}</span>
                      <span className={`tag ${a.tagClass}`}>{a.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Summary */}
          <Card>
            <CardHeader title="AI Summary" />
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,230,168,0.06), rgba(59,130,246,0.04))',
              border: '1px solid rgba(0,230,168,0.15)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: 'linear-gradient(135deg, #00E6A8, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>◎</div>
                <span style={{ fontSize: 11, color: 'var(--accent-dark)', fontWeight: 700 }}>Orchestrator · 2 min ago</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                System running smoothly. DataAgent context at 67% — recommend compacting before the scheduled cron at 03:00. Two beta attorneys pending follow-up.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
