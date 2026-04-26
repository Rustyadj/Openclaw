import React, { useState } from 'react';
import { OrgDocuments } from './OrgDocuments';
import { OrgMeetings } from './OrgMeetings';
import { OrgActivity, OrgCRM } from './OrgActivityCRM';
import { OrgSettings } from './OrgSettings';

type SubTab = 'overview' | 'chart' | 'projects' | 'discussions' | 'tasks' | 'documents' | 'crm' | 'meetings' | 'activity' | 'settings';

const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
  { id: 'overview',    label: 'Overview',      icon: '⊞' },
  { id: 'chart',       label: 'Org Chart',     icon: '⬡' },
  { id: 'projects',    label: 'Projects',      icon: '◳' },
  { id: 'discussions', label: 'Discussions',   icon: '✦' },
  { id: 'tasks',       label: 'Tasks',         icon: '✓' },
  { id: 'documents',   label: 'Documents',     icon: '❏' },
  { id: 'crm',         label: 'CRM',           icon: '📇' },
  { id: 'meetings',    label: 'Meetings',      icon: '◷' },
  { id: 'activity',    label: 'Activity',      icon: '◌' },
  { id: 'settings',    label: 'Settings',      icon: '⚙' },
];

const MEMBERS = [
  { name: 'Rusty',    role: 'Owner',  status: 'online',  agent: 'Orchestrator', model: 'claude-sonnet',  initial: 'R', color: '#00E6A8' },
  { name: 'Sarah K.', role: 'Admin',  status: 'online',  agent: 'LawAssist',    model: 'gemini-flash',   initial: 'S', color: '#3B82F6' },
  { name: 'Marcus T.',role: 'Member', status: 'busy',    agent: null,           model: null,             initial: 'M', color: '#8B5CF6' },
  { name: 'Alex R.',  role: 'Guest',  status: 'offline', agent: null,           model: null,             initial: 'A', color: '#F59E0B' },
];

const PROJECTS_DATA = [
  { title: 'Dashboard UI Rebuild',         status: 'In Progress', assignee: '👤 Rusty',         priority: 'High',   due: 'Apr 30' },
  { title: 'Legal Intake Pipeline',        status: 'In Progress', assignee: '◎ LawAssist',      priority: 'High',   due: 'May 5'  },
  { title: 'Attorney Beta Onboarding',     status: 'Review',      assignee: '◎ Orchestrator',   priority: 'High',   due: 'Apr 26' },
  { title: 'CRM Auto-Enrichment Skill',    status: 'Backlog',     assignee: '👤 Rusty',         priority: 'Medium', due: 'May 15' },
  { title: 'Billing Integration',          status: 'Backlog',     assignee: '👤 Marcus T.',     priority: 'Low',    due: 'May 20' },
  { title: 'DeepSeek Model Routing',       status: 'Done',        assignee: '👤 Rusty',         priority: 'Medium', due: 'Apr 20' },
];

const CHANNELS = [
  { name: '# general',         type: 'public',   unread: 0 },
  { name: '# legal-strategy',  type: 'public',   unread: 3 },
  { name: '# dev',             type: 'public',   unread: 0 },
  { name: '🤖 agent-room',     type: 'ai',       unread: 1 },
  { name: '📋 board-only',     type: 'board',    unread: 0 },
  { name: '@ Sarah K.',        type: 'dm',       unread: 2 },
  { name: '@ Marcus T.',       type: 'dm',       unread: 0 },
];

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={{ padding: '16px 18px', ...style }}>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{children}</div>;
}

// ── Sub-views ──────────────────────────────────────────────

const EMOJI_OPTIONS = ['R', '⚖', '🦅', '🔮', '⚡', '🏛', '🌐', '🤖', '🦁', '💎'];
const ACCENT_OPTIONS = ['#00E6A8', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#F97316', '#EF4444'];

function OrgOverview({ orgName, setOrgName, orgHandle, setOrgHandle, orgEmoji, setOrgEmoji, orgAccent, setOrgAccent }: {
  orgName: string; setOrgName: (v: string) => void;
  orgHandle: string; setOrgHandle: (v: string) => void;
  orgEmoji: string; setOrgEmoji: (v: string) => void;
  orgAccent: string; setOrgAccent: (v: string) => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(orgName);
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState(orgHandle);
  const [showCustomize, setShowCustomize] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Org header card */}
      <div className="glass-card" style={{
        padding: '20px 24px',
        background: `linear-gradient(135deg, ${orgAccent}10, rgba(59,130,246,0.06))`,
        borderColor: `${orgAccent}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${orgAccent}, ${orgAccent}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#021a0f',
            boxShadow: `0 6px 20px ${orgAccent}40`,
            cursor: 'pointer', userSelect: 'none',
          }} onClick={() => setShowCustomize(!showCustomize)}>{orgEmoji}</div>
          <div>
            {editingName ? (
              <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)}
                onBlur={() => { setOrgName(nameInput.trim() || orgName); setEditingName(false); }}
                onKeyDown={e => { if (e.key === 'Enter') { setOrgName(nameInput.trim() || orgName); setEditingName(false); } if (e.key === 'Escape') setEditingName(false); }}
                style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${orgAccent}60`, borderRadius: 7, padding: '2px 9px', color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif", outline: 'none' }}
              />
            ) : (
              <div onClick={() => { setNameInput(orgName); setEditingName(true); }} style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px', cursor: 'text', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                {orgName} <span style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.5, fontWeight: 400 }}>✎</span>
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              {editingHandle ? (
                <input autoFocus value={handleInput} onChange={e => setHandleInput(e.target.value)}
                  onBlur={() => { setOrgHandle(handleInput.trim() || orgHandle); setEditingHandle(false); }}
                  onKeyDown={e => { if (e.key === 'Enter') { setOrgHandle(handleInput.trim() || orgHandle); setEditingHandle(false); } if (e.key === 'Escape') setEditingHandle(false); }}
                  style={{ fontSize: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 5, padding: '1px 7px', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', outline: 'none', width: 100 }}
                />
              ) : (
                <span onClick={() => { setHandleInput(orgHandle); setEditingHandle(true); }} style={{ cursor: 'text' }}>@{orgHandle}</span>
              )}
              · 4 members · 2 AI agents · Since Apr 2026
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={() => setShowCustomize(!showCustomize)} style={{ background: showCustomize ? `${orgAccent}16` : 'rgba(255,255,255,0.05)', border: `1px solid ${showCustomize ? orgAccent + '40' : 'rgba(255,255,255,0.09)'}`, borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: showCustomize ? orgAccent : 'var(--text-secondary)' }}>
              ✦ Customize
            </button>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: 'var(--text-secondary)' }}>
              🔗 Invite Link
            </button>
            <button style={{ background: `linear-gradient(135deg, ${orgAccent}, ${orgAccent}CC)`, border: 'none', borderRadius: 9, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: '#021a0f', boxShadow: `0 3px 10px ${orgAccent}40` }}>
              + Invite Member
            </button>
          </div>
        </div>

        {/* Customize panel */}
        {showCustomize && (
          <div className="animate-fade-up" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Org Icon</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} onClick={() => setOrgEmoji(e)} style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${orgEmoji === e ? orgAccent : 'rgba(255,255,255,0.1)'}`, background: orgEmoji === e ? `${orgAccent}20` : 'rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: orgEmoji === e ? orgAccent : 'var(--text-secondary)' }}>{e}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Accent Color</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {ACCENT_OPTIONS.map(c => (
                  <button key={c} onClick={() => setOrgAccent(c)} style={{ width: 28, height: 28, borderRadius: 8, background: c, border: `2px solid ${orgAccent === c ? '#fff' : 'transparent'}`, cursor: 'pointer', boxShadow: orgAccent === c ? `0 0 10px ${c}80` : 'none', transition: 'all 0.15s' }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Members',   val: '4',  icon: '👥' },
          { label: 'AI Agents', val: '2',  icon: '◎' },
          { label: 'Projects',  val: '6',  icon: '◳' },
          { label: 'Tasks',     val: '12', icon: '✓' },
        ].map(s => (
          <GlassCard key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Members */}
      <GlassCard>
        <SectionTitle>Members</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {MEMBERS.map(m => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${m.color}20`, border: `1.5px solid ${m.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: m.color,
              }}>{m.initial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</span>
                  <span className={`status-dot ${m.status}`} />
                </div>
                <span className={`tag tag-${m.role === 'Owner' ? 'accent' : m.role === 'Admin' ? 'blue' : m.role === 'Member' ? 'violet' : 'gray'}`} style={{ fontSize: 10, marginTop: 2 }}>{m.role}</span>
              </div>
              {m.agent && (
                <div style={{ fontSize: 10, color: 'var(--accent-dark)', background: 'var(--accent-soft)', borderRadius: 6, padding: '3px 7px', fontFamily: 'DM Mono, monospace' }}>◎ {m.agent}</div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function OrgChart({ orgName, orgEmoji, orgAccent }: { orgName: string; orgEmoji: string; orgAccent: string }) {
  const connLine = { width: 2, height: 32, background: 'rgba(255,255,255,0.12)' };
  return (
    <GlassCard style={{ minHeight: 400 }}>
      <SectionTitle>Organization Chart</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '20px 0' }}>
        <OrgNode name={orgName} role="Owner" agent="Orchestrator" color={orgAccent} initial={orgEmoji} isRoot />
        <div style={connLine} />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={connLine} />
            <OrgNode name="Sarah K." role="Admin" agent="LawAssist" color="#3B82F6" initial="S" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={connLine} />
            <OrgNode name="Marcus T." role="Member" agent={null} color="#8B5CF6" initial="M" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={connLine} />
            <OrgNode name="Alex R." role="Guest" agent={null} color="#F59E0B" initial="A" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function OrgNode({ name, role, agent, color, initial, isRoot }: any) {
  return (
    <div style={{
      background: isRoot ? `linear-gradient(135deg, ${color}15, ${color}08)` : 'rgba(255,255,255,0.04)',
      border: `1.5px solid ${isRoot ? color + '40' : 'rgba(255,255,255,0.09)'}`,
      borderRadius: 14, padding: '14px 18px', minWidth: 160, textAlign: 'center',
      cursor: 'pointer', transition: 'all 0.18s',
      boxShadow: isRoot ? `0 6px 20px ${color}20` : '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, margin: '0 auto 8px',
        background: `${color}25`, border: `2px solid ${color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800, color,
      }}>{initial}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{role}</div>
      {agent && (
        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--accent-dark)', background: 'var(--accent-soft)', borderRadius: 6, padding: '3px 8px', display: 'inline-block', fontFamily: 'DM Mono, monospace' }}>
          ◎ {agent}
        </div>
      )}
    </div>
  );
}

function Projects() {
  const cols = ['Backlog', 'In Progress', 'Review', 'Done'];
  return (
    <div>
      {/* View toggles */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['Kanban', 'List', 'Calendar', 'Timeline'].map((v, i) => (
          <button key={v} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.09)',
            background: i === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
            fontSize: 12, fontWeight: i === 0 ? 600 : 500,
            color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
          }}>{v}</button>
        ))}
        <button style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", boxShadow: '0 3px 10px rgba(0,230,168,0.25)' }}>+ New Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {cols.map(col => {
          const items = PROJECTS_DATA.filter(p => p.status === col);
          return (
            <div key={col}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{col}</span>
                <span style={{ background: 'rgba(0,0,0,0.07)', borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '1px 7px', color: 'var(--text-muted)' }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(p => (
                  <div key={p.title} className="glass-card" style={{ padding: '12px 14px', cursor: 'pointer' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 8 }}>{p.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.assignee}</span>
                      <span className={`tag tag-${p.priority === 'High' ? 'red' : p.priority === 'Medium' ? 'amber' : 'gray'}`}>{p.priority}</span>
                    </div>
                    {p.due && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>Due {p.due}</div>}
                  </div>
                ))}
                <div style={{
                  border: '1.5px dashed rgba(255,255,255,0.1)', borderRadius: 10,
                  padding: '10px', textAlign: 'center', cursor: 'pointer',
                  fontSize: 11, color: 'var(--text-muted)',
                }}>+ Add</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Discussions() {
  const [activeChannel, setActiveChannel] = useState('# legal-strategy');
  return (
    <div style={{ display: 'flex', gap: 16, height: 500 }}>
      {/* Channel list */}
      <div className="glass-card" style={{ width: 220, padding: '14px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 14px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Channels</div>
        {CHANNELS.map(c => (
          <div key={c.name} onClick={() => setActiveChannel(c.name)} style={{
            padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: activeChannel === c.name ? 'rgba(0,230,168,0.1)' : 'transparent',
            borderLeft: activeChannel === c.name ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 12, fontWeight: c.unread > 0 ? 700 : 500, color: activeChannel === c.name ? 'var(--accent-dark)' : 'var(--text-secondary)' }}>{c.name}</span>
            {c.unread > 0 && <span style={{ background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 99 }}>{c.unread}</span>}
          </div>
        ))}
      </div>

      {/* Messages area */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)', fontWeight: 700, fontSize: 13 }}>{activeChannel}</div>
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          {[
            { from: 'Sarah K.', time: '10:23 AM', msg: 'James Holloway confirmed for the demo on May 2nd. Needs a one-pager on contract review automation beforehand.', initial: 'S', color: '#3B82F6' },
            { from: 'Orchestrator ◎', time: '10:24 AM', msg: 'Understood. I\'ll generate a draft one-pager and post it in #documents for review.', initial: '◎', color: '#00E6A8' },
            { from: 'Rusty', time: '10:31 AM', msg: 'Perfect. Keep it under 2 pages, focus on time savings and accuracy metrics.', initial: 'R', color: '#00E6A8' },
          ].map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: `${msg.color}20`, border: `1.5px solid ${msg.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: msg.color, flexShrink: 0 }}>{msg.initial}</div>
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{msg.from}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.time}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{msg.msg}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <input placeholder={`Message ${activeChannel}...`} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '9px 14px', fontSize: 12, color: 'var(--text-primary)' }} />
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  const tasks = [
    { title: 'Review Patricia Cruz intake form', assignee: '👤 Rusty',       priority: 'High',   status: 'In Progress', due: 'Apr 26' },
    { title: 'Draft attorney one-pager',         assignee: '◎ Orchestrator', priority: 'High',   status: 'In Progress', due: 'Apr 27' },
    { title: 'Legal intake pipeline deploy',     assignee: '◎ LawAssist',    priority: 'High',   status: 'Backlog',     due: 'May 5'  },
    { title: 'Schedule James Holloway demo',     assignee: '👤 Rusty',       priority: 'High',   status: 'Backlog',     due: 'Apr 30' },
    { title: 'CRM skill install + configure',    assignee: '👤 Rusty',       priority: 'Medium', status: 'Backlog',     due: 'May 15' },
    { title: 'Cost report cron fix',             assignee: '◎ Orchestrator', priority: 'Low',    status: 'Backlog',     due: 'May 1'  },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #00E6A8, #00C494)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", boxShadow: '0 3px 10px rgba(0,230,168,0.25)' }}>+ New Task</button>
      </div>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Task', 'Assignee', 'Priority', 'Status', 'Due'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.12s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</td>
                <td style={{ padding: '11px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>{t.assignee}</td>
                <td style={{ padding: '11px 16px' }}><span className={`tag tag-${t.priority === 'High' ? 'red' : t.priority === 'Medium' ? 'amber' : 'gray'}`}>{t.priority}</span></td>
                <td style={{ padding: '11px 16px' }}><span className={`tag tag-${t.status === 'In Progress' ? 'blue' : 'gray'}`}>{t.status}</span></td>
                <td style={{ padding: '11px 16px', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{t.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────

export default function Organization() {
  const [sub, setSub] = useState<SubTab>('overview');
  const [orgName, setOrgName] = useState("Rusty's Org");
  const [orgHandle, setOrgHandle] = useState('rustyadj');
  const [orgEmoji, setOrgEmoji] = useState('R');
  const [orgAccent, setOrgAccent] = useState('#00E6A8');

  const renderSub = () => {
    switch (sub) {
      case 'overview':    return <OrgOverview orgName={orgName} setOrgName={setOrgName} orgHandle={orgHandle} setOrgHandle={setOrgHandle} orgEmoji={orgEmoji} setOrgEmoji={setOrgEmoji} orgAccent={orgAccent} setOrgAccent={setOrgAccent} />;
      case 'chart':       return <OrgChart orgName={orgName} orgEmoji={orgEmoji} orgAccent={orgAccent} />;
      case 'projects':    return <Projects />;
      case 'discussions': return <Discussions />;
      case 'tasks':       return <Tasks />;
      case 'documents':   return <OrgDocuments />;
      case 'crm':         return <OrgCRM />;
      case 'meetings':    return <OrgMeetings />;
      case 'activity':    return <OrgActivity />;
      case 'settings':    return <OrgSettings />;
      default:            return null;
    }
  };

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>
      {/* Sub-tabs */}
      <div style={{
        display: 'flex', gap: 2, padding: '4px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, backdropFilter: 'blur(12px)', width: 'fit-content', flexWrap: 'wrap',
      }}>
        {SUB_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 13px', borderRadius: 9, border: 'none',
              background: sub === t.id ? 'rgba(0,230,168,0.14)' : 'transparent',
              color: sub === t.id ? '#00E6A8' : 'var(--text-muted)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12, fontWeight: sub === t.id ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: sub === t.id ? 'inset 0 0 0 1px rgba(0,230,168,0.25)' : 'none',
            }}
          >
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Sub-content */}
      <div className="animate-fade-in" style={{ flex: 1 }}>
        {renderSub()}
      </div>
    </div>
  );
}
