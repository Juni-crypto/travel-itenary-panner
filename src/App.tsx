import React from 'react';
import { Plane, Compass } from 'lucide-react';
import { DestinationSelector } from './components/DestinationSelector';
import { PreferencesForm } from './components/PreferencesForm';
import { ItineraryView } from './components/ItineraryView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { generateItinerary } from './services/ai';
import type { Destination, TripPreferences, Itinerary } from './types';

function AppContent() {
  const { mode, colors } = useTheme();
  const [step, setStep] = React.useState(1);
  const [selectedDestination, setSelectedDestination] =
    React.useState<Destination | null>(null);
  const [itinerary, setItinerary] = React.useState<Itinerary | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDestinationSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setStep(2);
    setError(null);
  };

  const handlePreferencesSubmit = async (preferences: TripPreferences) => {
    if (!selectedDestination) return;

    setLoading(true);
    setError(null);

    try {
      const duration = Math.ceil(
        (preferences.dateRange.end.getTime() -
          preferences.dateRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const generatedItinerary = await generateItinerary(
        selectedDestination,
        preferences,
        duration,
        mode
      );
      setItinerary(generatedItinerary);
      setStep(3);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedDestination(null);
    setItinerary(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen ${colors.background} ${colors.text}`}>
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-3">
              {mode === 'luxury' ? (
                <Plane className={colors.primary} size={32} />
              ) : (
                <Compass className={colors.primary} size={32} />
              )}
              <h1 className={`text-4xl font-bold ${colors.primary}`}>
                {mode === 'luxury'
                  ? 'Luxury Travel Planner'
                  : 'Adventure Travel Planner'}
              </h1>
            </div>

            {step === 1 && <ThemeToggle />}

            <p className="text-gray-400 max-w-2xl mx-auto">
              {mode === 'luxury'
                ? 'Create your perfect luxury travel itinerary with our AI-powered planner. Select your destination, set your preferences, and let us craft your dream journey.'
                : 'Plan your next adventure with our backpacker-friendly travel planner. Find the best hostels, local experiences, and budget-friendly activities for an unforgettable journey.'}
            </p>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center">
          {error && (
            <div className="w-full max-w-4xl mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner
              size="large"
              message={
                mode === 'luxury'
                  ? 'Crafting your perfect luxury itinerary...'
                  : 'Planning your adventure...'
              }
            />
          ) : (
            <div className="w-full max-w-4xl">
              {step === 1 && (
                <div className="animate-fadeIn">
                  <h2
                    className={`text-2xl font-semibold text-center mb-8 ${colors.primary}`}
                  >
                    Where would you like to go?
                  </h2>
                  <DestinationSelector onSelect={handleDestinationSelect} />
                </div>
              )}

              {step === 2 && selectedDestination && (
                <div className="animate-fadeIn">
                  <h2
                    className={`text-2xl font-semibold text-center mb-8 ${colors.primary}`}
                  >
                    Customize your trip to {selectedDestination.name}
                  </h2>
                  <PreferencesForm onSubmit={handlePreferencesSubmit} />
                </div>
              )}

              {step === 3 && itinerary && (
                <ItineraryView itinerary={itinerary} onBack={handleBack} />
              )}
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-gray-500">
          <p>
            Made by{' '}
            <a
              href="https://chumaoruworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Chumaoru Works Creative Club
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
