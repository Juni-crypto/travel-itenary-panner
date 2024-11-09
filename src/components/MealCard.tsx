// MealCard.tsx
import React from 'react';
import { Clock, Utensils } from 'lucide-react';

interface MealProps {
  meal: {
    time: string;
    venue: string;
    description: string;
    bookingUrl: string | null;
    priceRange: {
      min: number;
      max: number;
      currency: string;
    };
    cuisine: string;
    dietaryOptions: string[];
  };
  formatLocalPrice: (price: number) => string;
  colors: { primary: string; secondary: string };
}

const MealCard = ({ meal, formatLocalPrice, colors }: MealProps) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-200">{meal.venue}</h4>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span>{meal.time}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-3">{meal.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300">
          {meal.cuisine}
        </span>
        {meal.dietaryOptions.map((option, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300"
          >
            {option}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          {formatLocalPrice(meal.priceRange.min)} -{' '}
          {formatLocalPrice(meal.priceRange.max)}
        </span>
        {meal.bookingUrl && (
          <a
            href={meal.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm ${colors.primary} hover:${colors.secondary} transition-colors`}
          >
            Reserve →
          </a>
        )}
      </div>
    </div>
  );
};
