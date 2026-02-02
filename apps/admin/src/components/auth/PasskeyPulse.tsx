import React from 'react';
import { ScanOutlined } from '@ant-design/icons';
import { brandColors } from '@psp/shared';

interface PasskeyPulseProps {
  active?: boolean;
}

const styles = {
  container: {
    position: 'relative' as const,
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    background: brandColors.primaryLight,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    position: 'relative' as const,
  },
  icon: {
    fontSize: 36,
    color: brandColors.primary,
  },
  pulseRing: (delay: number) => ({
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '50%',
    border: `2px solid ${brandColors.primary}`,
    opacity: 0,
    animation: `pulse 2.4s ease-out infinite ${delay}s`,
  }),
};

export const PasskeyPulse: React.FC<PasskeyPulseProps> = ({ active = true }) => {
  return (
    <>
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
      <div style={styles.container}>
        {active && (
          <>
            <div style={styles.pulseRing(0)} />
            <div style={styles.pulseRing(0.6)} />
            <div style={styles.pulseRing(1.2)} />
          </>
        )}
        <div style={styles.iconWrapper}>
          <ScanOutlined style={styles.icon} />
        </div>
      </div>
    </>
  );
};
