import React, { useState, useEffect, useRef } from 'react';

// ── GLOBAL SEARCH MODAL ───────────────────────────────────

const SEARCH_RESULTS = [
  { type: 'Agent',    icon: '◎', label: 'Orchestrator',              sub: 'claude-sonnet-4-6 · Active',    action: 'agents' },
  { type: 'Agent',    icon: '⚖', label: 'LawAssist',                 sub: 'gemini-flash-3 · Active',       action: 'agents' },
  { type: 'Org',      icon: '⬡', label: "Rusty's Org",               sub: '4 members · Owner',             action: 'org' },
  { type: 'Document', icon: '❏', label: 'Attorney One-Pager',        sub: 'AI Generated · 1h ago',         action: 'documents' },
  { type: 'Skill',    icon: '⚡', label: 'Tavily Web Search',         sub: 'Installed · 4.2k installs',     action: 'capabilities' },
  { type: 'Memory',   icon: '◫', label: 'law_firm_context',          sub: 'Org scope · 4h ago',            action: 'memory' },
  { type: 'Workflow', icon: '⟐', label: 'Legal Intake Pipeline',     sub: 'Active · Deployed Apr 22',      action: 'workflows' },
  { type: 'Contact',  icon: '👤', label: 'James Holloway',            sub: 'Holloway & Associates · TX',    action: 'org' },
  { type: 'Setting',  icon: '⚙', label: 'API Keys',                  sub: 'Settings → Models & APIs',      action: 'settings' },
];

const RECENT = ['Orchestrator agent', 'Legal intake pipeline', 'James Holloway'];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onNav: (id: string) => void;
}

export function SearchModal({ open, onClose, onNav }: SearchModalProps) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setIdx(i => Math.min(i + 1, filtered.length - 1));
      if (e.key === 'ArrowUp') setIdx(i => Math.max(i - 1, 0));
      if (e.key === 'Enter') { if (filtered[idx]) { onNav(filtered[idx].action); onClose(); } }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, idx]);

  const filtered = q.trim()
    ? SEARCH_RESULTS.filter(r => r.label.toLowerCase().includes(q.toLowerCase()) || r.type.toLowerCase().includes(q.toLowerCase()) || r.sub.toLowerCase().includes(q.toLowerCase()))
    : SEARCH_RESULTS.slice(0, 6);

  if (!open) return null;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh' }}>
      <div onClick={e => e.stopPropagation()} className="animate-fade-up" style={{ width: 560, background: 'rgba(248,249,252,0.97)', backdropFilter: 'blur(28px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 18, boxShadow: '0 24px 80px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
          <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>⌕</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => { setQ(e.target.value); setIdx(0); }}
            placeholder="Search agents, workflows, documents, memory..."
            style={{ flex: 1, background: 'none', border: 'none', fontSize: 15, color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif" }}
          />
          <kbd style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.06)', borderRadius: 5, padding: '2px 7px', border: '1px solid rgba(0,0,0,0.1)' }}>ESC</kbd>
        </div>

        {/* Recent (when no query) */}
        {!q && (
          <div style={{ padding: '10px 18px 6px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Recent</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {RECENT.map(r => (
                <button key={r} onClick={() => setQ(r)} style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 7, padding: '4px 10px', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>{r}</button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No results for "{q}"</div>
          )}
          {filtered.map((r, i) => (
            <div key={i} onClick={() => { onNav(r.action); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', cursor: 'pointer', background: i === idx ? 'rgba(0,230,168,0.08)' : 'transparent', transition: 'background 0.1s', borderLeft: i === idx ? '2px solid var(--accent)' : '2px solid transparent' }}
              onMouseEnter={() => setIdx(i)}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{r.sub}</div>
              </div>
              <span className="tag tag-gray" style={{ fontSize: 10 }}>{r.type}</span>
              {i === idx && <kbd style={{ fontSize: 10, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 5px', border: '1px solid rgba(0,0,0,0.1)' }}>↵</kbd>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '8px 18px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 16, alignItems: 'center' }}>
          {[['↑↓','Navigate'],['↵','Open'],['ESC','Close']].map(([k,l]) => (
            <div key={k} style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <kbd style={{ fontSize: 10, color: 'var(--text-muted)', background: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: '1px 5px', border: '1px solid rgba(0,0,0,0.1)' }}>{k}</kbd>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NOTIFICATIONS PANEL ───────────────────────────────────

const NOTIFS = [
  { id: '1', icon: '⚠️', title: 'Cron job overdue',         body: 'cost-report has not run in 3 days.',           time: '6h ago',  read: false, type: 'warning' },
  { id: '2', icon: '✓',  title: 'Pipeline deployed',        body: 'Legal Intake Flow deployed successfully.',      time: '2h ago',  read: false, type: 'success' },
  { id: '3', icon: '◎',  title: 'Agent task completed',     body: 'Orchestrator finished contract review.',        time: '2m ago',  read: false, type: 'info' },
  { id: '4', icon: '👤', title: 'Sarah K. joined org',      body: 'Sarah K. accepted your invite to Rusty\'s Org.',      time: '1d ago',  read: true,  type: 'info' },
  { id: '5', icon: '💰', title: 'Daily spend update',       body: 'Spent $0.34 today (23% of daily budget).',      time: '8h ago',  read: true,  type: 'info' },
  { id: '6', icon: '⚡', title: 'Skill update available',   body: 'Tavily Web Search v2.2.0 is available.',        time: '2d ago',  read: true,  type: 'update' },
];

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const dismiss = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 899 }} />
      <div className="animate-fade-up" style={{ position: 'fixed', top: 64, right: 16, width: 360, background: 'rgba(248,249,252,0.97)', backdropFilter: 'blur(28px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 16, boxShadow: '0 16px 60px rgba(0,0,0,0.15)', zIndex: 900, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Notifications</span>
            {unread > 0 && <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99 }}>{unread}</span>}
          </div>
          <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--accent-dark)', fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>Mark all read</button>
        </div>

        {/* List */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {notifs.map((n, i) => (
            <div key={n.id} onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{ display: 'flex', gap: 10, padding: '12px 18px', background: n.read ? 'transparent' : 'rgba(0,230,168,0.04)', borderBottom: i < notifs.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', cursor: 'pointer', transition: 'background 0.12s', alignItems: 'flex-start' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = n.read ? '' : 'rgba(0,230,168,0.04)')}
            >
              <div style={{ width: 30, height: 30, borderRadius: 9, background: n.type === 'warning' ? 'rgba(245,158,11,0.12)' : n.type === 'success' ? 'rgba(0,201,122,0.12)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)' }}>{n.title}</span>
                  {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', padding: '0 2px', flexShrink: 0 }}>✕</button>
            </div>
          ))}
          {notifs.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
              All caught up!
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--accent-dark)', fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>View All Notifications →</button>
        </div>
      </div>
    </>
  );
}
