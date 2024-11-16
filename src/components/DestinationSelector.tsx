import React from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import type { Destination, TravelRoute } from '../types';

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
  onSelect: (route: TravelRoute) => void;
}

export function DestinationSelector({ onSelect }: Props) {
  const [showFromPlace, setShowFromPlace] = React.useState(false);
  const [fromSearchQuery, setFromSearchQuery] = React.useState('');
  const [toSearchQuery, setToSearchQuery] = React.useState('');
  const [fromSuggestions, setFromSuggestions] = React.useState<LocationSuggestion[]>([]);
  const [toSuggestions, setToSuggestions] = React.useState<LocationSuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = React.useState(false);
  const [showToSuggestions, setShowToSuggestions] = React.useState(false);
  const [selectedFromPlace, setSelectedFromPlace] = React.useState<Destination | null>(null);
  const [selectedToPlace, setSelectedToPlace] = React.useState<Destination | null>(null);
  const fromSearchTimeout = React.useRef<number>();
  const toSearchTimeout = React.useRef<number>();

  React.useEffect(() => {
    if (selectedToPlace) {
      onSelect({
        from: selectedFromPlace,
        to: selectedToPlace
      });
    }
  }, [selectedFromPlace, selectedToPlace, onSelect]);

  const fetchSuggestions = async (query: string, isFrom: boolean) => {
    if (!query) {
      isFrom ? setFromSuggestions([]) : setToSuggestions([]);
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

      // Filter out the selected "From" place from "To" suggestions
      if (!isFrom && selectedFromPlace) {
        const filteredResults = cityResults.filter(
          (item) => item.place_id !== selectedFromPlace.id
        );
        setToSuggestions(filteredResults);
      } else {
        isFrom ? setFromSuggestions(cityResults) : setToSuggestions(cityResults);
      }

      isFrom ? setShowFromSuggestions(true) : setShowToSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      isFrom ? setFromSuggestions([]) : setToSuggestions([]);
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

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFrom: boolean
  ) => {
    const query = e.target.value;
    isFrom ? setFromSearchQuery(query) : setToSearchQuery(query);

    if (isFrom && fromSearchTimeout.current) {
      window.clearTimeout(fromSearchTimeout.current);
    } else if (!isFrom && toSearchTimeout.current) {
      window.clearTimeout(toSearchTimeout.current);
    }

    const timeoutRef = window.setTimeout(() => {
      fetchSuggestions(query, isFrom);
    }, 300);

    if (isFrom) {
      fromSearchTimeout.current = timeoutRef;
    } else {
      toSearchTimeout.current = timeoutRef;
    }
  };

  const createDestination = (suggestion: LocationSuggestion): Destination => {
    const city =
      suggestion.address.city ||
      suggestion.address.name ||
      suggestion.address.state ||
      '';
    const country = suggestion.address.country || 'Unknown';

    return {
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
  };

  const handleSuggestionSelect = (suggestion: LocationSuggestion, isFrom: boolean) => {
    const destination = createDestination(suggestion);

    if (isFrom) {
      setFromSearchQuery(destination.name);
      setSelectedFromPlace(destination);
      setFromSuggestions([]);
      setShowFromSuggestions(false);
      
      // Clear "To" selection if it matches the new "From" selection
      if (selectedToPlace && destination.id === selectedToPlace.id) {
        setToSearchQuery('');
        setSelectedToPlace(null);
      }
    } else {
      setToSearchQuery(destination.name);
      setSelectedToPlace(destination);
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const handleFromToggle = () => {
    const newShowFromPlace = !showFromPlace;
    setShowFromPlace(newShowFromPlace);
    if (!newShowFromPlace) {
      setFromSearchQuery('');
      setSelectedFromPlace(null);
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Toggle switch for "Add From Place" */}
      <div className="flex items-center justify-end gap-2">
        <label className="text-gray-400 text-sm">Add From Place</label>
        <button
          onClick={handleFromToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showFromPlace ? 'bg-gold' : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showFromPlace ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* From Place Search */}
      {showFromPlace && (
        <div className="relative">
          <input
            type="text"
            value={fromSearchQuery}
            onChange={(e) => handleSearchChange(e, true)}
            placeholder="From where?"
            className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          />
          <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />

          {showFromSuggestions && fromSuggestions.length > 0 && (
            <div className="location-dropdown">
              {fromSuggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionSelect(suggestion, true)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-2 transition-colors"
                >
                  <MapPin size={16} className="text-gold flex-shrink-0" />
                  <span className="text-gray-300">{suggestion.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* To Place Search */}
      <div className="relative">
        <input
          type="text"
          value={toSearchQuery}
          onChange={(e) => handleSearchChange(e, false)}
          placeholder={showFromPlace ? "Where to?" : "Search destinations..."}
          className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />

        {showToSuggestions && toSuggestions.length > 0 && (
          <div className="location-dropdown">
            {toSuggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionSelect(suggestion, false)}
                className="w-full px-4 py-3 text-left hover:bg-gray-800 flex items-center gap-2 transition-colors"
              >
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <span className="text-gray-300">{suggestion.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual separator when both inputs are shown */}
      {showFromPlace && selectedFromPlace && toSearchQuery && (
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-full bg-gray-700" />
          <ArrowRight className="text-gray-500" size={20} />
          <div className="h-px w-full bg-gray-700" />
        </div>
      )}
    </div>
  );
}