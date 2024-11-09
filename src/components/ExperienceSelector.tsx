import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { TripPreferences } from '../types';

interface Props {
  preferences: TripPreferences;
  onChange: (interests: string[]) => void;
}

const LUXURY_EXPERIENCES = {
  dining: [
    { id: 'fine_dining', label: 'Fine Dining' },
    { id: 'michelin_star', label: 'Michelin Star Restaurants' },
    { id: 'wine_tasting', label: 'Wine Tasting' },
    { id: 'private_chef', label: 'Private Chef' },
  ],
  activities: [
    { id: 'spa_wellness', label: 'Spa & Wellness' },
    { id: 'yacht_tour', label: 'Yacht Tours' },
    { id: 'helicopter_tour', label: 'Helicopter Tours' },
    { id: 'private_guide', label: 'Private Guide' },
  ],
  culture: [
    { id: 'private_museum', label: 'Private Museum Tours' },
    { id: 'art_galleries', label: 'VIP Art Galleries' },
    { id: 'cultural_events', label: 'Exclusive Events' },
    { id: 'theater_shows', label: 'Premium Theater' },
  ],
  shopping: [
    { id: 'luxury_shopping', label: 'Luxury Shopping' },
    { id: 'designer_boutiques', label: 'Designer Boutiques' },
    { id: 'personal_shopper', label: 'Personal Shopper' },
    { id: 'artisan_crafts', label: 'Local Artisans' },
  ],
};

const BACKPACKING_EXPERIENCES = {
  community: [
    { id: 'hostel_social', label: 'Hostel Social Events' },
    { id: 'local_meetups', label: 'Local Meetups' },
    { id: 'language_exchange', label: 'Language Exchange' },
    { id: 'volunteer_work', label: 'Volunteering' },
  ],
  culture: [
    { id: 'street_food', label: 'Street Food Tours' },
    { id: 'local_markets', label: 'Local Markets' },
    { id: 'cultural_classes', label: 'Cultural Classes' },
    { id: 'art_workshops', label: 'Art Workshops' },
  ],
  adventure: [
    { id: 'hiking', label: 'Hiking Trails' },
    { id: 'bike_tours', label: 'Bike Tours' },
    { id: 'camping', label: 'Camping' },
    { id: 'surfing', label: 'Surfing' },
  ],
  budget: [
    { id: 'free_walking', label: 'Free Walking Tours' },
    { id: 'public_transport', label: 'Public Transport' },
    { id: 'local_festivals', label: 'Local Festivals' },
    { id: 'park_visits', label: 'Park Visits' },
  ],
};

export function ExperienceSelector({ preferences, onChange }: Props) {
  const { mode, colors } = useTheme();
  const experiences =
    mode === 'luxury' ? LUXURY_EXPERIENCES : BACKPACKING_EXPERIENCES;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-3">
        {mode === 'luxury' ? (
          <Sparkles className={colors.primary} size={20} />
        ) : (
          <Compass className={colors.primary} size={20} />
        )}
        <h3 className={`font-medium ${colors.primary}`}>
          {mode === 'luxury' ? 'Luxury Experiences' : 'Travel Experiences'}
        </h3>
      </div>

      {Object.entries(experiences).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400 capitalize">
            {category.replace('_', ' ')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((experience) => (
              <button
                key={experience.id}
                onClick={() => {
                  const newInterests = preferences.interests.includes(
                    experience.id
                  )
                    ? preferences.interests.filter((i) => i !== experience.id)
                    : [...preferences.interests, experience.id];
                  onChange(newInterests);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  preferences.interests.includes(experience.id)
                    ? mode === 'luxury'
                      ? 'bg-gold text-black border-gold'
                      : 'bg-adventure-500 text-black border-adventure-500'
                    : 'border-gray-700 text-gray-300 hover:border-gold'
                }`}
              >
                {experience.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="text-sm text-gray-400 mt-4">
        {mode === 'luxury'
          ? 'Select experiences to customize your luxury journey'
          : 'Choose activities that match your backpacking style'}
      </div>
    </div>
  );
}
