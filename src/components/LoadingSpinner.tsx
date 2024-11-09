import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message }: Props) {
  const { mode } = useTheme();
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-800 rounded-full animate-spin ${
          mode === 'luxury' ? 'border-t-gold' : 'border-t-adventure-500'
        }`}
      />
      {message && (
        <p className="mt-4 text-gray-400">{message}</p>
      )}
    </div>
  );
}