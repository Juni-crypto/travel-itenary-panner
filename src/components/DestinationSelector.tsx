import React from 'react';
import { Search, MapPin } from 'lucide-react';
import type { Destination } from '../types';

interface LocationSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface Props {
  onSelect: (destination: Destination) => void;
}

// Changed to named export
export function DestinationSelector({ onSelect }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<LocationSuggestion[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchTimeout = React.useRef<number>();

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=pk.14f354433f3cbf27f89ab1227df9e411&q=${encodeURIComponent(
          query
        )}&limit=5&dedupe=1&tag=place:city,place:town,boundary:administrative`
      );

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data: LocationSuggestion[] = await response.json();
      const cityResults = data
        .filter(
          (item) =>
            (item.type.includes('city') ||
              item.type.includes('town') ||
              item.type.includes('administrative')) &&
            item.address &&
            (item.address.city || item.address.state)
        )
        .map((item) => ({
          ...item,
          display_name: formatLocationName(item),
        }));

      setSuggestions(cityResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const formatLocationName = (location: LocationSuggestion): string => {
    const parts = [];
    if (location.address.city) {
      parts.push(location.address.city);
    } else if (location.address.name) {
      parts.push(location.address.name);
    }
    if (location.address.state) parts.push(location.address.state);
    if (location.address.country) parts.push(location.address.country);
    return parts.join(', ');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const city =
      suggestion.address.city ||
      suggestion.address.name ||
      suggestion.address.state ||
      '';
    const country = suggestion.address.country || 'Unknown';

    const destination: Destination = {
      id: suggestion.place_id,
      name: city,
      country: country,
      coordinates: {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      },
      imageUrl:
        'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000',
    };

    setSearchQuery(city);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(destination);
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search destinations..."
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />

        {showSuggestions && suggestions.length > 0 && (
          <div className="location-dropdown">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-2 transition-colors"
              >
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span className="text-gray-300">{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
