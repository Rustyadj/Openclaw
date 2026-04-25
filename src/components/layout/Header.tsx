import React from 'react';
import type { GatewaySummary } from '../../lib/api';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:    { title: 'Dashboard',           subtitle: 'System overview & AI activity' },
  chat:         { title: 'Chat',                subtitle: 'Talk to your agents' },
  personal:     { title: 'Personal Workspace',  subtitle: 'Your private AI workforce & projects' },
  org:          { title: 'Organization',        subtitle: 'Manage your workspace and team' },
  agents:       { title: 'Agents',              subtitle: 'Your AI workforce' },
  workflows:    { title: 'Workflows',           subtitle: 'Automation pipelines' },
  capabilities: { title: 'Capabilities',        subtitle: 'Skills, plugins & tools' },
  memory:       { title: 'Memory Vault',        subtitle: 'Persistent agent knowledge' },
  documents:    { title: 'Documents',           subtitle: 'AI-searchable knowledge base' },
  metrics:      { title: 'Metrics',             subtitle: 'Performance & analytics' },
  terminal:         { title: 'Terminal',           subtitle: 'Direct gateway access' },
  settings:         { title: 'Settings',           subtitle: 'Configure your environment' },
  'design-pipeline': { title: 'Design Pipeline',   subtitle: 'Elite 4-step design & build workflow' },
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
      background: 'rgba(248,249,252,0.92)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 9,
      boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
    }}>

      {mobile && (
        <button
          onClick={onMenuToggle}
          aria-label="Open navigation"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.07)',
            background: 'rgba(255,255,255,0.72)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          ☰
        </button>
      )}

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{info.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{info.subtitle}</div>
      </div>

      {/* Metric pills */}
      {!mobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {[
            { label: 'Latency', val: summary.latencyMs != null ? `${summary.latencyMs}ms` : '—', color: summary.ok ? 'var(--status-green)' : 'var(--status-amber)' },
            { label: 'Threads', val: summary.activeThreads != null ? `${summary.activeThreads}` : '—', color: 'var(--text-secondary)' },
            { label: 'Agents', val: summary.activeAgents != null ? `${summary.activeAgents}` : '—', color: 'var(--accent-dark)' },
            { label: 'Cost', val: summary.dailyCostUsd != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—', color: 'var(--text-secondary)' },
          ].map(m => (
            <div key={m.label} style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: 8, padding: '4px 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: 'DM Mono, monospace', lineHeight: 1.2 }}>{m.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search bar */}
      <button
        onClick={onSearchOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 9, padding: '7px 14px',
          cursor: 'pointer', color: 'var(--text-muted)',
          fontFamily: "'Outfit',sans-serif", fontSize: 12,
          transition: 'all 0.15s', width: mobile ? 120 : 200,
          textAlign: 'left',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
      >
        <span style={{ fontSize: 14 }}>⌕</span>
        <span style={{ flex: 1 }}>Search...</span>
        <kbd style={{ fontSize: 10, background: 'rgba(0,0,0,0.06)', borderRadius: 4, padding: '1px 5px', border: '1px solid rgba(0,0,0,0.1)' }}>⌘K</kbd>
      </button>

      {!mobile && (
      <button
        onClick={onNewAgent}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, #00E6A8, #00C494)',
          border: 'none', borderRadius: 9, padding: '8px 14px',
          color: '#fff', fontFamily: "'Outfit', sans-serif",
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,230,168,0.3), inset 0 1px 0 rgba(255,255,255,0.25)',
          transition: 'all 0.15s', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,230,168,0.4), inset 0 1px 0 rgba(255,255,255,0.25)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,230,168,0.3), inset 0 1px 0 rgba(255,255,255,0.25)')}
      >
        + New Agent
      </button>
      )}

      <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', maxWidth: mobile ? 90 : 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{userLabel}</div>

      {/* Notifications */}
      <button
        onClick={onNotifsToggle}
        style={{
          width: 36, height: 36, borderRadius: 9,
          background: notifsOpen ? 'rgba(0,230,168,0.1)' : 'rgba(255,255,255,0.7)',
          border: `1px solid ${notifsOpen ? 'rgba(0,230,168,0.3)' : 'rgba(0,0,0,0.07)'}`,
          cursor: 'pointer', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', transition: 'all 0.15s',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 5, right: 5,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--status-amber)',
            border: '1.5px solid white',
          }} />
        )}
      </button>
    </header>
  );
}
