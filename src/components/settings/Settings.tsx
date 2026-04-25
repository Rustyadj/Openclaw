import React, { useState } from 'react';

type SettingsTab = 'general' | 'models' | 'channels' | 'notifications' | 'appearance' | 'billing' | 'security';

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: string }[] = [
  { id: 'general',       label: 'General',        icon: '⚙' },
  { id: 'models',        label: 'Models & APIs',  icon: '⚡' },
  { id: 'channels',      label: 'Channels',       icon: '✦' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
  { id: 'appearance',    label: 'Appearance',     icon: '◌' },
  { id: 'billing',       label: 'Billing',        icon: '◷' },
  { id: 'security',      label: 'Security',       icon: '🔒' },
];

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9,
  padding: '9px 13px', fontSize: 13, color: 'var(--text-primary)',
  fontFamily: "'Outfit', sans-serif",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: hint ? 2 : 6 }}>{label}</div>
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, lineHeight: 1.4 }}>{hint}</div>}
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', background: value ? 'var(--accent)' : 'rgba(0,0,0,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0, boxShadow: value ? '0 2px 8px rgba(0,230,168,0.35)' : 'none' }}>
        <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.2px', marginBottom: 16, color: 'var(--text-primary)' }}>{title}</div>
      {children}
    </div>
  );
}

function ApiKeyField({ label, placeholder, saved }: { label: string; placeholder: string; saved?: boolean }) {
  const [show, setShow] = useState(false);
  const [val, setVal] = useState(saved ? 'sk-•••••••••••••••••••••' : '');
  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type={show ? 'text' : 'password'}
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={() => setShow(!show)} style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '0 12px', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
          {show ? '🙈' : '👁'}
        </button>
        {saved && <span className="tag tag-green" style={{ alignSelf: 'center' }}>Saved</span>}
      </div>
    </Field>
  );
}

// ── Tab content components ────────────────────────────────

function GeneralSettings() {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section title="Profile">
        <Field label="Display Name"><input defaultValue="Rusty" style={inputStyle} /></Field>
        <Field label="Email"><input defaultValue="rusty@example.com" style={inputStyle} /></Field>
        <Field label="Timezone">
          <select defaultValue="America/Chicago" style={{ ...inputStyle }}>
            <option value="America/Chicago">America/Chicago (CST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            <option value="UTC">UTC</option>
          </select>
        </Field>
      </Section>

      <Section title="Gateway">
        <Field label="Gateway URL" hint="Your OpenClaw gateway endpoint">
          <input defaultValue="http://127.0.0.1:59062" style={inputStyle} />
        </Field>
        <Field label="Cluster" hint="Current deployment environment">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input defaultValue="GCP-US-CENTRAL" style={{ ...inputStyle, flex: 1 }} />
            <span className="tag tag-green" style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>Connected</span>
          </div>
        </Field>
        <Field label="Token Auth">
          <input type="password" defaultValue="tok_••••••••••••" style={inputStyle} />
        </Field>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ background: saved ? 'rgba(0,201,122,0.15)' : 'linear-gradient(135deg,#00E6A8,#00C494)', border: saved ? '1px solid rgba(0,201,122,0.3)' : 'none', borderRadius: 10, padding: '10px 24px', color: saved ? 'var(--status-green)' : '#fff', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: saved ? 'none' : '0 4px 14px rgba(0,230,168,0.3)' }}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function ModelsSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section title="API Keys">
        <ApiKeyField label="Anthropic API Key" placeholder="sk-ant-..." saved />
        <ApiKeyField label="OpenRouter API Key" placeholder="sk-or-..." saved />
        <ApiKeyField label="Google AI / Gemini" placeholder="AIza..." saved />
        <ApiKeyField label="OpenAI API Key" placeholder="sk-..." />
        <ApiKeyField label="ElevenLabs API Key (Voice TTS)" placeholder="..." saved />
      </Section>

      <Section title="Default Model Routing">
        <Field label="Primary Model" hint="Used for most agent tasks">
          <select style={inputStyle}>
            <option>claude-sonnet-4-6</option>
            <option>claude-opus-4-5</option>
            <option>gemini-flash-3</option>
            <option>deepseek-r1-0528</option>
            <option>gpt-4o</option>
          </select>
        </Field>
        <Field label="Fallback Model" hint="Used when primary is rate-limited or unavailable">
          <select style={inputStyle}>
            <option>deepseek-r1-0528:free</option>
            <option>gemini-flash-3</option>
            <option>llama-3.3-70b:free</option>
          </select>
        </Field>
        <Field label="Reasoning Model" hint="Used for complex analytical tasks">
          <select style={inputStyle}>
            <option>deepseek-r1-0528</option>
            <option>claude-opus-4-5</option>
            <option>o3-mini</option>
          </select>
        </Field>
        <Field label="Budget Model" hint="Used for routine/cron tasks to minimize cost">
          <select style={inputStyle}>
            <option>gemini-flash-3</option>
            <option>deepseek-r1-0528:free</option>
            <option>llama-3.3-70b:free</option>
          </select>
        </Field>
      </Section>

      <Section title="Cost Controls">
        <Field label="Daily Budget Cap ($)" hint="Gateway will pause non-critical tasks if exceeded">
          <input type="number" defaultValue="5.00" style={inputStyle} />
        </Field>
        <Field label="Monthly Budget Cap ($)">
          <input type="number" defaultValue="150.00" style={inputStyle} />
        </Field>
      </Section>
    </div>
  );
}

function ChannelsSettings() {
  const channels = [
    { name: 'Discord',   icon: '💬', connected: true,  badge: '#5865F2' },
    { name: 'Telegram',  icon: '✈️',  connected: true,  badge: '#2AABEE' },
    { name: 'Slack',     icon: '⚡',  connected: true,  badge: '#4A154B' },
    { name: 'WhatsApp',  icon: '📱',  connected: false, badge: '#25D366' },
    { name: 'Signal',    icon: '🔒',  connected: false, badge: '#3A76F0' },
    { name: 'iMessage',  icon: '🍎',  connected: false, badge: '#34C759' },
    { name: 'Teams',     icon: '👥',  connected: false, badge: '#6264A7' },
    { name: 'Matrix',    icon: '◫',   connected: false, badge: '#000' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10 }}>
        Connect messaging channels so your agents can send and receive messages. Each channel can be routed to a specific agent.
      </div>
      {channels.map(ch => (
        <div key={ch.name} className="glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ch.badge}18`, border: `1.5px solid ${ch.badge}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{ch.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{ch.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{ch.connected ? 'Connected · Routing to Orchestrator' : 'Not connected'}</div>
          </div>
          {ch.connected ? (
            <div style={{ display: 'flex', gap: 7 }}>
              <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>Configure</button>
              <button style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', fontSize: 11, fontWeight: 600, color: 'var(--status-red)', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>Disconnect</button>
            </div>
          ) : (
            <button style={{ background: 'linear-gradient(135deg,#00E6A8,#00C494)', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 3px 10px rgba(0,230,168,0.25)' }}>Connect</button>
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationsSettings() {
  const [prefs, setPrefs] = useState({
    agentErrors: true, cronFailures: true, highCost: true, newMember: true,
    agentActivity: false, memoryCompact: false, weeklyReport: true, dailyBrief: true,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section title="Alerts">
        <Toggle label="Agent Errors"         desc="Alert when an agent fails or throws an error" value={prefs.agentErrors}  onChange={() => toggle('agentErrors')} />
        <Toggle label="Cron Job Failures"    desc="Alert when a scheduled task fails"            value={prefs.cronFailures} onChange={() => toggle('cronFailures')} />
        <Toggle label="High Cost Warning"    desc="Alert when daily spend exceeds 80% of budget" value={prefs.highCost}     onChange={() => toggle('highCost')} />
        <Toggle label="New Org Member"       desc="Alert when someone joins your organization"   value={prefs.newMember}   onChange={() => toggle('newMember')} />
      </Section>
      <Section title="Activity">
        <Toggle label="Agent Activity Feed"  desc="Live updates for agent task completions"      value={prefs.agentActivity} onChange={() => toggle('agentActivity')} />
        <Toggle label="Memory Compaction"    desc="Notify when memory vault runs auto-compact"   value={prefs.memoryCompact} onChange={() => toggle('memoryCompact')} />
      </Section>
      <Section title="Reports">
        <Toggle label="Daily Brief"          desc="Morning summary from Orchestrator at 8am"     value={prefs.dailyBrief}    onChange={() => toggle('dailyBrief')} />
        <Toggle label="Weekly Cost Report"   desc="Monday morning spend and efficiency report"   value={prefs.weeklyReport}  onChange={() => toggle('weeklyReport')} />
      </Section>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('light-glass');
  const [accentColor, setAccentColor] = useState('#00E6A8');
  const [fontSize, setFontSize] = useState('medium');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const themes = [
    { id: 'light-glass', label: 'Light Glass', desc: 'Light gray canvas, frosted glass (current)', preview: { bg: '#F0F2F7', accent: '#00E6A8' } },
    { id: 'dark-glass',  label: 'Dark Glass',  desc: 'Deep dark canvas, frosted panels',           preview: { bg: '#0F1117', accent: '#00E6A8' } },
    { id: 'midnight',    label: 'Midnight',    desc: 'Pure black, minimal UI',                      preview: { bg: '#000000', accent: '#00E6A8' } },
    { id: 'warm',        label: 'Warm Mist',   desc: 'Warm gray canvas, soft shadows',              preview: { bg: '#F5F0EB', accent: '#F59E0B' } },
  ];

  const accents = ['#00E6A8', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section title="Theme">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {themes.map(t => (
            <div key={t.id} onClick={() => setTheme(t.id)} style={{ padding: '14px', borderRadius: 12, border: `2px solid ${theme === t.id ? 'var(--accent)' : 'rgba(0,0,0,0.08)'}`, cursor: 'pointer', background: theme === t.id ? 'rgba(0,230,168,0.06)' : 'rgba(255,255,255,0.5)', transition: 'all 0.15s', display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 28, borderRadius: 8, background: t.preview.bg, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: t.preview.accent }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Accent Color">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {accents.map(c => (
            <button key={c} onClick={() => setAccentColor(c)} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `3px solid ${accentColor === c ? 'white' : 'transparent'}`, outline: accentColor === c ? `2px solid ${c}` : 'none', cursor: 'pointer', transition: 'all 0.15s', boxShadow: accentColor === c ? `0 0 0 4px ${c}40` : 'none' }} />
          ))}
        </div>
      </Section>

      <Section title="Layout">
        <Field label="Font Size">
          <div style={{ display: 'flex', gap: 8 }}>
            {['small','medium','large'].map(s => (
              <button key={s} onClick={() => setFontSize(s)} style={{ flex: 1, padding: '8px', borderRadius: 9, border: `1.5px solid ${fontSize === s ? 'var(--accent)' : 'rgba(0,0,0,0.08)'}`, background: fontSize === s ? 'rgba(0,230,168,0.08)' : 'rgba(255,255,255,0.6)', color: fontSize === s ? 'var(--accent-dark)' : 'var(--text-secondary)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: fontSize === s ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
            ))}
          </div>
        </Field>
        <Toggle label="Compact Sidebar" desc="Collapse sidebar to icon-only mode by default" value={sidebarCollapsed} onChange={setSidebarCollapsed} />
      </Section>
    </div>
  );
}

function BillingSettings() {
  const USAGE_DAYS = [0.18, 0.42, 0.31, 0.55, 0.29, 0.38, 0.34];
  const total = USAGE_DAYS.reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { label: 'This Week',    val: `$${total.toFixed(2)}`, color: '#00E6A8', delta: '↓ 8% vs last' },
          { label: 'This Month',   val: '$8.42',   color: '#3B82F6', delta: '↑ 12% vs last' },
          { label: 'Monthly Budget',val: '$150.00', color: '#8B5CF6', delta: '94% remaining' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.8px', color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Daily chart */}
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Daily Spend (7 days)</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 80 }}>
          {USAGE_DAYS.map((d, i) => {
            const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Today'];
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', background: i === 6 ? 'var(--accent)' : 'rgba(0,230,168,0.3)', borderRadius: '6px 6px 0 0', height: `${(d / 0.55) * 60}px`, transition: 'height 0.6s', boxShadow: i === 6 ? '0 4px 12px rgba(0,230,168,0.3)' : 'none' }} />
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{days[i]}</div>
                <div style={{ fontSize: 10, fontFamily: 'DM Mono,monospace', color: i === 6 ? 'var(--accent-dark)' : 'var(--text-muted)', fontWeight: i === 6 ? 700 : 400 }}>${d.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="glass-card" style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Cost by Provider (7d)</div>
        {[
          { name: 'Anthropic (claude-sonnet)', cost: 1.47, pct: 67, color: '#00E6A8' },
          { name: 'OpenRouter (deepseek-r1)',  cost: 0.63, pct: 29, color: '#8B5CF6' },
          { name: 'Google (gemini-flash)',     cost: 0.28, pct: 13, color: '#3B82F6' },
        ].map(p => (
          <div key={p.name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono,monospace' }}>${p.cost.toFixed(2)}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section title="Gateway Security">
        <Toggle label="Require Token Auth"        desc="All gateway requests must include a valid session token"   value={true}  onChange={() => {}} />
        <Toggle label="Trusted Proxy Headers"     desc="Enable X-Forwarded-For header trust (required behind Nginx)" value={false} onChange={() => {}} />
        <Toggle label="DM Pairing Mode"           desc="Only paired devices can send DMs to your agents"          value={true}  onChange={() => {}} />
        <Toggle label="Sandbox Mode"              desc="Run agent tool executions in an isolated sandbox"          value={false} onChange={() => {}} />
      </Section>
      <Section title="Agent Security">
        <Toggle label="Allowlist-only Triggers"   desc="Only allowlisted senders can trigger agent commands"      value={true}  onChange={() => {}} />
        <Toggle label="Command Approval Gate"     desc="Require explicit approval before shell commands run"      value={false} onChange={() => {}} />
        <Toggle label="Redact Sensitive Logs"     desc="Auto-redact API keys and tokens from log output"         value={true}  onChange={() => {}} />
        <Toggle label="Cross-tenant Isolation"    desc="Prevent agents from accessing data across organizations"  value={true}  onChange={() => {}} />
      </Section>
      <Section title="Sessions">
        <Field label="Session Timeout">
          <select style={inputStyle}>
            <option>24 hours</option><option>7 days</option><option>30 days</option><option>Never</option>
          </select>
        </Field>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 9, padding: '8px 16px', color: 'var(--status-red)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Revoke All Sessions</button>
          <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 9, padding: '8px 16px', color: 'var(--text-secondary)', fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Audit Log</button>
        </div>
      </Section>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────

export default function Settings() {
  const [tab, setTab] = useState<SettingsTab>('general');

  const renderContent = () => {
    switch (tab) {
      case 'general':       return <GeneralSettings />;
      case 'models':        return <ModelsSettings />;
      case 'channels':      return <ChannelsSettings />;
      case 'notifications': return <NotificationsSettings />;
      case 'appearance':    return <AppearanceSettings />;
      case 'billing':       return <BillingSettings />;
      case 'security':      return <SecuritySettings />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left nav */}
      <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(16px)', padding: '20px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 8 }}>Settings</div>
        {SETTINGS_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 9, border: 'none', background: tab === t.id ? 'rgba(0,230,168,0.12)' : 'transparent', color: tab === t.id ? 'var(--accent-dark)' : 'var(--text-secondary)', fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: tab === t.id ? 600 : 500, cursor: 'pointer', marginBottom: 2, textAlign: 'left', transition: 'all 0.15s', boxShadow: tab === t.id ? 'inset 0 0 0 1px rgba(0,230,168,0.2)' : 'none' }}>
            <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>
            {SETTINGS_TABS.find(t => t.id === tab)?.label}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
            {tab === 'general' && 'Profile, gateway connection, and workspace configuration'}
            {tab === 'models' && 'API keys, model routing, and cost controls'}
            {tab === 'channels' && 'Connect and configure messaging channels'}
            {tab === 'notifications' && 'Control what alerts you receive and when'}
            {tab === 'appearance' && 'Customize the look and feel of your workspace'}
            {tab === 'billing' && 'Usage stats, costs, and budget settings'}
            {tab === 'security' && 'Gateway security, agent permissions, and session management'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
