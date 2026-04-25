import React from 'react';
import type { GatewaySummary } from '../../lib/api';

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
  summary: GatewaySummary;
  currentUserName: string;
  mobile?: boolean;
  mobileOpen?: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const NAV = [
  { section: 'MAIN', items: [
    { id: 'dashboard',       label: 'Dashboard',         icon: '⊞' },
    { id: 'chat',            label: 'Chat',               icon: '✦' },
    { id: 'personal',        label: 'Personal Workspace', icon: '🔒' },
  ]},
  { section: 'WORKSPACE', items: [
    { id: 'org',             label: 'Organization',       icon: '⬡' },
    { id: 'agents',          label: 'Agents',             icon: '◎', badge: 3 },
    { id: 'workflows',       label: 'Workflows',          icon: '⟐' },
    { id: 'capabilities',    label: 'Capabilities',       icon: '⚡' },
    { id: 'design-pipeline', label: 'Design Pipeline',    icon: '✦' },
  ]},
  { section: 'DATA', items: [
    { id: 'memory',          label: 'Memory Vault',       icon: '◫' },
    { id: 'documents',       label: 'Documents',          icon: '❏' },
    { id: 'metrics',         label: 'Metrics',            icon: '◳' },
  ]},
  { section: 'SYSTEM', items: [
    { id: 'terminal',        label: 'Terminal',           icon: '›_' },
    { id: 'settings',        label: 'Settings',           icon: '⚙' },
  ]},
];

export default function Sidebar({
  active, onNav, summary, currentUserName,
  mobile = false, mobileOpen = false,
  collapsed, onToggleCollapse,
}: SidebarProps) {
  const w = collapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)';

  return (
    <aside
      style={{
        width: w, minWidth: w,
        background: 'var(--sidebar-bg)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderRight: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '2px 0 32px rgba(0,0,0,0.08), 1px 0 0 rgba(255,255,255,0.6) inset',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: mobile ? 'fixed' : 'relative',
        left: mobile ? 0 : 'auto',
        top: 0,
        zIndex: 20,
        transform: mobile ? `translateX(${mobileOpen ? '0' : '-110%'})` : 'translateX(0)',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), min-width 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.24s ease',
        overflow: 'hidden',
      }}
      aria-hidden={mobile && !mobileOpen}
    >
      {/* Logo row */}
      <div style={{
        padding: collapsed ? '18px 0 14px' : '18px 16px 14px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: 'linear-gradient(135deg, #00E6A8 0%, #00B882 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,230,168,0.40), 0 1px 0 rgba(255,255,255,0.4) inset',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>C</span>
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>OpenClaw</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Command Center</div>
          </div>
        )}
      </div>

      {/* Workspace selector — hide when collapsed */}
      {!collapsed && (
        <div style={{ padding: '10px 12px 4px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.75)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 8px rgba(0,0,0,0.05)',
            borderRadius: 10, padding: '7px 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(59,130,246,0.3)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>R</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{currentUserName}&apos;s Workspace</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Personal</div>
              </div>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>⌄</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '8px 6px' : '8px 8px' }}>
        {NAV.map(group => (
          <div key={group.section} style={{ marginBottom: 2 }}>
            {/* Section label — hide when collapsed */}
            {!collapsed && (
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
                padding: '10px 10px 4px',
              }}>
                {group.section}
              </div>
            )}
            {collapsed && <div style={{ height: 8 }} />}

            {group.items.map(item => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: collapsed ? 0 : 9,
                    padding: collapsed ? '9px 0' : '7px 10px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0,230,168,0.18), rgba(0,230,168,0.09))'
                      : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 0 0 1px rgba(0,230,168,0.28), 0 2px 8px rgba(0,230,168,0.10)'
                      : 'none',
                    color: isActive ? 'var(--accent-dark)' : 'var(--text-secondary)',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    transition: 'all 0.15s',
                    marginBottom: 1,
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 15, width: collapsed ? 'auto' : 18, textAlign: 'center', flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                  {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                  {!collapsed && (item as any).badge && (
                    <span style={{
                      background: isActive ? 'var(--accent)' : 'rgba(0,0,0,0.09)',
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

      {/* Collapse toggle button */}
      <div style={{
        padding: collapsed ? '8px 0' : '8px 12px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-end',
        flexShrink: 0,
      }}>
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(0,0,0,0.07)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: 'var(--text-muted)',
            transition: 'all 0.15s',
            boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.85)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.55)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Bottom status — icon dot only when collapsed */}
      <div style={{
        padding: collapsed ? '10px 0 14px' : '10px 14px 14px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        flexShrink: 0,
      }}>
        {!collapsed ? (
          <>
            <div style={{
              background: 'rgba(255,255,255,0.50)',
              border: '1px solid rgba(255,255,255,0.72)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 8px rgba(0,0,0,0.05)',
              borderRadius: 10, padding: '9px 12px', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <span className="status-dot online" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{summary.environment}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Latency</span>
                <span style={{ fontSize: 10, color: summary.ok ? 'var(--accent-dark)' : 'var(--status-amber)', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>{summary.latencyMs != null ? `${summary.latencyMs}ms` : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Daily spend</span>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{summary.dailyCostUsd != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #00E6A8, #3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,230,168,0.3)',
              }}>R</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{currentUserName}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Owner</div>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', padding: 2 }}>⋯</button>
            </div>
          </>
        ) : (
          /* Collapsed: just avatar centered */
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'linear-gradient(135deg, #00E6A8, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              boxShadow: '0 2px 8px rgba(0,230,168,0.3)',
            }}>R</div>
          </div>
        )}
      </div>
    </aside>
  );
}
