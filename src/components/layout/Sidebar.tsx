import React from 'react';
import type { GatewaySummary } from '../../lib/api';

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
  summary: GatewaySummary;
  currentUserName: string;
  mobile?: boolean;
  mobileOpen?: boolean;
}

const NAV = [
  { section: 'MAIN', items: [
    { id: 'dashboard',  label: 'Dashboard',         icon: '⊞' },
    { id: 'chat',       label: 'Chat',               icon: '✦' },
    { id: 'personal',   label: 'Personal Workspace', icon: '🔒' },
  ]},
  { section: 'WORKSPACE', items: [
    { id: 'org',       label: 'Organization',  icon: '⬡' },
    { id: 'agents',    label: 'Agents',        icon: '◎', badge: 3 },
    { id: 'workflows', label: 'Workflows',     icon: '⟐' },
    { id: 'capabilities', label: 'Capabilities', icon: '⚡' },
  ]},
  { section: 'DATA', items: [
    { id: 'memory',    label: 'Memory Vault',  icon: '◫' },
    { id: 'documents', label: 'Documents',     icon: '❏' },
    { id: 'metrics',   label: 'Metrics',       icon: '◳' },
  ]},
  { section: 'SYSTEM', items: [
    { id: 'terminal',  label: 'Terminal',      icon: '›_' },
    { id: 'settings',  label: 'Settings',      icon: '⚙' },
  ]},
];

export default function Sidebar({ active, onNav, summary, currentUserName, mobile = false, mobileOpen = false }: SidebarProps) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-w)',
        minWidth: 'var(--sidebar-w)',
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderRight: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: mobile ? 'fixed' : 'relative',
        left: mobile ? 0 : 'auto',
        top: 0,
        zIndex: 20,
        boxShadow: '2px 0 24px rgba(0,0,0,0.04)',
        transform: mobile ? `translateX(${mobileOpen ? '0' : '-110%'})` : 'translateX(0)',
        transition: 'transform 0.24s ease',
      }}
      aria-hidden={mobile && !mobileOpen}
    >
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #00E6A8 0%, #00B882 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,230,168,0.35)',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>C</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>OpenClaw</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Command Center</div>
          </div>
        </div>

        {/* Workspace selector */}
        <div style={{
          marginTop: 14,
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: 10,
          padding: '8px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>R</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{currentUserName}&apos;s Workspace</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Personal</div>
            </div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>⌄</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              padding: '10px 10px 5px',
            }}>
              {group.section}
            </div>
            {group.items.map(item => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '8px 10px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0,230,168,0.15), rgba(0,230,168,0.08))'
                      : 'transparent',
                    color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.15s',
                    marginBottom: 1,
                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(0,230,168,0.25)' : 'none',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 14, width: 18, textAlign: 'center', flexShrink: 0, opacity: isActive ? 1 : 0.65 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {(item as any).badge && (
                    <span style={{
                      background: isActive ? 'var(--accent)' : 'rgba(0,0,0,0.1)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      fontSize: 10, fontWeight: 700,
                      padding: '1px 6px', borderRadius: 99,
                    }}>{(item as any).badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom status */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: 10, padding: '10px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <span className="status-dot online" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{summary.environment}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Latency</span>
            <span style={{ fontSize: 10, color: summary.ok ? 'var(--accent-dark)' : 'var(--status-amber)', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{summary.latencyMs != null ? `${summary.latencyMs}ms` : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Daily spend</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace' }}>{summary.dailyCostUsd != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—'}</span>
          </div>
        </div>

        {/* User row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '0 2px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #00E6A8, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>R</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{currentUserName}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Owner</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', padding: 2 }}>⋯</button>
        </div>
      </div>
    </aside>
  );
}
