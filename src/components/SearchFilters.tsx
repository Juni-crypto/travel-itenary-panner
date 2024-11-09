import React from 'react';
import { Calendar, Hotel, Utensils, Car, Users, Globe, Sun, Accessibility } from 'lucide-react';
import { ExperienceSelector } from './ExperienceSelector';
import { BudgetSlider } from './BudgetSlider';
import type { TripPreferences } from '../types';

interface Props {
  preferences: TripPreferences;
  onChange: (preferences: TripPreferences) => void;
}

export function SearchFilters({ preferences, onChange }: Props) {
  const updatePreference = <K extends keyof TripPreferences>(
    key: K,
    value: TripPreferences[K]
  ) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-gold" size={20} />
          <h3 className="font-medium text-gold">Date Range</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={preferences.dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => updatePreference('dateRange', {
              ...preferences.dateRange,
              start: new Date(e.target.value)
            })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <input
            type="date"
            value={preferences.dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => updatePreference('dateRange', {
              ...preferences.dateRange,
              end: new Date(e.target.value)
            })}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>
      </div>

      <BudgetSlider 
        value={preferences.budgetPerDay || 600}
        onChange={(value) => updatePreference('budgetPerDay', value)}
      />

      <ExperienceSelector 
        preferences={preferences}
        onChange={(interests) => updatePreference('interests', interests)}
      />

      {[
        {
          icon: <Hotel className="text-gold" size={20} />,
          title: 'Accommodation',
          options: ['hotel', 'hostel', 'vacation_rental'],
          key: 'accommodation'
        },
        {
          icon: <Utensils className="text-gold" size={20} />,
          title: 'Dining Preferences',
          options: ['local_cuisine', 'fine_dining', 'street_food'],
          key: 'dining'
        },
        {
          icon: <Car className="text-gold" size={20} />,
          title: 'Transportation',
          options: ['car_rental', 'public_transit', 'walking'],
          key: 'transportation'
        }
      ].map(section => (
        <div key={section.key}>
          <div className="flex items-center gap-2 mb-3">
            {section.icon}
            <h3 className="font-medium text-gold">{section.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {section.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  const current = preferences[section.key as keyof TripPreferences] as string[];
                  const newValues = current.includes(option)
                    ? current.filter(t => t !== option)
                    : [...current, option];
                  updatePreference(section.key as keyof TripPreferences, newValues as any);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  (preferences[section.key as keyof TripPreferences] as string[]).includes(option)
                    ? 'bg-gold text-black border-gold'
                    : 'border-gray-700 text-gray-300 hover:border-gold'
                }`}
              >
                {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-gold" size={20} />
          <h3 className="font-medium text-gold">Travel Style</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['solo', 'family', 'group', 'couple'].map((style) => (
            <button
              key={style}
              onClick={() => updatePreference('travelStyle', style as any)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                preferences.travelStyle === style
                  ? 'bg-gold text-black border-gold'
                  : 'border-gray-700 text-gray-300 hover:border-gold'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="text-gold" size={20} />
          <h3 className="font-medium text-gold">Language</h3>
        </div>
        <select
          multiple
          value={preferences.language}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            updatePreference('language', values);
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:border-gold focus:ring-2 focus:ring-gold/20"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
        </select>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sun className="text-gold" size={20} />
          <h3 className="font-medium text-gold">Weather Preference</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['warm', 'mild', 'cold', 'any'].map((weather) => (
            <button
              key={weather}
              onClick={() => updatePreference('weatherPreference', weather as any)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                preferences.weatherPreference === weather
                  ? 'bg-gold text-black border-gold'
                  : 'border-gray-700 text-gray-300 hover:border-gold'
              }`}
            >
              {weather.charAt(0).toUpperCase() + weather.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Accessibility className="text-gold" size={20} />
          <h3 className="font-medium text-gold">Accessibility</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['wheelchair', 'step_free', 'elevator', 'accessible_bathroom', 'none'].map((req) => (
            <button
              key={req}
              onClick={() => {
                if (req === 'none') {
                  updatePreference('accessibility', []);
                } else {
                  const newReqs = preferences.accessibility.includes(req as any)
                    ? preferences.accessibility.filter(r => r !== req)
                    : [...preferences.accessibility, req as any];
                  updatePreference('accessibility', newReqs);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                preferences.accessibility.includes(req as any) || (req === 'none' && preferences.accessibility.length === 0)
                  ? 'bg-gold text-black border-gold'
                  : 'border-gray-700 text-gray-300 hover:border-gold'
              }`}
            >
              {req.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}