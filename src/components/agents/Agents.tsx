import React, { useState } from 'react';

const AGENTS = [
  {
    id: 'orchestrator', name: 'Orchestrator', model: 'claude-sonnet-4-6',
    status: 'active', initial: '◎', color: '#00E6A8',
    tokensToday: 48200, costToday: 0.21, sessions: 3, contextPct: 34,
    skills: ['Tavily Search', 'Memory Summarizer', 'Browser Control'],
    channels: ['Discord', 'Telegram', 'Slack'],
    description: 'Primary coordination agent. Handles routing, delegation, and high-level task orchestration.',
  },
  {
    id: 'lawassist', name: 'LawAssist', model: 'gemini-flash-3',
    status: 'active', initial: '⚖', color: '#3B82F6',
    tokensToday: 12400, costToday: 0.04, sessions: 1, contextPct: 12,
    skills: ['Legal Doc Parser', 'PollyReach Phone', 'Calendar Agent'],
    channels: ['Telegram', 'WhatsApp'],
    description: 'Specialized legal assistant. Contract review, client intake, and attorney workflow automation.',
  },
  {
    id: 'dataagent', name: 'DataAgent', model: 'deepseek-r1-0528',
    status: 'busy', initial: '◳', color: '#8B5CF6',
    tokensToday: 91700, costToday: 0.09, sessions: 2, contextPct: 67,
    skills: ['Data Parser', 'Memory Summarizer'],
    channels: ['Slack'],
    description: 'Data analysis and reasoning agent. Runs heavy analytical tasks and structured data extraction.',
  },
];

export default function Agents() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const agent = AGENTS.find(a => a.id === selected);

  return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' }}>Agent Roster</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>3 agents active · $0.34 total today</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowCreate(!showCreate)} style={{
            background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none',
            borderRadius: 9, padding: '8px 16px', color: '#fff',
            fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,230,168,0.3)',
          }}>+ Create Agent</button>
        </div>
      </div>

      {/* Create options */}
      {showCreate && (
        <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '⚡', title: 'Sub-Agent',   desc: 'Lightweight, focused. Runs under a parent agent with predefined skills and narrow scope.' },
            { icon: '◎', title: 'Agent',        desc: 'Full autonomous agent. Custom model, memory, multi-channel routing, and persona.' },
            { icon: '🔗', title: 'Agent Team',  desc: 'Group agents with a shared goal, delegation rules, and parallel execution.' },
          ].map(c => (
            <div key={c.title} className="glass-card" style={{
              padding: '20px', cursor: 'pointer', transition: 'all 0.18s',
              borderColor: 'rgba(0,230,168,0.2)',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,230,168,0.5)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,230,168,0.2)';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c.desc}</div>
              <button style={{
                marginTop: 14, width: '100%',
                background: 'linear-gradient(135deg, #00E6A8, #00C494)',
                border: 'none', borderRadius: 8, padding: '8px',
                color: '#fff', fontFamily: "'Outfit', sans-serif",
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>Configure →</button>
            </div>
          ))}
        </div>
      )}

      {/* Agent cards */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : 'repeat(3, 1fr)', gap: 16, transition: 'all 0.3s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(3, 1fr)', gap: 16, gridColumn: '1' }}>
          {AGENTS.map(a => (
            <div
              key={a.id}
              className="glass-card"
              onClick={() => setSelected(selected === a.id ? null : a.id)}
              style={{
                padding: '18px 20px', cursor: 'pointer',
                borderColor: selected === a.id ? `${a.color}50` : undefined,
                background: selected === a.id ? `${a.color}08` : undefined,
                transition: 'all 0.2s',
              }}
            >
              {/* Top */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 13,
                  background: `${a.color}18`, border: `1.5px solid ${a.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: a.color,
                }}>{a.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: 2 }}>{a.model}</div>
                </div>
                <span className={`tag tag-${a.status === 'busy' ? 'amber' : 'green'}`}>{a.status}</span>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Sessions',     val: a.sessions,                      unit: '' },
                  { label: 'Tokens Today', val: (a.tokensToday / 1000).toFixed(1) + 'k', unit: '' },
                  { label: 'Cost Today',   val: '$' + a.costToday.toFixed(2),    unit: '' },
                  { label: 'Context',      val: a.contextPct + '%',               unit: '' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace' }}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Context bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Context window</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: a.contextPct > 60 ? 'var(--status-amber)' : 'var(--status-green)' }}>{a.contextPct}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${a.contextPct}%`, background: a.contextPct > 60 ? 'var(--status-amber)' : a.color, borderRadius: 99, transition: 'width 0.6s' }} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Chat', 'Configure', 'Logs', 'Clone', 'Disable'].map(btn => (
                  <button key={btn} onClick={e => e.stopPropagation()} style={{
                    background: btn === 'Chat' ? `${a.color}18` : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${btn === 'Chat' ? a.color + '40' : 'rgba(0,0,0,0.07)'}`,
                    borderRadius: 7, padding: '5px 10px',
                    fontSize: 11, fontWeight: 600,
                    color: btn === 'Chat' ? a.color : btn === 'Disable' ? 'var(--status-red)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    transition: 'all 0.12s',
                  }}>{btn}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {agent && (
          <div className="glass-card animate-fade-up" style={{ padding: '20px', alignSelf: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Agent Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${agent.color}18`, border: `1.5px solid ${agent.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: agent.color }}>{agent.initial}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{agent.name}</div>
                <div style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: 'var(--text-muted)', marginTop: 1 }}>{agent.model}</div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{agent.description}</p>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {agent.skills.map(s => <span key={s} className="tag tag-accent">{s}</span>)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Channels</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {agent.channels.map(c => <span key={c} className="tag tag-blue">{c}</span>)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 9, padding: '9px', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 10px rgba(0,230,168,0.3)' }}>Chat with Agent</button>
              <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '9px', color: 'var(--text-secondary)', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Configure Agent</button>
            </div>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Agent Teams</span>
          <button style={{ fontSize: 11, color: 'var(--accent-dark)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>+ New Team</button>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,230,168,0.1)', border: '1px solid rgba(0,230,168,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Legal Squad</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Orchestrator + LawAssist · Attorney onboarding objective</div>
            </div>
            <span className="tag tag-green">Active</span>
            <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>Manage</button>
          </div>
        </div>
      </div>
    </div>
  );
}
