import React from 'react';
import { brandColors } from '@psp/shared';

const styles = {
  panel: {
    display: 'none',
    width: '50%',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    background: '#0F0B2E',
  },
  // Animated gradient background
  gradientBg: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 80% 60%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)
    `,
  },
  // Grid background
  grid: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    opacity: 0.3,
  },
  // Noise texture overlay
  noise: {
    position: 'absolute' as const,
    inset: 0,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  },
  // Floating orbs
  orb1: {
    position: 'absolute' as const,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
    top: '10%',
    left: '-10%',
    filter: 'blur(40px)',
    animation: 'float1 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute' as const,
    width: 350,
    height: 350,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.35) 0%, rgba(139, 92, 246, 0.08) 45%, transparent 70%)',
    top: '40%',
    right: '-5%',
    filter: 'blur(50px)',
    animation: 'float2 10s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute' as const,
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
    bottom: '10%',
    left: '30%',
    filter: 'blur(45px)',
    animation: 'float3 12s ease-in-out infinite',
  },
  // Top section - Logo & Brand
  topSection: {
    position: 'relative' as const,
    zIndex: 2,
    height: '33.33%',
    padding: '48px 56px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: brandColors.gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    color: '#fff',
    boxShadow: '0 6px 16px rgba(99,102,241,0.4)',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.3,
    color: '#E2E8F0',
  },
  // Middle section - Headline
  middleSection: {
    position: 'relative' as const,
    zIndex: 2,
    height: '33.33%',
    padding: '0 56px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 44,
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: -1.5,
    color: '#FFFFFF',
  } as React.CSSProperties,
  highlight: {
    background: 'linear-gradient(135deg, #C7D2FE 0%, #8B5CF6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,
  subtitle: {
    fontSize: 15,
    color: 'rgba(226, 232, 240, 0.65)',
    maxWidth: 400,
    lineHeight: 1.7,
    marginTop: 16,
  },
  // Bottom section - Feature cards
  bottomSection: {
    position: 'relative' as const,
    zIndex: 2,
    height: '33.33%',
    padding: '24px 56px 48px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 20,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(99, 102, 241, 0.18)',
    color: '#C7D2FE',
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#F8FAFC',
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(226, 232, 240, 0.55)',
    lineHeight: 1.5,
  },
};

const LayersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const BrandPanel: React.FC = () => {
  return (
    <aside className="brand-panel" style={styles.panel}>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(20px); }
        }
        @media (min-width: 1024px) {
          .brand-panel { display: block !important; }
        }
        @media (min-width: 1440px) {
          .brand-panel { width: 55% !important; }
        }
      `}</style>

      <div style={styles.gradientBg} />
      <div style={styles.grid} />
      <div style={styles.noise} />
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.orb3} />

      {/* Top Section - Brand */}
      <div style={styles.topSection}>
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <LayersIcon />
          </div>
          <span style={styles.logoText}>PSP Admin</span>
        </div>
      </div>

      {/* Middle Section - Headline */}
      <div style={styles.middleSection}>
        <div style={styles.headline}>
          Secure
          <br />
          <span style={styles.highlight}>Payment</span>
          <br />
          Management
        </div>
        <p style={styles.subtitle}>
          Enterprise-grade payment platform with real-time transaction monitoring, 
          risk management, and multi-currency settlement.
        </p>
      </div>

      {/* Bottom Section - Features */}
      <div style={styles.bottomSection}>
        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardIcon}><ShieldIcon /></div>
            <div style={styles.cardTitle}>Bank-Grade Security</div>
            <div style={styles.cardDesc}>SOC2 Type II certified with end-to-end encryption.</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}><GlobeIcon /></div>
            <div style={styles.cardTitle}>Global Coverage</div>
            <div style={styles.cardDesc}>Direct integration with 50+ payment providers.</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BrandPanel;
