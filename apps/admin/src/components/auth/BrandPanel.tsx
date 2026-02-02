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
  // Animated gradient mesh background
  meshLayer: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(ellipse 80% 50% at 20% 40%, rgba(99, 102, 241, 0.4) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 20%, rgba(139, 92, 246, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse 50% 60% at 50% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 40% 40% at 75% 60%, rgba(59, 130, 246, 0.25) 0%, transparent 50%)
    `,
    zIndex: 1,
  },
  // Floating orbs
  orb1: {
    position: 'absolute' as const,
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)',
    top: '-10%',
    right: '-5%',
    filter: 'blur(40px)',
    zIndex: 2,
  },
  orb2: {
    position: 'absolute' as const,
    width: 350,
    height: 350,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%)',
    bottom: '-5%',
    left: '-5%',
    filter: 'blur(50px)',
    zIndex: 2,
  },
  orb3: {
    position: 'absolute' as const,
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%)',
    top: '50%',
    left: '60%',
    filter: 'blur(30px)',
    zIndex: 2,
  },
  // Grid pattern overlay
  gridOverlay: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: 3,
    opacity: 0.06,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  },
  // Noise texture
  noiseOverlay: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: 4,
    opacity: 0.03,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '128px 128px',
  },
  content: {
    position: 'relative' as const,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    height: '100%',
    padding: '64px 56px',
    color: '#ffffff',
  },
  // Logo area
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 40,
  },
  logoIcon: {
    width: 52,
    height: 52,
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: -1,
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,
  // Headline
  headline: {
    fontSize: 42,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: -1.5,
    marginBottom: 16,
    maxWidth: 420,
    background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  } as React.CSSProperties,
  subtitle: {
    fontSize: 16,
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.6)',
    maxWidth: 380,
    marginBottom: 48,
  },
  // Feature cards
  featuresGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 14,
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(8px)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.3s ease',
  },
  featureIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  featureDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1.4,
  },
  // Bottom stats
  statsRow: {
    display: 'flex',
    gap: 32,
    marginTop: 56,
    paddingTop: 28,
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.3,
  },
};

const LayersIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const ZapIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const features = [
  {
    icon: <ShieldIcon />,
    iconBg: 'rgba(99, 102, 241, 0.2)',
    title: '多重安全认证',
    desc: 'MFA / Passkey / 生物识别全覆盖',
  },
  {
    icon: <ZapIcon />,
    iconBg: 'rgba(168, 85, 247, 0.2)',
    title: '毫秒级响应',
    desc: '高性能架构，交易处理快人一步',
  },
  {
    icon: <EyeIcon />,
    iconBg: 'rgba(59, 130, 246, 0.2)',
    title: '全链路审计',
    desc: '每一笔操作可追溯，合规无忧',
  },
];

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
        .brand-panel .feature-card:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          transform: translateX(4px);
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.08); }
          66% { transform: translate(15px, -15px) scale(0.92); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.1); }
        }
        .brand-orb-1 { animation: float1 20s ease-in-out infinite; }
        .brand-orb-2 { animation: float2 25s ease-in-out infinite; }
        .brand-orb-3 { animation: float3 18s ease-in-out infinite; }
      `}</style>

      {/* Background layers */}
      <div style={styles.meshLayer} />
      <div className="brand-orb-1" style={styles.orb1} />
      <div className="brand-orb-2" style={styles.orb2} />
      <div className="brand-orb-3" style={styles.orb3} />
      <div style={styles.gridOverlay} />
      <div style={styles.noiseOverlay} />

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoIcon}>
            <LayersIcon />
          </div>
          <span style={styles.logoText}>PSP Admin</span>
        </div>

        <h1 style={styles.headline}>
          智能支付
          <br />
          管理平台
        </h1>

        <p style={styles.subtitle}>
          企业级支付管理后台，为您提供安全、高效、智能的一站式支付解决方案。
        </p>

        <div style={styles.featuresGrid}>
          {features.map((f) => (
            <div key={f.title} className="feature-card" style={styles.featureCard}>
              <div style={{ ...styles.featureIconWrapper, background: f.iconBg }}>
                {f.icon}
              </div>
              <div style={styles.featureText}>
                <span style={styles.featureTitle}>{f.title}</span>
                <span style={styles.featureDesc}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>99.99%</span>
            <span style={styles.statLabel}>系统可用性</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>&lt;50ms</span>
            <span style={styles.statLabel}>平均响应</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>PCI-DSS</span>
            <span style={styles.statLabel}>安全认证</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
