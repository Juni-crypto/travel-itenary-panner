// DaySchedule.tsx
import React from 'react';
import { Activity } from 'lucide-react';

interface DayScheduleProps {
  day: any;
  formatLocalPrice: (price: number) => string;
  colors: { primary: string; secondary: string };
}

const DaySchedule = ({ day, formatLocalPrice, colors }: DayScheduleProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className={colors.primary} size={20} />
          <h3 className="text-lg font-medium text-gray-200">Activities</h3>
        </div>
        <div className="grid gap-4">
          {day.activities.map((activity: any, index: number) => (
            <ActivityCard
              key={index}
              activity={activity}
              formatLocalPrice={formatLocalPrice}
              colors={colors}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Utensils className={colors.primary} size={20} />
          <h3 className="text-lg font-medium text-gray-200">Meals</h3>
        </div>
        <div className="grid gap-4">
          {day.meals.map((meal: any, index: number) => (
            <MealCard
              key={index}
              meal={meal}
              formatLocalPrice={formatLocalPrice}
              colors={colors}
            />
          ))}
        </div>
      </div>

      {day.photoSpots.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-200">Photo Spots</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {day.photoSpots.map((spot: string, index: number) => (
              <li key={index}>{spot}</li>
            ))}
          </ul>
        </div>
      )}

      {day.notes.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-200">Notes</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {day.notes.map((note: string, index: number) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
