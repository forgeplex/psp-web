import React, { useEffect } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { statusColors } from '@psp/shared';

interface SuccessOverlayProps {
  visible: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: statusColors.successBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    animation: 'scaleIn 0.4s ease',
  },
  icon: {
    fontSize: 48,
    color: statusColors.success,
  },
  message: {
    fontSize: 18,
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: '#64748b',
  },
};

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
  visible,
  message = '验证成功',
  onComplete,
  duration = 2000,
}) => {
  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete, duration]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div style={styles.overlay}>
        <div style={styles.iconWrapper}>
          <CheckCircleFilled style={styles.icon} />
        </div>
        <div style={styles.message}>{message}</div>
        <div style={styles.subtext}>正在跳转...</div>
      </div>
    </>
  );
};
