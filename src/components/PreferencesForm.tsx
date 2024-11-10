import React from 'react';
import {
  Calendar,
  Hotel,
  Utensils,
  Car,
  Users,
  Globe,
  Sun,
  Accessibility,
  Heart,
  Coffee,
  Music,
  Camera,
  Map,
  Mountain,
  Waves,
  ShoppingBag,
  UtensilsCrossed,
  TreePine,
  Bike,
  Moon,
  Clock,
  GlassWater,
  Language,
  Activity,
  Plane,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type {
  TripPreferences,
  ActivityLevel,
  TravelStyle,
  WeatherPreference,
  PacePreference,
  CulturalImmersion,
  FitnessLevel,
  GuidePreference,
} from '../types';

interface Props {
  onSubmit: (preferences: TripPreferences) => void;
}

const LUXURY_PRESETS = {
  interests: ['fine_dining', 'spa_wellness', 'private_tours'],
  accommodation: ['luxury_hotel', 'boutique_resort', 'villa'],
  dining: ['fine_dining', 'michelin_star', 'wine_tasting'],
  transportation: ['private_car', 'luxury_transfer', 'helicopter'],
  shoppingPreferences: ['designer_boutiques', 'art_galleries', 'luxury_brands'],
  specialInterests: ['wine', 'photography', 'culinary'],
};

const BACKPACKING_PRESETS = {
  interests: ['local_culture', 'outdoor_activities', 'budget_friendly'],
  accommodation: ['hostel', 'guesthouse', 'camping'],
  dining: ['street_food', 'local_markets', 'budget_eats'],
  transportation: ['public_transport', 'walking', 'bike_rental'],
  shoppingPreferences: ['local_markets', 'vintage_shops', 'street_markets'],
  specialInterests: ['hiking', 'photography', 'local_culture'],
};

export function PreferencesForm({ onSubmit }: Props) {
  const { mode, colors } = useTheme();
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [dateError, setDateError] = React.useState('');

  // Initialize preferences based on mode
  const [preferences, setPreferences] = React.useState<TripPreferences>(() => ({
    interests:
      mode === 'luxury'
        ? LUXURY_PRESETS.interests
        : BACKPACKING_PRESETS.interests,
    budget: mode === 'luxury' ? 'luxury' : 'budget',
    activityLevel: 'moderate',
    dateRange: {
      start: new Date(),
      end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    accommodation:
      mode === 'luxury'
        ? LUXURY_PRESETS.accommodation
        : BACKPACKING_PRESETS.accommodation,
    dining:
      mode === 'luxury' ? LUXURY_PRESETS.dining : BACKPACKING_PRESETS.dining,
    transportation:
      mode === 'luxury'
        ? LUXURY_PRESETS.transportation
        : BACKPACKING_PRESETS.transportation,
    travelStyle: 'solo',
    groupSize: 1,
    language: ['en'],
    accessibility: [],
    weatherPreference: 'any',
    specialInterests:
      mode === 'luxury'
        ? LUXURY_PRESETS.specialInterests
        : BACKPACKING_PRESETS.specialInterests,
    timeOfDay: ['morning', 'afternoon', 'evening'],
    pacePreference: 'balanced',
    photoOpportunities: true,
    culturalImmersion: 'moderate',
    shoppingPreferences:
      mode === 'luxury'
        ? LUXURY_PRESETS.shoppingPreferences
        : BACKPACKING_PRESETS.shoppingPreferences,
    nightlifePreferences: [],
    fitnessLevel: 'moderate',
    restDays: true,
    guidePreference: mode === 'luxury' ? 'private' : 'self_guided',
    dietaryRestrictions: [],
  }));

  const validateForm = React.useCallback(() => {
    const requiredFields = [
      preferences.interests.length > 0,
      preferences.budget.length > 0,
      preferences.dateRange.start instanceof Date,
      preferences.dateRange.end instanceof Date,
      preferences.accommodation.length > 0,
      preferences.dining.length > 0,
      preferences.transportation.length > 0,
      preferences.groupSize > 0,
      preferences.language.length > 0,
    ];

    setIsFormValid(requiredFields.every(Boolean));
  }, [preferences]);

  React.useEffect(() => {
    validateForm();
  }, [preferences, validateForm]);

  const updatePreference = <K extends keyof TripPreferences>(
    key: K,
    value: TripPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(preferences);
    }
  };

  const specialInterests = [
    { icon: Coffee, label: 'Coffee Culture', value: 'coffee' },
    { icon: Music, label: 'Live Music', value: 'music' },
    { icon: Camera, label: 'Photography', value: 'photography' },
    { icon: UtensilsCrossed, label: 'Culinary', value: 'culinary' },
    { icon: GlassWater, label: 'Wine & Spirits', value: 'wine' },
    { icon: Mountain, label: 'Mountains', value: 'mountains' },
    { icon: Waves, label: 'Water Activities', value: 'water' },
    { icon: ShoppingBag, label: 'Shopping', value: 'shopping' },
    { icon: TreePine, label: 'Nature', value: 'nature' },
    { icon: Map, label: 'Adventure', value: 'adventure' },
    { icon: Bike, label: 'Cycling', value: 'cycling' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Date Range */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>Travel Dates</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={preferences.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => {
                const newStartDate = new Date(e.target.value);
                let newEndDate = preferences.dateRange.end;

                if (newEndDate < newStartDate) {
                  newEndDate = newStartDate;
                }

                const diffTime =
                  newEndDate.getTime() - newStartDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays > 3) {
                  setDateError('Team is working on that updates');
                  newEndDate = new Date(
                    newStartDate.getTime() + 3 * 24 * 60 * 60 * 1000
                  );
                } else {
                  setDateError('');
                }

                updatePreference('dateRange', {
                  start: newStartDate,
                  end: newEndDate,
                });
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={preferences.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => {
                const newEndDate = new Date(e.target.value);
                const diffTime =
                  newEndDate.getTime() -
                  preferences.dateRange.start.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays > 3) {
                  setDateError('Team is working on that updates');
                  const correctedEndDate = new Date(
                    preferences.dateRange.start.getTime() +
                      3 * 24 * 60 * 60 * 1000
                  );
                  updatePreference('dateRange', {
                    ...preferences.dateRange,
                    end: correctedEndDate,
                  });
                } else {
                  setDateError('');
                  updatePreference('dateRange', {
                    ...preferences.dateRange,
                    end: newEndDate,
                  });
                }
              }}
              min={preferences.dateRange.start
                .toISOString()
                .split('T')[0]}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
              required
            />
          </div>
        </div>
        {dateError && (
          <p className="text-red-400 text-sm mt-2">{dateError}</p>
        )}
      </div>

      {/* Budget Preference */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${colors.primary}`}>
            Budget Preference
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'budget', label: 'Budget' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'luxury', label: 'Luxury' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updatePreference('budget', value)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.budget === value
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Travel Style */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>Travel Style</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { value: 'solo', label: 'Solo', icon: Users },
            { value: 'couple', label: 'Couple', icon: Heart },
            { value: 'family', label: 'Family', icon: Users },
            { value: 'friends', label: 'Friends', icon: Users },
            { value: 'business', label: 'Business', icon: Plane },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                updatePreference('travelStyle', value as TravelStyle)
              }
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.travelStyle === value
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Group Size */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>Group Size</h3>
        </div>
        <input
          type="number"
          min="1"
          max="20"
          value={preferences.groupSize}
          onChange={(e) =>
            updatePreference('groupSize', parseInt(e.target.value))
          }
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100"
          required
        />
      </div>

      {/* Special Interests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>
            Special Interests
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {specialInterests.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                const newInterests = preferences.specialInterests.includes(
                  value
                )
                  ? preferences.specialInterests.filter((i) => i !== value)
                  : [...preferences.specialInterests, value];
                updatePreference('specialInterests', newInterests);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                preferences.specialInterests.includes(value)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Level & Pace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className={colors.primary} size={20} />
            <h3 className={`font-medium ${colors.primary}`}>
              Activity Level
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'relaxed', label: 'Relaxed' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'active', label: 'Active' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  updatePreference('activityLevel', value as ActivityLevel)
                }
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  preferences.activityLevel === value
                    ? mode === 'luxury'
                      ? 'bg-gold text-black border-gold'
                      : 'bg-adventure-500 text-black border-adventure-500'
                    : 'border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className={colors.primary} size={20} />
            <h3 className={`font-medium ${colors.primary}`}>
              Travel Pace
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'relaxed', label: 'Relaxed' },
              { value: 'balanced', label: 'Balanced' },
              { value: 'intensive', label: 'Intensive' },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  updatePreference('pacePreference', value as PacePreference)
                }
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  preferences.pacePreference === value
                    ? mode === 'luxury'
                      ? 'bg-gold text-black border-gold'
                      : 'bg-adventure-500 text-black border-adventure-500'
                    : 'border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time of Day Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>
            Preferred Times
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'morning', label: 'Morning', icon: Sun },
            { value: 'afternoon', label: 'Afternoon', icon: Sun },
            { value: 'evening', label: 'Evening', icon: Moon },
            { value: 'night', label: 'Night', icon: Moon },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                const newTimes = preferences.timeOfDay.includes(value)
                  ? preferences.timeOfDay.filter((t) => t !== value)
                  : [...preferences.timeOfDay, value];
                updatePreference('timeOfDay', newTimes);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.timeOfDay.includes(value)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accommodation Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Hotel className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>
            Accommodation
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(mode === 'luxury'
            ? [
                { value: 'luxury_hotel', label: 'Luxury Hotels' },
                { value: 'boutique_resort', label: 'Boutique Resorts' },
                { value: 'villa', label: 'Private Villas' },
                { value: 'spa_resort', label: 'Spa Resorts' },
                { value: 'historic_hotel', label: 'Historic Hotels' },
              ]
            : [
                { value: 'hostel', label: 'Hostels' },
                { value: 'guesthouse', label: 'Guesthouses' },
                { value: 'camping', label: 'Camping' },
                { value: 'budget_hotel', label: 'Budget Hotels' },
                { value: 'homestay', label: 'Homestays' },
              ]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                const newAccommodation = preferences.accommodation.includes(
                  value
                )
                  ? preferences.accommodation.filter((a) => a !== value)
                  : [...preferences.accommodation, value];
                updatePreference('accommodation', newAccommodation);
              }}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.accommodation.includes(value)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dining Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Utensils className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>Dining</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(mode === 'luxury'
            ? [
                { value: 'fine_dining', label: 'Fine Dining' },
                { value: 'michelin_star', label: 'Michelin Star' },
                { value: 'wine_tasting', label: 'Wine Tasting' },
                { value: 'private_chef', label: 'Private Chef' },
                { value: 'gourmet_local', label: 'Gourmet Local' },
              ]
            : [
                { value: 'street_food', label: 'Street Food' },
                { value: 'local_markets', label: 'Local Markets' },
                { value: 'budget_eats', label: 'Budget Eats' },
                { value: 'food_trucks', label: 'Food Trucks' },
                { value: 'local_cafes', label: 'Local Cafes' },
              ]
          ).map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                const newDining = preferences.dining.includes(value)
                  ? preferences.dining.filter((d) => d !== value)
                  : [...preferences.dining, value];
                updatePreference('dining', newDining);
              }}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.dining.includes(value)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-4">
        <h3 className={`font-medium ${colors.primary}`}>
          Dietary Requirements
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'vegetarian',
            'vegan',
            'gluten-free',
            'halal',
            'kosher',
            'dairy-free',
            'nut-free',
            'none',
          ].map((diet) => (
            <button
              key={diet}
              type="button"
              onClick={() => {
                if (diet === 'none') {
                  updatePreference('dietaryRestrictions', []);
                } else {
                  const newDiet = preferences.dietaryRestrictions.includes(
                    diet
                  )
                    ? preferences.dietaryRestrictions.filter((d) => d !== diet)
                    : [...preferences.dietaryRestrictions, diet];
                  updatePreference('dietaryRestrictions', newDiet);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.dietaryRestrictions.includes(diet) ||
                (diet === 'none' &&
                  preferences.dietaryRestrictions.length === 0)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {diet.charAt(0).toUpperCase() + diet.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Language Preferences */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Accessibility className={colors.primary} size={20} />
          <h3 className={`font-medium ${colors.primary}`}>Languages</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'it', name: 'Italian' },
            { code: 'ja', name: 'Japanese' },
            { code: 'zh', name: 'Chinese' },
            { code: 'ar', name: 'Arabic' },
          ].map(({ code, name }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                const newLanguages = preferences.language.includes(code)
                  ? preferences.language.filter((l) => l !== code)
                  : [...preferences.language, code];
                updatePreference('language', newLanguages);
              }}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                preferences.language.includes(code)
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Preferences */}
      <div className="space-y-4">
        <h3 className={`font-medium ${colors.primary}`}>
          Additional Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Photography */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.photoOpportunities}
              onChange={(e) =>
                updatePreference('photoOpportunities', e.target.checked)
              }
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-gold focus:ring-gold"
            />
            <span className="text-gray-300">Include photo opportunities</span>
          </label>

          {/* Rest Days */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.restDays}
              onChange={(e) => updatePreference('restDays', e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-gold focus:ring-gold"
            />
            <span className="text-gray-300">Include rest days</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`
            w-full py-3 rounded-lg font-medium transition-colors
            flex items-center justify-center gap-2
            ${
              isFormValid
                ? mode === 'luxury'
                  ? 'bg-gradient-luxury hover:bg-gold text-black'
                  : 'bg-gradient-adventure hover:bg-adventure-400 text-black'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Create My Itinerary
          <ArrowRight size={20} />
        </button>
        {!isFormValid && (
          <p className="text-red-400 text-sm mt-2 text-center">
            Please fill in all required fields to continue
          </p>
        )}
      </div>
    </form>
  );
}
