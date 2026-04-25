import React from 'react';
import type { GatewaySummary } from '../../lib/api';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:         { title: 'Dashboard',           subtitle: 'System overview & AI activity' },
  chat:              { title: 'Chat',                subtitle: 'Talk to your agents' },
  personal:          { title: 'Personal Workspace',  subtitle: 'Your private AI workforce & projects' },
  org:               { title: 'Organization',        subtitle: 'Manage your workspace and team' },
  agents:            { title: 'Agents',              subtitle: 'Your AI workforce' },
  workflows:         { title: 'Workflows',           subtitle: 'Automation pipelines' },
  capabilities:      { title: 'Capabilities',        subtitle: 'Skills, plugins & tools' },
  memory:            { title: 'Memory Vault',        subtitle: 'Persistent agent knowledge' },
  documents:         { title: 'Documents',           subtitle: 'AI-searchable knowledge base' },
  metrics:           { title: 'Metrics',             subtitle: 'Performance & analytics' },
  terminal:          { title: 'Terminal',            subtitle: 'Direct gateway access' },
  settings:          { title: 'Settings',            subtitle: 'Configure your environment' },
  'design-pipeline': { title: 'Design Pipeline',     subtitle: 'Elite 4-step design & build workflow' },
};

interface HeaderProps {
  active: string;
  onNewAgent: () => void;
  onSearchOpen: () => void;
  onNotifsToggle: () => void;
  onMenuToggle: () => void;
  notifsOpen: boolean;
  unreadCount: number;
  mobile: boolean;
  summary: GatewaySummary;
  userLabel: string;
}

export default function Header({ active, onNewAgent, onSearchOpen, onNotifsToggle, onMenuToggle, notifsOpen, unreadCount, mobile, summary, userLabel }: HeaderProps) {
  const info = PAGE_TITLES[active] ?? { title: active, subtitle: '' };

  return (
    <header style={{
      height: 60,
      background: 'rgba(7,8,15,0.82)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 14,
      position: 'sticky',
      top: 0,
      zIndex: 9,
      boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5)',
    }}>

      {mobile && (
        <button
          onClick={onMenuToggle}
          aria-label="Open navigation"
          style={{
            width: 34, height: 34, borderRadius: 9,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.05)',
            cursor: 'pointer', flexShrink: 0,
            color: 'var(--text-secondary)', fontSize: 14,
          }}
        >☰</button>
      )}

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>{info.title}</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, letterSpacing: '0.03em' }}>{info.subtitle}</div>
      </div>

      {/* Metric pills */}
      {!mobile && (
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Latency', val: summary.latencyMs != null ? `${summary.latencyMs}ms` : '—', color: summary.ok ? 'var(--status-green)' : 'var(--status-amber)' },
            { label: 'Threads', val: summary.activeThreads != null ? `${summary.activeThreads}` : '—', color: 'var(--text-secondary)' },
            { label: 'Agents',  val: summary.activeAgents  != null ? `${summary.activeAgents}`  : '—', color: 'var(--accent)' },
            { label: 'Cost',    val: summary.dailyCostUsd  != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—', color: 'var(--text-secondary)' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '4px 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: 'DM Mono, monospace', lineHeight: 1.3 }}>{m.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <button
        onClick={onSearchOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 9, padding: '7px 14px',
          cursor: 'pointer', color: 'var(--text-muted)',
          fontFamily: "'Outfit', sans-serif", fontSize: 12,
          transition: 'all 0.15s', width: mobile ? 120 : 200,
          textAlign: 'left',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)';
        }}
      >
        <span style={{ fontSize: 14, opacity: 0.6 }}>⌕</span>
        <span style={{ flex: 1 }}>Search...</span>
        <kbd style={{ fontSize: 10, background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '1px 5px', border: '1px solid rgba(255,255,255,0.10)', color: 'var(--text-muted)' }}>⌘K</kbd>
      </button>

      {!mobile && (
        <button
          onClick={onNewAgent}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #00E6A8, #00C090)',
            border: 'none', borderRadius: 9, padding: '8px 16px',
            color: '#021a0f', fontFamily: "'Outfit', sans-serif",
            fontSize: 12, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0,230,168,0.35), 0 4px 12px rgba(0,0,0,0.4)',
            transition: 'all 0.15s', whiteSpace: 'nowrap', letterSpacing: '-0.2px',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(0,230,168,0.50), 0 4px 16px rgba(0,0,0,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 20px rgba(0,230,168,0.35), 0 4px 12px rgba(0,0,0,0.4)')}
        >
          + New Agent
        </button>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', maxWidth: mobile ? 80 : 130, overflow: 'hidden', textOverflow: 'ellipsis' }}>{userLabel}</div>

      {/* Notifications */}
      <button
        onClick={onNotifsToggle}
        style={{
          width: 34, height: 34, borderRadius: 9,
          background: notifsOpen ? 'rgba(0,230,168,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${notifsOpen ? 'rgba(0,230,168,0.30)' : 'rgba(255,255,255,0.09)'}`,
          cursor: 'pointer', fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', transition: 'all 0.15s', flexShrink: 0,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--status-amber)',
            border: '1.5px solid #07080F',
            boxShadow: '0 0 6px rgba(251,191,36,0.6)',
          }} />
        )}
      </button>
    </header>
  );
}
