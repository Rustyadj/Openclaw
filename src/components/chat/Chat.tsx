import React, { useState, useRef, useEffect } from 'react';

type Message = { id: string; role: 'user' | 'ai'; content: string; time: string; agent?: string };

const INITIAL: Message[] = [
  { id: '1', role: 'ai',   content: 'Hello Rusty. I\'m ready. You have 3 active agents and 14 skills loaded. What would you like to accomplish today?', time: '9:00 AM', agent: 'Orchestrator' },
  { id: '2', role: 'user', content: 'Give me a summary of pending beta attorney follow-ups.', time: '9:01 AM' },
  { id: '3', role: 'ai',   content: 'You have two attorneys pending outreach:\n\n**James Holloway** — Trial lawyer, Texas. Expressed interest in contract review automation. Last contact Apr 22. Suggest scheduling a demo this week.\n\n**Patricia Cruz** — Family law, 8 attorneys. Demo scheduled May 2. She sent the intake form on Apr 24 — needs your review before the call.\n\nWant me to draft follow-up messages for both?', time: '9:01 AM', agent: 'Orchestrator' },
];

const AGENTS = ['Orchestrator', 'LawAssist', 'DataAgent'];
const MODELS = ['claude-sonnet-4-6', 'gemini-flash-3', 'deepseek-r1-0528', 'gpt-4o'];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [agent, setAgent] = useState('Orchestrator');
  const [model, setModel] = useState('claude-sonnet-4-6');
  const [memoryScope, setMemoryScope] = useState('Global');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, newMsg]);
    setInput('');
    // Simulate reply
    setTimeout(() => {
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Got it. Processing your request now...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent,
      }]);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* Chat main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Toolbar */}
        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
        }}>
          {/* Agent selector */}
          <SelectorPill
            label="Agent"
            value={agent}
            options={AGENTS}
            onChange={setAgent}
            icon="◎"
            accent="#00E6A8"
          />
          <SelectorPill
            label="Model"
            value={model}
            options={MODELS}
            onChange={setModel}
            icon="⚡"
            accent="#3B82F6"
          />
          <SelectorPill
            label="Memory"
            value={memoryScope}
            options={['Global', 'Org', 'Personal', 'Session']}
            onChange={setMemoryScope}
            icon="◫"
            accent="#8B5CF6"
          />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <span className="tag tag-green" style={{ fontSize: 10 }}>
              <span className="status-dot online" style={{ width: 5, height: 5 }} />
              Connected
            </span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(m => (
            <div key={m.id} style={{
              display: 'flex',
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              gap: 10, alignItems: 'flex-end',
            }}>
              {/* Avatar */}
              {m.role === 'ai' && (
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: 'linear-gradient(135deg, #00E6A8, #3B82F6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,230,168,0.3)',
                }}>◎</div>
              )}

              {/* Bubble */}
              <div style={{ maxWidth: '68%' }}>
                {m.role === 'ai' && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, paddingLeft: 2 }}>
                    {m.agent} · {m.time}
                  </div>
                )}
                <div style={{
                  padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg, #00E6A8, #00C494)'
                    : 'var(--glass-bg-strong)',
                  backdropFilter: m.role === 'ai' ? 'blur(16px)' : undefined,
                  border: m.role === 'ai' ? '1px solid rgba(0,0,0,0.07)' : 'none',
                  boxShadow: m.role === 'user'
                    ? '0 4px 14px rgba(0,230,168,0.3)'
                    : 'var(--glass-shadow)',
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <div key={i} style={{ fontWeight: 700, marginTop: i > 0 ? 8 : 0 }}>{line.slice(2, -2)}</div>;
                    }
                    return <div key={i}>{line}</div>;
                  })}
                </div>
                {m.role === 'user' && (
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right', paddingRight: 2 }}>{m.time}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: 'var(--glass-bg-strong)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 14, padding: '10px 10px 10px 16px',
            boxShadow: 'var(--glass-shadow)',
          }}>
            {/* File upload */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)', padding: '6px 2px', lineHeight: 1 }}>⊕</button>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message your agent... (Enter to send, Shift+Enter for newline)"
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none',
                resize: 'none', fontSize: 13, color: 'var(--text-primary)',
                lineHeight: 1.6, padding: '4px 0', maxHeight: 120, overflowY: 'auto',
              }}
            />

            {/* Voice */}
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-muted)', padding: '6px 2px' }}>🎙</button>

            {/* Send */}
            <button
              onClick={send}
              disabled={!input.trim()}
              style={{
                background: input.trim() ? 'linear-gradient(135deg, #00E6A8, #00C494)' : 'rgba(0,0,0,0.08)',
                border: 'none', borderRadius: 10, padding: '8px 14px',
                color: input.trim() ? '#fff' : 'var(--text-muted)',
                cursor: input.trim() ? 'pointer' : 'default',
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12, fontWeight: 700,
                transition: 'all 0.15s',
                boxShadow: input.trim() ? '0 3px 10px rgba(0,230,168,0.3)' : 'none',
              }}
            >↑ Send</button>
          </div>
        </div>
      </div>

      {/* Right panel - chat context */}
      <div style={{
        width: 260,
        borderLeft: '1px solid rgba(0,0,0,0.06)',
        background: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column',
        padding: 16, gap: 14, overflowY: 'auto',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Context</div>

        {/* Active agent card */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>ACTIVE AGENT</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #00E6A8, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff', fontWeight: 700 }}>◎</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{agent}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{model}</div>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'var(--text-muted)' }}>Context</span>
              <span style={{ color: 'var(--accent-dark)', fontWeight: 600 }}>34%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(0,0,0,0.07)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: '34%', background: 'var(--accent)', borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* Memory scope */}
        <div className="glass-card" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>MEMORY SCOPE</div>
          {['Global', 'Org', 'Personal', 'Session'].map(s => (
            <div key={s} onClick={() => setMemoryScope(s)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
              cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${memoryScope === s ? 'var(--accent)' : 'rgba(0,0,0,0.15)'}`,
                background: memoryScope === s ? 'var(--accent)' : 'transparent',
                transition: 'all 0.15s',
              }} />
              <span style={{ fontSize: 12, color: memoryScope === s ? 'var(--accent-dark)' : 'var(--text-secondary)', fontWeight: memoryScope === s ? 600 : 400 }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Skills active */}
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Active Skills</div>
          {['Tavily Search', 'PollyReach', 'Memory Summarizer'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0' }}>
              <span className="status-dot online" style={{ width: 5, height: 5 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectorPill({ label, value, options, onChange, icon, accent }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; icon: string; accent: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.07)',
      borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
    }}>
      <span style={{ fontSize: 13, color: accent }}>{icon}</span>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'none', border: 'none', fontSize: 12,
          fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
