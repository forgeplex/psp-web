import React from 'react';
import { brandColors } from '@psp/shared';

const styles = {
  panel: {
    display: 'none',
    width: '50%',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    background: '#0B0D12',
  },
  // Grid background
  grid: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    opacity: 0.25,
  },
  // Glow accents
  glow1: {
    position: 'absolute' as const,
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 60%)',
    top: '-20%',
    left: '-10%',
    filter: 'blur(20px)',
  },
  glow2: {
    position: 'absolute' as const,
    width: 420,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 60%)',
    bottom: '-15%',
    right: '-5%',
    filter: 'blur(30px)',
  },
  content: {
    position: 'relative' as const,
    zIndex: 2,
    height: '100%',
    padding: '64px 56px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 28,
    color: '#FFFFFF',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: brandColors.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#fff',
    boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.2,
    color: '#E2E8F0',
  },
  headline: {
    fontSize: 40,
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: -1,
  } as React.CSSProperties,
  highlight: {
    background: 'linear-gradient(135deg, #C7D2FE 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,
  subtitle: {
    fontSize: 14,
    color: 'rgba(226, 232, 240, 0.7)',
    maxWidth: 420,
    lineHeight: 1.7,
  },
  cards: {
    marginTop: 'auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  },
  cardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(99, 102, 241, 0.18)',
    color: '#C7D2FE',
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#F8FAFC',
  },
  cardDesc: {
    fontSize: 11,
    color: 'rgba(226, 232, 240, 0.55)',
    lineHeight: 1.5,
  },
};

const LayersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const BrandPanel: React.FC = () => {
  return (
    <aside className="brand-panel" style={styles.panel}>
      <style>{`
        @media (min-width: 1024px) {
          .brand-panel { display: block !important; }
        }
        @media (min-width: 1440px) {
          .brand-panel { width: 55% !important; }
        }
      `}</style>

      <div style={styles.grid} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.content}>
        <div style={styles.topRow}>
          <div style={styles.logoIcon}>
            <LayersIcon />
          </div>
          <span style={styles.logoText}>PSP Terminal</span>
        </div>

        <div>
          <div style={styles.headline}>
            Next Gen
            <br />
            <span style={styles.highlight}>Financial</span>
            <br />
            Infrastructure
          </div>
          <p style={styles.subtitle}>
            Orchestrate global payments, manage risk, and settle funds in real-time. Built for
            high-frequency transaction environments.
          </p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardIcon}><ShieldIcon /></div>
            <div style={styles.cardTitle}>Enterprise Security</div>
            <div style={styles.cardDesc}>Bank-grade encryption and SOC2 Type II compliance.</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}><GlobeIcon /></div>
            <div style={styles.cardTitle}>Global Connectivity</div>
            <div style={styles.cardDesc}>Direct connections to 50+ acquiring banks worldwide.</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
