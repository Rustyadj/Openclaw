import React, { useState } from 'react';
import {
  LayoutDashboard, MessageSquare, User, Users, Bot, GitBranch,
  Zap, Brain, FileText, BarChart3, Terminal, Settings,
} from 'lucide-react';
import type { GatewaySummary } from '../../lib/api';

// ── Neural net logo SVG ────────────────────────────────────────────────────────
const NODES = [
  { x: 24, y: 24, r: 3.5 },        // 0 center
  { x: 24, y: 8,  r: 2.2 },        // 1 top
  { x: 35.3, y: 12.7, r: 1.9 },    // 2 top-right
  { x: 40, y: 24, r: 2.2 },        // 3 right
  { x: 35.3, y: 35.3, r: 1.9 },    // 4 bottom-right
  { x: 24, y: 40, r: 2.2 },        // 5 bottom
  { x: 12.7, y: 35.3, r: 1.9 },    // 6 bottom-left
  { x: 8, y: 24, r: 2.2 },         // 7 left
  { x: 12.7, y: 12.7, r: 1.9 },    // 8 top-left
  { x: 24, y: 17, r: 1.5 },        // 9 inner-top
  { x: 31, y: 24, r: 1.5 },        // 10 inner-right
  { x: 24, y: 31, r: 1.5 },        // 11 inner-bottom
  { x: 17, y: 24, r: 1.5 },        // 12 inner-left
];

const EDGES = [
  // center ↔ inner ring
  [0,9],[0,10],[0,11],[0,12],
  // inner ring
  [9,10],[10,11],[11,12],[12,9],
  // inner ↔ outer
  [9,1],[9,2],[10,2],[10,3],[10,4],[11,4],[11,5],[11,6],[12,6],[12,7],[12,8],[9,8],
  // outer ring adjacents
  [1,2],[3,4],[5,6],[7,8],
];

function NeuralNetLogo() {
  return (
    <svg viewBox="0 0 48 48" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <radialGradient id="nhGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00E6A8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00E6A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nhEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00E6A8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
        </linearGradient>
        <filter id="nhBloom" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <circle cx="24" cy="24" r="22" fill="url(#nhGlow)" />

      {EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y}
          x2={NODES[b].x} y2={NODES[b].y}
          stroke="url(#nhEdge)"
          strokeWidth="0.75"
          strokeLinecap="round"
          className="nh-edge"
          style={{ animationDelay: `${(i % 6) * 0.28}s` }}
        />
      ))}

      {NODES.slice(1).map((n, i) => (
        <circle
          key={i} cx={n.x} cy={n.y} r={n.r}
          fill="#00E6A8"
          className="nh-node-outer"
          style={{ animationDelay: `${i * 0.22}s` }}
          filter="url(#nhBloom)"
        />
      ))}

      <circle cx="24" cy="24" r="3.5" fill="#00f0b0" className="nh-node-center" filter="url(#nhBloom)" />
    </svg>
  );
}

// ── Nav groups ─────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  [
    { id: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
    { id: 'chat',      label: 'Chat',       Icon: MessageSquare },
    { id: 'personal',  label: 'Personal',   Icon: User },
  ],
  [
    { id: 'org',          label: 'Organization', Icon: Users },
    { id: 'agents',       label: 'Agents',       Icon: Bot },
    { id: 'workflows',    label: 'Workflows',    Icon: GitBranch },
    { id: 'capabilities', label: 'Capabilities', Icon: Zap },
  ],
  [
    { id: 'memory',    label: 'Memory',    Icon: Brain },
    { id: 'documents', label: 'Documents', Icon: FileText },
    { id: 'metrics',   label: 'Metrics',   Icon: BarChart3 },
  ],
  [
    { id: 'terminal', label: 'Terminal', Icon: Terminal },
    { id: 'settings', label: 'Settings', Icon: Settings },
  ],
];

// ── Nav item ───────────────────────────────────────────────────────────────────
type LucideIcon = React.FC<{ size?: number; strokeWidth?: number }>;

function NavItem({
  id, label, Icon, active, onClick,
}: { id: string; label: string; Icon: LucideIcon; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        style={{
          width: 44, height: 44,
          borderRadius: '50%',
          border: active
            ? '1.5px solid rgba(0,230,168,0.6)'
            : hovered
            ? '1px solid rgba(0,230,168,0.22)'
            : '1px solid rgba(255,255,255,0.07)',
          background: active
            ? 'linear-gradient(135deg, rgba(0,230,168,0.2), rgba(0,196,148,0.10))'
            : hovered
            ? 'linear-gradient(135deg, rgba(0,230,168,0.1), rgba(0,230,168,0.04))'
            : 'rgba(255,255,255,0.03)',
          color: active ? '#00f0b0' : hovered ? 'var(--text-primary)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .16s ease',
          boxShadow: active
            ? '0 0 0 5px rgba(0,230,168,0.09), 0 6px 20px rgba(0,230,168,0.22), inset 0 1px 0 rgba(0,230,168,0.18)'
            : hovered
            ? '0 4px 14px rgba(0,230,168,0.1), inset 0 1px 0 rgba(0,230,168,0.1)'
            : 'none',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />

        {/* Active accent dot */}
        {active && (
          <span style={{
            position: 'absolute', right: 1, top: '50%', transform: 'translateY(-50%)',
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent)',
          }} />
        )}
      </button>

      {/* Tooltip */}
      {hovered && (
        <div className="animate-fade-in" style={{
          position: 'absolute', left: 52, top: '50%', transform: 'translateY(-50%)',
          zIndex: 200,
          background: 'rgba(6,9,16,0.96)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          padding: '6px 12px',
          fontSize: 12, fontWeight: 700,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }}>
          {label}
          {/* Arrow */}
          <span style={{
            position: 'absolute', left: -4, top: '50%',
            transform: 'translateY(-50%) rotate(45deg)',
            width: 7, height: 7,
            background: 'rgba(6,9,16,0.96)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRight: 'none', borderTop: 'none',
          }} />
        </div>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
interface NeuralHubNavProps {
  active: string;
  onNav: (id: string) => void;
  summary: GatewaySummary;
  currentUserName: string;
  mobile?: boolean;
  mobileOpen?: boolean;
}

export default function NeuralHubNav({
  active, onNav, summary, currentUserName,
  mobile = false, mobileOpen = false,
}: NeuralHubNavProps) {
  const [statusHovered, setStatusHovered] = useState(false);

  return (
    <aside
      aria-hidden={mobile && !mobileOpen}
      style={{
        width: 72, minWidth: 72,
        height: mobile ? '100vh' : 'calc(100vh - 24px)',
        margin: mobile ? 0 : '12px 0 12px 12px',
        borderRadius: mobile ? 0 : 24,
        /* Premium Command Center card aesthetic — dark translucent with green tint */
        background: 'linear-gradient(180deg, rgba(0,230,168,0.07) 0%, rgba(0,230,168,0.02) 40%, rgba(4,8,15,0.82) 100%)',
        backdropFilter: 'blur(36px) saturate(200%)',
        WebkitBackdropFilter: 'blur(36px) saturate(200%)',
        border: '1px solid rgba(0,230,168,0.18)',
        borderBottom: '1px solid rgba(0,230,168,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,230,168,0.14), 0 0 40px rgba(0,230,168,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: mobile ? 'fixed' : 'relative',
        left: mobile ? 0 : 'auto',
        top: mobile ? 0 : 'auto',
        zIndex: 20,
        transform: mobile ? `translateX(${mobileOpen ? '0' : '-110%'})` : 'none',
        transition: 'transform .24s cubic-bezier(.16,1,.3,1)',
        overflow: 'visible',
      }}
    >
      {/* ── Logo hub ──────────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 18, paddingBottom: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
        <div style={{ position: 'relative', width: 54, height: 54 }}>
          {/* Outer pulse rings */}
          <span className="nh-ring-pulse" style={{
            position: 'absolute', inset: -5, borderRadius: '50%',
            border: '1px solid rgba(0,230,168,0.35)',
            pointerEvents: 'none',
          }} />
          <span className="nh-ring-pulse" style={{
            position: 'absolute', inset: -10, borderRadius: '50%',
            border: '1px solid rgba(0,230,168,0.15)',
            pointerEvents: 'none', animationDelay: '1.1s',
          }} />
          <span className="nh-ring-pulse" style={{
            position: 'absolute', inset: -16, borderRadius: '50%',
            border: '1px solid rgba(0,230,168,0.06)',
            pointerEvents: 'none', animationDelay: '2.2s',
          }} />

          {/* Logo disc — same card treatment as Premium Command Center */}
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(0,230,168,0.22) 0%, rgba(0,230,168,0.06) 60%, rgba(96,165,250,0.1) 100%)',
            border: '1.5px solid rgba(0,230,168,0.45)',
            boxShadow: '0 0 28px rgba(0,230,168,0.28), inset 0 1px 0 rgba(0,230,168,0.3)',
            padding: 8, position: 'relative', zIndex: 1,
          }}>
            <NeuralNetLogo />
          </div>
        </div>

        <span style={{
          fontSize: 7.5, fontWeight: 900, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(0,240,176,0.7)',
        }}>NEURAL</span>
      </div>

      {/* Divider */}
      <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0 8px' }} />

      {/* ── Navigation ────────────────────────────────────────────────────────── */}
      <nav style={{
        flex: 1, overflowY: 'auto', overflowX: 'visible',
        width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 3, padding: '2px 0 8px',
        scrollbarWidth: 'none',
      }}>
        {NAV_GROUPS.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && (
              <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.06)', margin: '5px 0' }} />
            )}
            {group.map(item => (
              <NavItem
                key={item.id}
                {...item}
                active={active === item.id}
                onClick={() => onNav(item.id)}
              />
            ))}
          </React.Fragment>
        ))}
      </nav>

      {/* ── Status ────────────────────────────────────────────────────────────── */}
      <div
        style={{ padding: '8px 0 14px', position: 'relative', display: 'flex', justifyContent: 'center' }}
        onMouseEnter={() => setStatusHovered(true)}
        onMouseLeave={() => setStatusHovered(false)}
      >
        <button style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'default',
        }}>
          <span className={`status-dot ${summary.ok ? 'online' : 'offline'}`} />
        </button>

        {statusHovered && (
          <div className="animate-fade-in" style={{
            position: 'absolute', left: 44, bottom: 10, zIndex: 200,
            background: 'rgba(6,9,16,0.96)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: '12px 14px', minWidth: 168,
            boxShadow: '0 8px 28px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span className={`status-dot ${summary.ok ? 'online' : 'offline'}`} />
              <span style={{ fontSize: 11, fontWeight: 700, color: summary.ok ? 'var(--accent-dark)' : 'var(--text-muted)' }}>
                {summary.environment}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              <span>Latency</span>
              <span style={{ color: summary.ok ? 'var(--accent-dark)' : 'var(--status-amber)', fontWeight: 700 }}>
                {summary.latencyMs != null ? `${summary.latencyMs}ms` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>Daily spend</span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {summary.dailyCostUsd != null ? `$${summary.dailyCostUsd.toFixed(2)}` : '—'}
              </span>
            </div>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: 'var(--text-muted)' }}>
              {currentUserName}'s workspace
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
