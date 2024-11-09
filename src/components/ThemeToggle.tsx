import React from 'react';
import { Diamond, Compass } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleMode, colors } = useTheme();

  return (
    <div className="relative">
      <div
        onClick={toggleMode}
        className="inline-flex items-center bg-gray-800/50 rounded-full p-1 cursor-pointer border border-gray-700 hover:border-gray-600 transition-all"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMode();
          }
        }}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            mode === 'luxury'
              ? 'bg-gold text-black'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Diamond size={18} />
          <span className="text-sm font-medium">Luxury</span>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            mode === 'backpacking'
              ? 'bg-adventure-500 text-black'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Compass size={18} />
          <span className="text-sm font-medium">Backpacking</span>
        </div>
      </div>

      {/* Animated Background Indicator */}
      <div
        className={`
        absolute inset-0 -z-10 rounded-full blur-xl opacity-20 transition-all duration-500
        ${mode === 'luxury' ? 'bg-gold' : 'bg-adventure-500'}
      `}
      />

      {/* Theme Description */}
      <div className="absolute left-0 right-0 mt-2 text-center">
        <p className="text-xs text-gray-500">{mode === 'luxury' ? '' : ''}</p>
      </div>
    </div>
  );
}
