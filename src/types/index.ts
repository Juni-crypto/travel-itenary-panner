// types/index.ts

export type ThemeMode = 'luxury' | 'backpacking';

export interface Destination {
  id: string;
  name: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  description?: string;
  climate?: string;
  bestTimeToVisit?: string;
  timezone?: string;
}

export interface TravelRoute {
  from: Destination | null;
  to: Destination;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type ActivityLevel = 'relaxed' | 'moderate' | 'active';
export type Budget = 'budget' | 'moderate' | 'luxury' | 'ultra-luxury';
export type TravelStyle = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type WeatherPreference = 'warm' | 'mild' | 'cold' | 'any';
export type PacePreference = 'relaxed' | 'balanced' | 'intensive';
export type CulturalImmersion = 'light' | 'moderate' | 'deep';
export type FitnessLevel = 'light' | 'moderate' | 'active' | 'challenging';
export type GuidePreference = 'private' | 'group' | 'self_guided' | 'mixed';

export interface TripPreferences {
  interests: string[];
  budget: Budget;
  budgetPerDay: number;
  activityLevel: ActivityLevel;
  dateRange: DateRange;
  travelStyle: TravelStyle;
  groupSize: number;
  accommodation: string[];
  transportation: string[];
  dining: string[];
  dietaryRestrictions: string[];
  specialInterests: string[];
  culturalImmersion: CulturalImmersion;
  photoOpportunities: boolean;
  nightlifePreferences: string[];
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[];
  pacePreference: PacePreference;
  restDays: boolean;
  fitnessLevel: FitnessLevel;
  accessibility: string[];
  guidePreference: GuidePreference;
  language: string[];
  weatherPreference: WeatherPreference;
  shoppingPreferences: string[];
  route?: TravelRoute; // Optional route information for from/to places
}

export interface AccommodationOption {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
  amenities: string[];
  bookingUrl: string;
  imageUrl: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface TransportService {
  name: string;
  description: string;
  bookingUrl: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface TransportCost {
  type: string;
  amount: number;
  notes: string;
}

export interface TransportInfo {
  taxiServices: TransportService[];
  averageCosts: TransportCost[];
  publicTransport: {
    available: boolean;
    options: string[];
    dayPassCost: number;
  };
  allModes: {
    type: string;
    details: string;
  }[];
  bikeRentalOptions: {
    providerName: string;
    rentalRate: number;
    bookingUrl: string;
  }[];
}


export interface Meal {
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
}

export interface Activity {
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
  intensity: 'low' | 'moderate' | 'high';
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  transportation: string[];
  photoSpots: string[];
  timeOfDay: string;
  notes: string[];
}

export interface LocalCurrency {
  code: string;
  symbol: string;
  exchangeRate: number;
}

export interface RecommendedDuration {
  minimum: number;
  maximum: number;
  optimal: number;
  note: string;
  factors: string[];
}

export interface SeasonalInfo {
  weather: string;
  bestTimeToVisit: string;
  peakTouristSeason: string;
}

export interface CostBreakdown {
  totalEstimatedCost: number;
  categories: {
    accommodation: number;
    transportation: number;
    activities: number;
    meals: number;
  };
}

export interface EssentialInfo {
  visaRequirements: string;
  vaccinations: string[];
  emergencyContacts: {
    police: string;
    ambulance: string;
    tourOperator: string;
  };
  timeZone: string;
  languages: string[];
}

interface TransportationRoute {
  type: string;
  provider: string;
  schedule: string;
  duration: string;
  cost: number;
  bookingUrl: string;
  notes: string[];
}

interface TransportationHub {
  name: string;
  type: string;
  location: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  transportOptions: string[];
  facilities: string[];
  distance: number;
}

interface TransportationDetails {
  routes: TransportationRoute[];
  hubs: TransportationHub[];
}


export interface Itinerary {
  destination: Destination;
  route?: TravelRoute; // Optional route information for from/to places
  duration: number;
  preferences: TripPreferences;
  mode: ThemeMode;
  recommendedDuration: RecommendedDuration;
  localCurrency: LocalCurrency;
  accommodationOptions: AccommodationOption[];
  transportInfo: TransportInfo;
  days: ItineraryDay[];
  transportationDetails?: TransportationDetails; // New field for route-specific transport info
  essentialInfo: EssentialInfo;
  seasonalInfo: SeasonalInfo;
  costBreakdown: CostBreakdown;
}

// Form State Types
export interface FormErrors {
  [key: string]: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: FormErrors;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ItineraryResponse = APIResponse<Itinerary>;