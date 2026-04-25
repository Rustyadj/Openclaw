import React from 'react';
import type { GatewaySummary } from '../../lib/api';

export function ConnectionBanner({ summary }: { summary: GatewaySummary }) {
  return (
    <div style={{
      margin: '10px 24px 0',
      borderRadius: 12,
      padding: '9px 16px',
      border: `1px solid ${summary.ok ? 'rgba(0,230,168,0.22)' : 'rgba(251,191,36,0.22)'}`,
      background: summary.ok ? 'rgba(0,230,168,0.07)' : 'rgba(251,191,36,0.07)',
      display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: summary.ok ? '#00E6A8' : '#FBBF24', boxShadow: summary.ok ? '0 0 8px rgba(0,230,168,0.7)' : '0 0 8px rgba(251,191,36,0.7)', flexShrink: 0 }} />
      <strong style={{ fontSize: 12, color: summary.ok ? '#00E6A8' : '#FBBF24', fontWeight: 700 }}>
        {summary.ok ? 'Gateway connected' : 'Gateway not wired yet'}
      </strong>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{summary.message}</span>
    </div>
  );
}
