import React, { useState } from 'react';

const AI_MODELS = [
  { id: 'claude-sonnet-4-6',    label: 'Claude Sonnet 4.6',   provider: 'Anthropic' },
  { id: 'claude-opus-4-6',      label: 'Claude Opus 4.6',     provider: 'Anthropic' },
  { id: 'claude-haiku-4-5',     label: 'Claude Haiku 4.5',    provider: 'Anthropic' },
  { id: 'gemini-flash-3',       label: 'Gemini Flash 3',      provider: 'Google' },
  { id: 'deepseek-r1-0528',     label: 'DeepSeek R1',         provider: 'DeepSeek' },
  { id: 'gpt-4o',               label: 'GPT-4o',              provider: 'OpenAI' },
];

const AGENTS = [
  {
    id: 'orchestrator', name: 'Orchestrator', model: 'claude-sonnet-4-6',
    status: 'active', initial: '◎', color: '#00E6A8', glow: 'rgba(0,230,168,0.3)',
    tokensToday: 48200, costToday: 0.21, sessions: 3, contextPct: 34,
    skills: ['Tavily Search', 'Memory Summarizer', 'Browser Control'],
    channels: ['Discord', 'Telegram', 'Slack'],
    description: 'Primary coordination agent. Handles routing, delegation, and high-level task orchestration.',
  },
  {
    id: 'lawassist', name: 'LawAssist', model: 'gemini-flash-3',
    status: 'active', initial: '⚖', color: '#60A5FA', glow: 'rgba(96,165,250,0.3)',
    tokensToday: 12400, costToday: 0.04, sessions: 1, contextPct: 12,
    skills: ['Legal Doc Parser', 'PollyReach Phone', 'Calendar Agent'],
    channels: ['Telegram', 'WhatsApp'],
    description: 'Specialized legal assistant. Contract review, client intake, and attorney workflow automation.',
  },
  {
    id: 'dataagent', name: 'DataAgent', model: 'deepseek-r1-0528',
    status: 'busy', initial: '◳', color: '#A78BFA', glow: 'rgba(167,139,250,0.3)',
    tokensToday: 91700, costToday: 0.09, sessions: 2, contextPct: 67,
    skills: ['Data Parser', 'Memory Summarizer'],
    channels: ['Slack'],
    description: 'Data analysis and reasoning agent. Runs heavy analytical tasks and structured data extraction.',
  },
];

export default function Agents() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [agentModels, setAgentModels] = useState<Record<string, string>>(
    () => Object.fromEntries(AGENTS.map(a => [a.id, a.model]))
  );

  const agent = AGENTS.find(a => a.id === selected);

  return (
    <div style={{ padding: '28px', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.6px', color: 'var(--text-primary)' }}>Agent Roster</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>3 agents active · $0.34 total today</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} style={{
          background: 'linear-gradient(135deg, #00E6A8, #00C090)',
          border: 'none', borderRadius: 10, padding: '9px 18px',
          color: '#021a0f', fontFamily: "'Outfit', sans-serif",
          fontSize: 13, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 0 22px rgba(0,230,168,0.40), 0 4px 12px rgba(0,0,0,0.4)',
          transition: 'box-shadow 0.15s',
          letterSpacing: '-0.2px',
        }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(0,230,168,0.55), 0 4px 16px rgba(0,0,0,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 22px rgba(0,230,168,0.40), 0 4px 12px rgba(0,0,0,0.4)')}
        >+ Create Agent</button>
      </div>

      {/* Create options */}
      {showCreate && (
        <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '⚡', title: 'Sub-Agent',  desc: 'Lightweight, focused. Runs under a parent agent with predefined skills and narrow scope.', color: '#FBBF24' },
            { icon: '◎', title: 'Agent',       desc: 'Full autonomous agent. Custom model, memory, multi-channel routing, and persona.', color: '#00E6A8' },
            { icon: '🔗', title: 'Agent Team', desc: 'Group agents with a shared goal, delegation rules, and parallel execution.', color: '#A78BFA' },
          ].map(c => (
            <div key={c.title} className="glass-card" style={{ padding: '22px', cursor: 'pointer', transition: 'all 0.18s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 40px rgba(0,0,0,0.6), 0 0 24px ${c.color}20`;
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '';
                (e.currentTarget as HTMLElement).style.transform = '';
              }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, ${c.color}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
              <div style={{ fontSize: 26, marginBottom: 12, color: c.color }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{c.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 16 }}>{c.desc}</div>
              <button style={{
                width: '100%', background: `${c.color}16`,
                border: `1px solid ${c.color}30`, borderRadius: 9, padding: '9px',
                color: c.color, fontFamily: "'Outfit', sans-serif",
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = `${c.color}26`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${c.color}16`)}
              >Configure →</button>
            </div>
          ))}
        </div>
      )}

      {/* Agent cards */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : 'repeat(3, 1fr)', gap: 16, transition: 'all 0.3s' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
          {AGENTS.map(a => (
            <div key={a.id} className="glass-card" onClick={() => setSelected(selected === a.id ? null : a.id)} style={{
              padding: '20px', cursor: 'pointer',
              borderTopColor: selected === a.id ? `${a.color}40` : undefined,
              borderLeftColor: selected === a.id ? `${a.color}28` : undefined,
              background: selected === a.id ? `${a.color}06` : undefined,
              boxShadow: selected === a.id ? `0 4px 32px rgba(0,0,0,0.6), 0 0 24px ${a.glow}` : undefined,
              transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
            }}>
              {selected === a.id && (
                <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, background: `radial-gradient(circle, ${a.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
              )}

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 13, background: `${a.color}14`, border: `1.5px solid ${a.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: a.color, boxShadow: `0 0 16px ${a.glow}`, flexShrink: 0 }}>{a.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>{a.name}</div>
                  <select
                    value={agentModels[a.id]}
                    onChange={e => { e.stopPropagation(); setAgentModels(prev => ({ ...prev, [a.id]: e.target.value })); }}
                    onClick={e => e.stopPropagation()}
                    style={{ marginTop: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${a.color}30`, borderRadius: 6, padding: '3px 8px', fontSize: 10, color: a.color, fontFamily: 'DM Mono, monospace', cursor: 'pointer', outline: 'none' }}
                  >
                    {AI_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <span className={`tag tag-${a.status === 'busy' ? 'amber' : 'green'}`}>{a.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Sessions',     val: a.sessions },
                  { label: 'Tokens Today', val: (a.tokensToday / 1000).toFixed(1) + 'k' },
                  { label: 'Cost Today',   val: '$' + a.costToday.toFixed(2) },
                  { label: 'Context',      val: a.contextPct + '%' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '9px 11px' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'DM Mono, monospace', letterSpacing: '-0.5px' }}>{s.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Context window</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: a.contextPct > 60 ? 'var(--status-amber)' : a.color }}>{a.contextPct}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${a.contextPct}%`, background: a.contextPct > 60 ? 'var(--status-amber)' : a.color, borderRadius: 99, boxShadow: `0 0 8px ${a.color}70`, transition: 'width 0.6s' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Chat', 'Configure', 'Logs', 'Clone', 'Disable'].map(btn => (
                  <button key={btn} onClick={e => e.stopPropagation()} style={{
                    background: btn === 'Chat' ? `${a.color}16` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${btn === 'Chat' ? a.color + '35' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 7, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                    color: btn === 'Chat' ? a.color : btn === 'Disable' ? 'var(--status-red)' : 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.12s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = btn === 'Chat' ? `${a.color}26` : 'rgba(255,255,255,0.09)')}
                    onMouseLeave={e => (e.currentTarget.style.background = btn === 'Chat' ? `${a.color}16` : 'rgba(255,255,255,0.05)')}
                  >{btn}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {agent && (
          <div className="glass-card animate-fade-up" style={{ padding: '22px', alignSelf: 'start', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: `radial-gradient(circle, ${agent.glow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Agent Detail</span>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${agent.color}14`, border: `1.5px solid ${agent.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: agent.color, boxShadow: `0 0 18px ${agent.glow}` }}>{agent.initial}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>{agent.name}</div>
                <select
                  value={agentModels[agent.id]}
                  onChange={e => setAgentModels(prev => ({ ...prev, [agent.id]: e.target.value }))}
                  style={{ marginTop: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${agent.color}30`, borderRadius: 6, padding: '3px 8px', fontSize: 10, color: agent.color, fontFamily: 'DM Mono, monospace', cursor: 'pointer', outline: 'none', width: '100%' }}
                >
                  {AI_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.label} ({m.provider})</option>
                  ))}
                </select>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 18 }}>{agent.description}</p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {agent.skills.map(s => <span key={s} className="tag tag-accent">{s}</span>)}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Channels</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {agent.channels.map(c => <span key={c} className="tag tag-blue">{c}</span>)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}CC)`, border: 'none', borderRadius: 10, padding: '10px', color: '#021a0f', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: `0 0 20px ${agent.glow}, 0 4px 12px rgba(0,0,0,0.4)`, transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px ${agent.glow}, 0 4px 16px rgba(0,0,0,0.4)`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 20px ${agent.glow}, 0 4px 12px rgba(0,0,0,0.4)`)}
              >Chat with Agent</button>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '10px', color: 'var(--text-secondary)', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              >Configure Agent</button>
            </div>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="glass-card" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Agent Teams</span>
          <button style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>+ New Team</button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '13px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(0,230,168,0.10)', border: '1px solid rgba(0,230,168,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#00E6A8', boxShadow: '0 0 12px rgba(0,230,168,0.25)' }}>⚖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Legal Squad</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Orchestrator + LawAssist · Attorney onboarding objective</div>
          </div>
          <span className="tag tag-green">Active</span>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", color: 'var(--text-secondary)', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >Manage</button>
        </div>
      </div>
    </div>
  );
}
