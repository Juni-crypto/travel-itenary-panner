import React from 'react';
import { Wallet } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetSlider({ value, onChange }: Props) {
  const { mode, colors } = useTheme();

  const formatBudget = (val: number) => {
    if (mode === 'luxury') {
      if (val <= 300) return 'Premium';
      if (val <= 600) return 'Luxury';
      if (val <= 1000) return 'Ultra-Luxury';
      return 'VIP';
    } else {
      if (val <= 30) return 'Super Budget';
      if (val <= 50) return 'Comfortable';
      if (val <= 80) return 'Flashpacker';
      return 'Premium Backpacker';
    }
  };

  const getBudgetRange = (val: number) => {
    if (mode === 'luxury') {
      if (val <= 300) return '$200-300/day';
      if (val <= 600) return '$300-600/day';
      if (val <= 1000) return '$600-1000/day';
      return '$1000+/day';
    } else {
      if (val <= 30) return '$20-30/day';
      if (val <= 50) return '$30-50/day';
      if (val <= 80) return '$50-80/day';
      return '$80-100/day';
    }
  };

  const getMinMaxValues = () => {
    return mode === 'luxury'
      ? { min: 200, max: 1500, step: 100 }
      : { min: 20, max: 100, step: 10 };
  };

  const { min, max, step } = getMinMaxValues();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Wallet className={colors.primary} size={20} />
        <h3 className={`font-medium ${colors.primary}`}>Daily Budget</h3>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">
            {formatBudget(value)}
          </span>
          <span className="text-sm text-gray-400">{getBudgetRange(value)}</span>
        </div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${
            mode === 'luxury' ? 'accent-gold' : 'accent-adventure-500'
          }`}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{mode === 'luxury' ? 'Premium' : 'Budget'}</span>
          <span>{mode === 'luxury' ? 'VIP' : 'Premium'}</span>
        </div>

        {mode === 'backpacking' && (
          <p className="text-xs text-gray-400 mt-2">
            *Budget estimates include hostel accommodation, local food, and
            basic transportation
          </p>
        )}
      </div>
    </div>
  );
}
