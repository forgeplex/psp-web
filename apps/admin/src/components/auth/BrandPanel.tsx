import React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

const styles = {
  panel: {
    display: 'none',
    width: '50%',
    background: brandColors.gradient,
    padding: 48,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  content: {
    position: 'relative' as const,
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    height: '100%',
    color: '#ffffff',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  logoIcon: {
    width: 48,
    height: 48,
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: -0.5,
  },
  slogan: {
    fontSize: 18,
    fontWeight: 400,
    opacity: 0.9,
    maxWidth: 320,
    lineHeight: 1.6,
  },
  features: {
    marginTop: 48,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 14,
    opacity: 0.9,
  },
  featureIcon: {
    width: 24,
    height: 24,
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  },
};

const LayersIcon: React.FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export const BrandPanel: React.FC = () => {
  const features = ['多重安全认证机制', '细粒度权限控制', '完整操作审计日志'];

  return (
    <aside className="brand-panel" style={styles.panel}>
      <style>{`
        @media (min-width: 1024px) {
          .brand-panel { display: block !important; }
        }
        @media (min-width: 1440px) {
          .brand-panel { width: 55% !important; }
        }
        .brand-panel::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
          animation: brandPulse 15s ease-in-out infinite;
        }
        @keyframes brandPulse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5%, 5%); }
        }
      `}</style>
      <div style={styles.content}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <LayersIcon />
          </div>
          <span style={styles.logoText}>PSP Admin</span>
        </div>
        <p style={styles.slogan}>
          企业级支付管理后台，安全、高效、易用的一站式解决方案。
        </p>
        <div style={styles.features}>
          {features.map((feature) => (
            <div key={feature} style={styles.feature}>
              <div style={styles.featureIcon}>
                <CheckCircleFilled />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
