import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

const styles = {
  container: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
  },
  input: (hasValue: boolean, error: boolean) => ({
    width: 44,
    height: 52,
    border: `1.5px solid ${error ? '#ef4444' : hasValue ? '#6366f1' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: 600,
    textAlign: 'center' as const,
    fontFamily: "'JetBrains Mono', monospace",
    outline: 'none',
    transition: 'all 200ms ease',
    background: error ? '#fef2f2' : hasValue ? '#eef2ff' : '#ffffff',
    caretColor: '#6366f1',
  }),
};

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Split value into array
  const valueArray = value.split('').slice(0, length);
  while (valueArray.length < length) {
    valueArray.push('');
  }

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  // Shake animation on error
  useEffect(() => {
    if (error && containerRef.current) {
      containerRef.current.classList.add('shake');
      setTimeout(() => {
        containerRef.current?.classList.remove('shake');
      }, 500);
    }
  }, [error]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length && inputsRef.current[index]) {
      inputsRef.current[index]?.focus();
      inputsRef.current[index]?.select();
    }
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/[^0-9]/g, '').slice(-1);
    const newValue = valueArray.slice();
    newValue[index] = char;
    const newOtp = newValue.join('');
    onChange(newOtp);

    if (char && index < length - 1) {
      focusInput(index + 1);
    }

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!valueArray[index] && index > 0) {
        focusInput(index - 1);
        const newValue = valueArray.slice();
        newValue[index - 1] = '';
        onChange(newValue.join(''));
        e.preventDefault();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const newValue = valueArray.slice();
    pasted.split('').forEach((char, i) => {
      if (index + i < length) {
        newValue[index + i] = char;
      }
    });

    const newOtp = newValue.join('');
    onChange(newOtp);

    const focusIdx = Math.min(index + pasted.length, length - 1);
    focusInput(focusIdx);

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-4px); }
          30%, 70% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
        .otp-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
        }
      `}</style>
      <div ref={containerRef} style={styles.container}>
        {valueArray.map((char, index) => (
          <input
            key={index}
            ref={setInputRef(index)}
            className="otp-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            onFocus={(e) => e.target.select()}
            disabled={disabled}
            style={styles.input(!!char, error)}
            aria-label={`验证码第${index + 1}位`}
          />
        ))}
      </div>
    </>
  );
};
