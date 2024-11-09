// ActivityCard.tsx
import React from 'react';
import { Clock, MapPin, DollarSign, Camera, Cloud } from 'lucide-react';

interface ActivityProps {
  activity: {
    name: string;
    description: string;
    duration: string;
    startTime: string;
    location: {
      name: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    cost: number;
    bookingUrl: string | null;
    photoSpot: boolean;
    weatherDependent: boolean;
    intensity: string;
  };
  formatLocalPrice: (price: number) => string;
  colors: { primary: string; secondary: string };
}

const ActivityCard = ({
  activity,
  formatLocalPrice,
  colors,
}: ActivityProps) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h4 className={`font-medium text-gray-200 text-lg mb-2`}>
        {activity.name}
      </h4>
      <p className="text-gray-400 text-sm mb-4">{activity.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Clock size={16} />
          <span>
            {activity.startTime} ({activity.duration})
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin size={16} />
          <span>{activity.location.name}</span>
        </div>
        {activity.cost > 0 && (
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign size={16} />
            <span>{formatLocalPrice(activity.cost)}</span>
          </div>
        )}
        {activity.photoSpot && (
          <div className="flex items-center gap-2 text-gray-300">
            <Camera size={16} />
            <span>Photo Opportunity</span>
          </div>
        )}
        {activity.weatherDependent && (
          <div className="flex items-center gap-2 text-gray-300">
            <Cloud size={16} />
            <span>Weather Dependent</span>
          </div>
        )}
      </div>

      {activity.bookingUrl && (
        <a
          href={activity.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center text-sm mt-4 ${colors.primary} hover:${colors.secondary} transition-colors`}
        >
          Book Now →
        </a>
      )}
    </div>
  );
};
