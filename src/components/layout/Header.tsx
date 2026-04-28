import React from 'react';
import type { GatewaySummary } from '../../lib/api';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: 'Dashboard',            subtitle: 'Executive overview, AI summaries, and system posture' },
  chat:         { title: 'Chat',                 subtitle: 'Polished multi-agent conversation workspace' },
  personal:     { title: 'Personal Workspace',   subtitle: 'Private workspace, private agents, private memory' },
  org:          { title: 'Organization',         subtitle: 'Shared humans + AI org operating system' },
  agents:       { title: 'Agents',               subtitle: 'AI workforce roster, tooling, and task ownership' },
  workflows:    { title: 'Workflows',            subtitle: 'Visual automation builder and workflow deployment' },
  capabilities: { title: 'Capabilities',         subtitle: 'Skills, plugins, and extension surfaces' },
  memory:       { title: 'Memory Vault',         subtitle: 'Searchable persistent intelligence' },
  documents:    { title: 'Documents',            subtitle: 'Searchable docs, wiki, files, and AI summaries' },
  metrics:      { title: 'Metrics',              subtitle: 'Department performance and AI analytics' },
  terminal:     { title: 'Terminal',             subtitle: 'Operational diagnostics and gateway control' },
  settings:     { title: 'Settings',             subtitle: 'Environment controls, auth, and preferences' },
};

interface HeaderProps {
  active: string;
  onNewAgent: () => void;
  onSearchOpen: () => void;
  onNotifsToggle: () => void;
  onMenuToggle: () => void;
  onNav: (id: string) => void;
  notifsOpen: boolean;
  unreadCount: number;
  mobile: boolean;
  summary: GatewaySummary;
  userLabel: string;
}

export default function Header({
  active, onNewAgent, onSearchOpen, onNotifsToggle, onMenuToggle, onNav,
  notifsOpen, unreadCount, mobile, summary, userLabel,
}: HeaderProps) {
  const info = PAGE_TITLES[active] ?? { title: active, subtitle: '' };

  return (
    <header style={{
      height: 68,
      margin: '12px 12px 0',
      borderRadius: 20,
      background: 'linear-gradient(180deg, rgba(10,15,24,0.86) 0%, rgba(7,11,18,0.82) 100%)',
      backdropFilter: 'blur(28px) saturate(190%)',
      WebkitBackdropFilter: 'blur(28px) saturate(190%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 12,
      position: 'sticky',
      top: 0,
      zIndex: 9,
      boxShadow: '0 16px 42px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}>

      {/* Mobile menu toggle */}
      {mobile && (
        <button
          onClick={onMenuToggle}
          aria-label="Open navigation"
          style={{
            width: 38, height: 38, borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-primary)',
            cursor: 'pointer', flexShrink: 0,
            display: 'grid', placeItems: 'center',
          }}
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="1.5" rx="1" fill="currentColor" />
            <rect y="5.25" width="11" height="1.5" rx="1" fill="currentColor" />
            <rect y="10.5" width="16" height="1.5" rx="1" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* Page title */}
      <div style={{ minWidth: 0, flex: mobile ? 1 : 'none' }}>
        <div style={{
          fontSize: 16, fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.035em',
          lineHeight: 1.2,
        }}>{info.title}</div>
        {!mobile && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{info.subtitle}</div>
        )}
      </div>

      {/* Desktop quick nav + workspace pill */}
      {!mobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 12, marginRight: 'auto', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNav('chat')}
            style={{
              border: '1px solid rgba(255,255,255,0.09)',
              background: active === 'chat'
                ? 'linear-gradient(135deg, rgba(0,230,168,0.18), rgba(0,196,148,0.09))'
                : 'rgba(255,255,255,0.04)',
              color: active === 'chat' ? 'var(--accent-dark)' : 'var(--text-secondary)',
              borderRadius: 999, padding: '8px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: active === 'chat' ? '0 0 0 1px rgba(0,230,168,0.22)' : 'none',
            }}
          >
            ✦ Chat
          </button>

          {/* Workspace badge */}
          <div style={{
            padding: '7px 12px', borderRadius: 999,
            background: 'rgba(0,230,168,0.08)',
            border: '1px solid rgba(0,230,168,0.2)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-dark)', letterSpacing: '0.02em' }}>
              Rusty's Workspace
            </span>
          </div>
        </div>
      )}

      {/* Live metrics chips */}
      {!mobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[
            { label: 'Latency', val: summary.latencyMs != null ? `${summary.latencyMs}ms` : '—', color: summary.ok ? 'var(--status-green)' : 'var(--status-amber)' },
            { label: 'Agents',  val: summary.activeAgents != null ? `${summary.activeAgents}` : '—', color: 'var(--accent-dark)' },
            { label: 'Threads', val: summary.activeThreads != null ? `${summary.activeThreads}` : '—', color: 'var(--text-secondary)' },
          ].map(m => (
            <div key={m.label} style={{
              minWidth: 66, padding: '7px 10px', borderRadius: 14,
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.07)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.label}</div>
              <div style={{ marginTop: 3, fontSize: 12, fontWeight: 800, color: m.color }}>{m.val}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <button
        onClick={onSearchOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          minWidth: mobile ? 110 : 176,
          padding: '9px 13px', borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.035)',
          color: 'var(--text-muted)', cursor: 'pointer',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left', fontSize: 12 }}>Search...</span>
        {!mobile && (
          <kbd style={{ fontSize: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '2px 5px', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>⌘K</kbd>
        )}
      </button>

      {/* New Agent */}
      {!mobile && (
        <button
          onClick={onNewAgent}
          style={{
            background: 'linear-gradient(135deg, var(--accent), #00c494)',
            border: 'none', borderRadius: 14,
            padding: '9px 15px',
            color: '#022b1f', fontWeight: 800, fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 8px 22px rgba(0,230,168,0.28)',
            whiteSpace: 'nowrap',
          }}
        >
          + New Agent
        </button>
      )}

      {/* User label */}
      {!mobile && (
        <div style={{
          fontSize: 11, color: 'var(--text-muted)',
          whiteSpace: 'nowrap', maxWidth: 130,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{userLabel}</div>
      )}

      {/* Notifications */}
      <button
        onClick={onNotifsToggle}
        style={{
          width: 38, height: 38, borderRadius: 12,
          background: notifsOpen ? 'rgba(0,230,168,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${notifsOpen ? 'rgba(0,230,168,0.28)' : 'rgba(255,255,255,0.08)'}`,
          cursor: 'pointer',
          display: 'grid', placeItems: 'center',
          position: 'relative',
          color: notifsOpen ? 'var(--accent-dark)' : 'var(--text-muted)',
          fontSize: 15,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--status-amber)',
            border: '1.5px solid rgba(7,11,18,0.9)',
          }} />
        )}
      </button>
    </header>
  );
}
