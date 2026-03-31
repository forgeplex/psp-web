import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  placeholder = 'Buscar...',
  value,
  defaultValue,
  onChange,
  onSearch,
  loading,
  className = '',
  size = 'md',
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const sizeClasses = {
    sm: 'h-8 text-xs px-3 pl-8',
    md: 'h-10 text-sm px-4 pl-10',
    lg: 'h-12 text-base px-4 pl-11',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3',
    lg: 'w-5 h-5 left-3.5',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onSearch?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(currentValue);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search 
        className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSizes[size]}`} 
      />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          w-full bg-white border border-gray-200 rounded-lg
          text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
          transition-all duration-200
          ${sizeClasses[size]}
        `}
      />
      {currentValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-indigo-500" />
        </div>
      )}
    </div>
  );
}
