import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { brandColors, statusColors } from '@psp/shared';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  stepNumber: (active: boolean, completed: boolean) => ({
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    background: completed ? statusColors.success : active ? brandColors.primary : '#e2e8f0',
    color: completed || active ? 'white' : '#64748b',
    transition: 'all 200ms ease',
  }),
  stepLabel: (active: boolean) => ({
    fontSize: 12,
    color: active ? '#0f172a' : '#64748b',
    fontWeight: 500,
    display: 'none',
  }),
  connector: (completed: boolean) => ({
    width: 40,
    height: 2,
    background: completed ? statusColors.success : '#e2e8f0',
    transition: 'background-color 200ms ease',
  }),
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <>
      <style>{`
        @media (min-width: 480px) {
          .step-label { display: block !important; }
        }
      `}</style>
      <div style={styles.container}>
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <React.Fragment key={step.label}>
              <div style={styles.step}>
                <div style={styles.stepNumber(isActive, isCompleted)}>
                  {isCompleted ? <CheckOutlined /> : stepNum}
                </div>
                <span className="step-label" style={styles.stepLabel(isActive)}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div style={styles.connector(isCompleted)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};
