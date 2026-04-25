import React, { useState } from 'react';

const STEPS = [
  {
    num: '01',
    name: 'Stitch',
    role: 'UI / UX Generation',
    icon: '✦',
    color: '#8B5CF6',
    colorSoft: 'rgba(139,92,246,0.1)',
    colorBorder: 'rgba(139,92,246,0.2)',
    description: 'High-fidelity mockups, layout generation, design systems, glassmorphism / liquid glass aesthetics.',
    tasks: ['Generate UI mockups', 'Recreate from screenshots', 'Build design systems', 'Rapid visual ideation'],
    url: 'https://stitch.withgoogle.com',
    status: 'ready',
  },
  {
    num: '02',
    name: 'v0.dev',
    role: 'Frontend Refinement',
    icon: '⟐',
    color: '#3B82F6',
    colorSoft: 'rgba(59,130,246,0.1)',
    colorBorder: 'rgba(59,130,246,0.2)',
    description: 'Next.js + TailwindCSS + shadcn/ui generation. Clean componentization, responsive layouts, zero duplication.',
    tasks: ['Next.js code generation', 'shadcn/ui components', 'Responsive layouts', 'Reusable structure'],
    url: 'https://v0.dev',
    status: 'ready',
  },
  {
    num: '03',
    name: 'Claude Code',
    role: 'Logic & Architecture',
    icon: '◎',
    color: '#00B882',
    colorSoft: 'rgba(0,184,130,0.1)',
    colorBorder: 'rgba(0,184,130,0.2)',
    description: 'Backend wiring, API integrations, state management, refactoring, and enterprise-grade architecture.',
    tasks: ['API integrations', 'State management', 'Database schema', 'Refactoring & debugging'],
    url: null,
    status: 'active',
  },
  {
    num: '04',
    name: 'Nano Banana',
    role: 'Force Multipliers',
    icon: '⚡',
    color: '#F59E0B',
    colorSoft: 'rgba(245,158,11,0.1)',
    colorBorder: 'rgba(245,158,11,0.2)',
    description: 'Creative variations, design inspiration, visual enhancements, and experimental styling improvements.',
    tasks: ['Creative variations', 'Visual enhancements', 'Design inspiration', 'Advanced styling'],
    url: null,
    status: 'ready',
  },
];

const RECENT_TASKS = [
  { id: 1, title: 'OpenClaw Dashboard Redesign', stage: 3, status: 'in-progress', updated: '2m ago', tag: 'SaaS Dashboard' },
  { id: 2, title: 'VPS Deploy Landing Page', stage: 2, status: 'in-progress', updated: '1h ago', tag: 'Landing Page' },
  { id: 3, title: 'Agent Card Component', stage: 4, status: 'done', updated: '3h ago', tag: 'Component' },
  { id: 4, title: 'Auth Flow Screens', stage: 4, status: 'done', updated: 'Yesterday', tag: 'Auth' },
];

const STACK_DEFAULTS = [
  { label: 'Next.js', color: '#0F1117' },
  { label: 'TailwindCSS', color: '#06B6D4' },
  { label: 'shadcn/ui', color: '#18181B' },
  { label: 'Framer Motion', color: '#8B5CF6' },
  { label: 'TypeScript', color: '#3B82F6' },
  { label: 'Firebase', color: '#F59E0B' },
];

export default function DesignPipeline() {
  const [taskInput, setTaskInput] = useState('');
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div style={{ padding: '28px 28px 48px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Hero */}
      <div className="glass-card" style={{
        padding: '28px 32px',
        marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,230,168,0.06) 50%, rgba(59,130,246,0.06) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 220, height: 220,
          background: 'radial-gradient(circle, rgba(0,230,168,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139,92,246,0.35)',
              }}>
                <span style={{ fontSize: 16 }}>✦</span>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.4px' }}>Elite Design & Build Pipeline</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>4-step workflow for production-ready, visually elite outputs</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.6, margin: '12px 0 0' }}>
              Every design request flows through Stitch → v0.dev → Claude Code → Nano Banana.
              Premium SaaS aesthetics, clean architecture, zero AI clutter.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STACK_DEFAULTS.map(s => (
              <span key={s.label} style={{
                fontSize: 11, fontWeight: 600,
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.08)',
                color: 'var(--text-secondary)',
              }}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Input */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Start a Design Task
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <textarea
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            placeholder="Describe what you want to design or build… e.g. 'Redesign the agents page with a card grid and expandable detail panel'"
            rows={2}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 10, padding: '12px 14px',
              fontFamily: "'Outfit', sans-serif", fontSize: 13,
              color: 'var(--text-primary)', resize: 'none',
              outline: 'none', lineHeight: 1.5,
              transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
          />
          <button
            style={{
              padding: '0 20px',
              background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
              border: 'none', borderRadius: 10,
              color: '#fff', fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139,92,246,0.35)',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.45)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.35)')}
            onClick={() => setTaskInput('')}
          >
            ✦ Launch Pipeline
          </button>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
        {STEPS.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <div
              key={step.num}
              className="glass-card"
              onClick={() => setActiveStep(isActive ? null : i)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: isActive ? `1.5px solid ${step.colorBorder}` : '1px solid rgba(255,255,255,0.9)',
                background: isActive ? step.colorSoft : undefined,
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Step number watermark */}
              <div style={{
                position: 'absolute', right: 12, top: 8,
                fontSize: 48, fontWeight: 900, color: step.color,
                opacity: 0.06, lineHeight: 1, fontFamily: "'Outfit', sans-serif",
                pointerEvents: 'none',
              }}>{step.num}</div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', right: -10, top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 14, color: 'var(--text-muted)',
                  zIndex: 2, display: 'none',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: step.colorSoft,
                  border: `1px solid ${step.colorBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, color: step.color, flexShrink: 0,
                }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{step.name}</div>
                  <div style={{ fontSize: 10, color: step.color, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{step.role}</div>
                </div>
                {step.status === 'active' && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 9, fontWeight: 700,
                    padding: '3px 7px', borderRadius: 99,
                    background: 'rgba(0,184,130,0.12)', color: '#00A066',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>Active</span>
                )}
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px' }}>
                {step.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                {step.tasks.map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: step.colorSoft, border: `1px solid ${step.colorBorder}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: step.color, flexShrink: 0 }}>✓</span>
                    {t}
                  </div>
                ))}
              </div>

              {step.url && (
                <a
                  href={step.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600,
                    color: step.color,
                    textDecoration: 'none',
                    padding: '5px 10px',
                    background: step.colorSoft,
                    border: `1px solid ${step.colorBorder}`,
                    borderRadius: 7,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Open {step.name} ↗
                </a>
              )}
              {!step.url && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600,
                  color: step.color,
                  padding: '5px 10px',
                  background: step.colorSoft,
                  border: `1px solid ${step.colorBorder}`,
                  borderRadius: 7,
                }}>
                  {step.status === 'active' ? '● Running here' : '◌ Available here'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Flow indicator */}
      <div className="glass-card" style={{ padding: '14px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: step.color, boxShadow: `0 0 6px ${step.color}60`,
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{step.name}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.role}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span style={{ fontSize: 14, color: 'var(--text-muted)', opacity: 0.5 }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Recent Tasks */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Design Tasks</div>
          <button style={{ fontSize: 11, color: 'var(--accent-dark)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>
            View all →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECENT_TASKS.map(task => (
            <div
              key={task.id}
              className="glass-card"
              style={{
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glass-lg)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glass)')}
            >
              {/* Stage progress dots */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {STEPS.map((step, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < task.stage ? step.color : 'rgba(0,0,0,0.1)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Stage {task.stage}/4 · {STEPS[task.stage - 1]?.name ?? 'Done'} · {task.updated}
                </div>
              </div>

              <span style={{
                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
                background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>{task.tag}</span>

              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                background: task.status === 'done' ? 'rgba(0,201,122,0.12)' : 'rgba(59,130,246,0.1)',
                color: task.status === 'done' ? '#00A066' : '#2563EB',
                whiteSpace: 'nowrap', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{task.status === 'done' ? '✓ Done' : '● Active'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Design Rules footer */}
      <div className="glass-card" style={{ padding: '18px 22px', marginTop: 24, background: 'rgba(255,255,255,0.4)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Design Standards</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            'Premium SaaS aesthetics', 'Glassmorphism / Liquid glass',
            'Clean typography', 'Perfect spacing',
            'Mobile responsive', 'Dark/light mode capable',
            'Smooth animations', 'No duplicate components',
            'No generic AI templates', '"$100k app" quality bar',
          ].map(rule => (
            <span key={rule} style={{
              fontSize: 11, padding: '4px 10px', borderRadius: 99,
              background: 'rgba(0,230,168,0.08)',
              border: '1px solid rgba(0,230,168,0.18)',
              color: 'var(--accent-dark)',
              fontWeight: 500,
            }}>{rule}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
