import type {
  Destination,
  TripPreferences,
  Itinerary,
  ThemeMode,
  TravelRoute,
} from '../types';
import axios from 'axios';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  };
}

interface UnsplashResponse {
  results: Array<{
    urls: {
      regular: string;
    };
  }>;
}

interface RetryState {
  attempt: number;
  maxAttempts: number;
  lastError?: Error;
  validationFailed?: boolean;
  parseFailed?: boolean;
}

const API_KEY = '<GEMINI_API>';
const UNSPLASH_API_KEY = '<UNSPLASH-API>'; // Replace with actual key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent';
const MAX_DAYS = 4;
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const MAX_VALIDATION_RETRIES = 3;
const MAX_PARSE_RETRIES = 3;

async function fetchDestinationImage(destination: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        destination
      )}&client_id=${UNSPLASH_API_KEY}&orientation=landscape&per_page=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const data: UnsplashResponse = await response.json();
    return data.results[0]?.urls.regular || '/default-destination.jpg';
  } catch (error) {
    console.error('Error fetching image:', error);
    return '/default-destination.jpg';
  }
}

export async function fetchDestinationImages(destination: string): Promise<string[]> {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        query: destination,
        per_page: 15,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
      },
    });
    return response.data.results.map((photo: any) => photo.urls.regular);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function calculateBackoff(attempt: number, baseDelay: number = RETRY_DELAY): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 10000); // Cap at 10 seconds
}

function formatDetailedDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  return 'Winter';
}

function formatDates(dateRange: { start: Date; end: Date }): string {
  return `${dateRange.start.toLocaleDateString()} to ${dateRange.end.toLocaleDateString()}`;
}

function getRoutePrompt(route: TravelRoute): string {
  if (!route.from) return '';

  return `
    Transportation Between Cities:
    1. Consider transportation options from ${route.from.name} to ${route.to.name}
    2. Include the following details:
       - Available modes of transportation (air, rail, road, sea)
       - Approximate travel times for each mode
       - Cost ranges for each option
       - Major transportation hubs (airports, train stations, bus terminals)
       - Recommended routes and carriers
       - Seasonal considerations for travel between these cities
       - Local transportation options upon arrival
    3. For each transportation mode, provide:
       - Schedule frequency
       - Comfort level
       - Booking recommendations
       - Required documentation
    4. Include nearby stations and transportation hubs:
       - Major airports within 100km
       - Main train stations
       - Bus terminals
       - Port facilities if applicable
    5. Consider factors like:
       - Peak vs. off-peak pricing
       - Baggage restrictions
       - Transfer requirements
       - Visa/immigration considerations for transit
  `;
}
function getPromptByMode(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode
): string {
  const startDate = preferences.dateRange.start;
  const endDate = preferences.dateRange.end;
  const actualDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const budgetBarriers = () => {
    if (mode === 'luxury') {
      switch (preferences.budget) {
        case 'luxury': return 'Set a high budget barrier to include premium accommodations and exclusive activities.';
        case 'moderate': return 'Set a medium budget barrier to balance comfort with cost-effective options.';
        case 'budget': return 'Set a low budget barrier to prioritize essential experiences over luxury.';
        default: return '';
      }
    } else if (mode === 'backpacking') {
      switch (preferences.budget) {
        case 'luxury': return 'Set a high budget barrier to include quality accommodations while maintaining affordability.';
        case 'moderate': return 'Set a medium budget barrier to balance between cost and experience.';
        case 'budget': return 'Set a low budget barrier to maximize affordability with basic accommodations and activities.';
        default: return '';
      }
    }
    return '';
  };

  const routeInformation = preferences.route ? getRoutePrompt(preferences.route) : '';

  const transportationDetails = preferences.route?.from ? `
    "transportationDetails": {
      "routes": [
        {
          "type": string,
          "provider": string,
          "schedule": string,
          "duration": string,
          "cost": number,
          "bookingUrl": string,
          "notes": string[]
        }
      ],
      "hubs": [
        {
          "name": string,
          "type": string,
          "location": {
            "coordinates": {
              "lat": number,
              "lng": number
            }
          },
          "transportOptions": string[],
          "facilities": string[],
          "distance": number
        }
      ]
    },` : '';

  const systemPrompt = `You are a travel itinerary planning assistant. Your task is to create a detailed ${actualDuration}-day itinerary for ${destination.name}, ${destination.country} from ${formatDetailedDate(startDate)} to ${formatDetailedDate(endDate)} during ${getSeason(startDate)} season.
  ${budgetBarriers()}
  ${routeInformation}
  
  Please follow these strict guidelines:
  1. Provide output in valid JSON format only
  2. No markdown code blocks or decorators
  3. No comments or explanatory text
  4. Use double quotes for all strings
  5. Include all required fields
  6. Ensure all arrays have at least one item
  7. Use consistent date formats (ISO 8601)
  8. All numerical values should be actual numbers, not strings
  9. All URLs should be valid https:// URLs
  10. All coordinates should be valid numbers within range

  If a route is specified, include detailed transportation information in the response, including:
  - Schedule details for transportation options
  - Connection information at major hubs
  - Local transfer options at both origin and destination
  - Cost breakdown for each transportation mode`;

  const preferencesDescription = `
  Travel Parameters:
  - Style: ${preferences.travelStyle} travel for ${preferences.groupSize} person(s)
  - Budget Preference: ${preferences.budget}
  - Activity Level: ${preferences.activityLevel}
  - Interests: ${preferences.specialInterests.join(', ')}
  - Dietary: ${preferences.dietaryRestrictions.length > 0 ? preferences.dietaryRestrictions.join(', ') : 'None'}
  - Languages: ${preferences.language.join(', ')}
  - Preferred Times: ${preferences.timeOfDay.join(', ')}
  - Pace: ${preferences.pacePreference}
  - Cultural Immersion: ${preferences.culturalImmersion}
  - Fitness Level: ${preferences.fitnessLevel}
  ${preferences.photoOpportunities ? '- Include photo spots' : ''}
  ${preferences.restDays ? '- Include rest periods' : ''}
  - Guide Need: ${preferences.guidePreference}`;

  const additionalParams = `
  Key Preferences:
  - Accommodation: ${preferences.accommodation.join(', ')}
  - Dining: ${preferences.dining.join(', ')}
  - Transportation: ${preferences.transportation.join(', ')}
  - Weather: ${preferences.weatherPreference}
  - Shopping: ${preferences.shoppingPreferences.join(', ')}
  - Nightlife: ${preferences.nightlifePreferences.join(', ')}
  ${preferences.accessibility.length > 0 ? `- Accessibility: ${preferences.accessibility.join(', ')}` : ''}`;

  const experienceType = mode === 'luxury' ? 'premium and exclusive' : 'authentic and budget-friendly';

  const outputFormat = `
  Required JSON Structure:
  {
    ${transportationDetails}
    "recommendedDuration": {
      "minimum": number,
      "maximum": number,
      "optimal": number,
      "note": string,
      "factors": string[]
    },
    "localCurrency": {
      "code": string,
      "symbol": string,
      "exchangeRate": number
    },
    "accommodationOptions": [
      {
        "id": string,
        "name": string,
        "description": string,
        "pricePerNight": number,
        "amenities": string[],
        "bookingUrl": string,
        "imageUrl": string,
        "location": {
          "address": string,
          "coordinates": {
            "lat": number,
            "lng": number
          }
        }
      }
    ],
    "transportInfo": {
      "taxiServices": [
        {
          "name": string,
          "description": string,
          "bookingUrl": string,
          "priceRange": {
            "min": number,
            "max": number,
            "currency": string
          }
        }
      ],
      "averageCosts": [
        {
          "type": string,
          "amount": number,
          "notes": string
        }
      ],
      "publicTransport": {
        "available": boolean,
        "options": string[],
        "dayPassCost": number
      }
    },
    "days": [
      {
        "day": number,
        "date": string,
        "activities": [
          {
            "name": string,
            "description": string,
            "duration": string,
            "startTime": string,
            "location": {
              "name": string,
              "coordinates": {
                "lat": number,
                "lng": number
              }
            },
            "cost": number,
            "bookingUrl": string,
            "photoSpot": boolean,
            "weatherDependent": boolean,
            "intensity": string
          }
          // Repeat for at least 3-4 activities detailed ones
          // Mandatory 3 activities needed in a day and detailed ones
        ],
        "meals": [
          {
            "time": string,
            "venue": string,
            "description": string,
            "bookingUrl": string,
            "priceRange": {
              "min": number,
              "max": number,
              "currency": string
            },
            "cuisine": string,
            "dietaryOptions": string[]
          }
        ],
        "transportation": string[],
        "photoSpots": string[],
        "timeOfDay": string,
        "notes": string[]
      }
    ],
    "essentialInfo": {
      "healthAndSafety": string,
      "visaRequirements": string,
      "localEmergencyContacts": string
    },
    "seasonalInfo": {
      "weather": string,
      "bestTimeToVisit": string,
      "peakTouristSeason": string
    },
    "costBreakdown": {
      "totalEstimatedCost": number,
      "categories": {
        "accommodation": number,
        "transportation": number,
        "activities": number,
        "meals": number
      }
    },
    "dailyBudgetSpent": number,
    "activities": [
      {
        "name": string,
        "description": string,
        "duration": string,
        "startTime": string,
        "location": {
          "name": string,
          "coordinates": {
            "lat": number,
            "lng": number
          }
        },
        "cost": number,
        "bookingUrl": string,
        "photoSpot": boolean,
        "weatherDependent": boolean,
        "intensity": string
      },
      // Repeat for at least 3-4 activities
    ],
  }`;

  return `${systemPrompt}

  ${preferencesDescription}

  ${additionalParams}

  Please consider the following temporal factors:
  - Time of year: ${startDate.toLocaleString('en-US', { month: 'long' })}
  - Season: ${getSeason(startDate)}
  - Day of week start: ${startDate.toLocaleString('en-US', { weekday: 'long' })}
  - Day of week end: ${endDate.toLocaleString('en-US', { weekday: 'long' })}

  Travel Dates: ${formatDates(preferences.dateRange)}

  Key Requirements:
  1. Focus on ${experienceType} experiences
  2. Include specific venues and locations
  3. Provide transportation options
  4. Include photo opportunities
  5. Consider weather and seasonal factors
  6. Account for local customs
  7. Include meal recommendations
  8. Provide local currency pricing
  9. Must include at least 3 accommodation recommendations
  ${preferences.restDays ? '10. Balance activities with rest' : ''}
  ${preferences.photoOpportunities ? '11. Highlight photography spots' : ''}

  ${outputFormat}

  Respond with only the JSON data structure. No additional text, comments, or markdown.`;
}
async function validateResponse(data: any, route?: TravelRoute): Promise<boolean> {
  try {
    // Required fields check
    const requiredFields = [
      'recommendedDuration',
      'localCurrency',
      'accommodationOptions',
      'transportInfo',
      'days',
      'essentialInfo',
      'seasonalInfo',
      'costBreakdown',
      'dailyBudgetSpent',
    ];

    if (route?.from) {
      requiredFields.push('transportationDetails');
    }

    for (const field of requiredFields) {
      if (!(field in data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate transportation details if route exists
    if (route?.from && data.transportationDetails) {
      if (!Array.isArray(data.transportationDetails.routes) || 
          !Array.isArray(data.transportationDetails.hubs)) {
        console.error('Invalid transportation details structure');
        return false;
      }

      // Validate each route
      for (const route of data.transportationDetails.routes) {
        if (!route.type || !route.provider || !route.schedule || 
            typeof route.cost !== 'number' || !Array.isArray(route.notes)) {
          console.error('Invalid route structure:', route);
          return false;
        }
      }

      // Validate each hub
      for (const hub of data.transportationDetails.hubs) {
        if (!hub.name || !hub.type || !hub.location?.coordinates ||
            typeof hub.distance !== 'number' || !Array.isArray(hub.transportOptions) ||
            !Array.isArray(hub.facilities)) {
          console.error('Invalid hub structure:', hub);
          return false;
        }

        // Validate coordinates
        const coords = hub.location.coordinates;
        if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number' ||
            coords.lat < -90 || coords.lat > 90 || coords.lng < -180 || coords.lng > 180) {
          console.error('Invalid coordinates in hub:', hub.name);
          return false;
        }
      }
    }

    // Validate days array
    if (!Array.isArray(data.days) || data.days.length === 0) {
      console.error('Days array is empty or invalid');
      return false;
    }

    if (data.days.length > MAX_DAYS) {
      console.error(`Itinerary exceeds maximum allowed days (${MAX_DAYS})`);
      return false;
    }

    // Validate each day's structure
    for (const day of data.days) {
      if (!day.day || !day.date || !Array.isArray(day.activities)) {
        console.error('Invalid day structure:', day);
        return false;
      }

      // Validate activities
      for (const activity of day.activities) {
        if (!activity.name || !activity.duration || !activity.location ||
            typeof activity.cost !== 'number' || 
            typeof activity.photoSpot !== 'boolean' ||
            typeof activity.weatherDependent !== 'boolean') {
          console.error('Invalid activity structure:', activity);
          return false;
        }

        // Validate coordinates
        const coords = activity.location.coordinates;
        if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number' ||
            coords.lat < -90 || coords.lat > 90 || coords.lng < -180 || coords.lng > 180) {
          console.error('Invalid coordinates:', coords);
          return false;
        }

        // Validate time format
        const timeRegex = /^(?:[0-9]|[01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(activity.startTime)) {
          console.error('Invalid time format:', activity.startTime);
          return false;
        }
      }

      // Validate meals
      if (Array.isArray(day.meals)) {
        for (const meal of day.meals) {
          if (!meal.time || !meal.venue || !meal.priceRange ||
              typeof meal.priceRange.min !== 'number' ||
              typeof meal.priceRange.max !== 'number') {
            console.error('Invalid meal structure:', meal);
            return false;
          }
        }
      }
    }

    // Validate currency information
    if (!data.localCurrency?.code || !data.localCurrency?.symbol ||
        typeof data.localCurrency?.exchangeRate !== 'number') {
      console.error('Invalid currency information');
      return false;
    }

    // Validate cost breakdown
    if (!data.costBreakdown?.totalEstimatedCost || typeof data.costBreakdown.categories !== 'object') {
      console.error('Invalid cost breakdown');
      return false;
    }

    // Validate accommodation options
    if (!Array.isArray(data.accommodationOptions) || data.accommodationOptions.length < 3) {
      console.error('Insufficient accommodation options');
      return false;
    }

    // Validate daily budget
    if (typeof data.dailyBudgetSpent !== 'number' || data.dailyBudgetSpent <= 0) {
      console.error('Invalid daily budget spent');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}
async function parseGeminiResponse(responseText: string): Promise<any> {
  try {
    // First attempt: direct parse
    if (typeof responseText === 'string') {
      try {
        console.log(JSON.parse(responseText))
        return JSON.parse(responseText);
      } catch (parseError) {
        // Clean any markdown code blocks or decorators
        let jsonStr = responseText
          .replace(/```json\s*|\s*```/g, '')
          .replace(/^[\s\n]+|[\s\n]+$/g, ''); // Trim whitespace and newlines
        
        // Remove any non-JSON text before or after
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
        }
        console.log(JSON.parse(jsonStr))
        return JSON.parse(jsonStr);

      }
    }

    // If response is already an object
    if (typeof responseText === 'object' && responseText !== null) {
      return responseText;
    }

    console.error('Invalid response format:', responseText);
    return null;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.error('Raw response:', responseText);
    return null;
  }
}

async function makeApiRequest(prompt: string, retryState: RetryState): Promise<any> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
        safetySettings: [{
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from AI service');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(`API request failed (attempt ${retryState.attempt + 1}/${retryState.maxAttempts}):`, error);
    
    if (retryState.attempt < retryState.maxAttempts) {
      const delay = calculateBackoff(retryState.attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeApiRequest(prompt, {
        ...retryState,
        attempt: retryState.attempt + 1,
      });
    }
    
    throw error;
  }
}

async function generateItinerary(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode = 'luxury'
): Promise<Itinerary | null> {
  const retryState: RetryState = {
    attempt: 0,
    maxAttempts: MAX_RETRIES,
    validationFailed: false,
    parseFailed: false,
  };

  try {
    const actualDuration = Math.ceil(
      (preferences.dateRange.end.getTime() - preferences.dateRange.start.getTime()) /
      (1000 * 60 * 60 * 24)
    ) + 1;

    const prompt = getPromptByMode(destination, preferences, actualDuration, mode);
    let responseText = await makeApiRequest(prompt, retryState);
    let itineraryData: any = null;
    let isValid = false;

    // Parsing retry loop
    while (!itineraryData && retryState.attempt < MAX_PARSE_RETRIES) {
      try {
        itineraryData = await parseGeminiResponse(responseText);
        if (!itineraryData) {
          retryState.parseFailed = true;
          retryState.attempt++;
          responseText = await makeApiRequest(prompt, retryState);
        }
      } catch (error) {
        if (retryState.attempt >= MAX_PARSE_RETRIES - 1) throw error;
        retryState.attempt++;
        const delay = calculateBackoff(retryState.attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
        responseText = await makeApiRequest(prompt, retryState);
      }
    }

    // Validation retry loop
    retryState.attempt = 0;
    while (!isValid && retryState.attempt < MAX_VALIDATION_RETRIES) {
      isValid = await validateResponse(itineraryData, preferences.route);
      if (!isValid) {
        retryState.validationFailed = true;
        retryState.attempt++;
        if (retryState.attempt < MAX_VALIDATION_RETRIES) {
          const delay = calculateBackoff(retryState.attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          responseText = await makeApiRequest(prompt, retryState);
          itineraryData = await parseGeminiResponse(responseText);
        }
      }
    }

    if (!isValid) {
      throw new Error('Failed to generate valid itinerary after multiple attempts');
    }

    // Fetch destination image
    const imageUrl = await fetchDestinationImage(`${destination.name} ${destination.country} landmarks`);
    
    // Process the days to include proper dates
    const processedDays = itineraryData.days.map((day: any) => ({
      ...day,
      date: new Date(preferences.dateRange.start.getTime() + (day.day - 1) * 24 * 60 * 60 * 1000).toISOString(),
    }));

    // Construct the complete itinerary
    const completeItinerary: Itinerary = {
      destination: {
        ...destination,
        imageUrl, // Add the fetched image URL
      },
      duration: actualDuration,
      preferences: {
        ...preferences,
        budgetPerDay: itineraryData.dailyBudgetSpent,
      },
      mode,
      route: preferences.route,
      recommendedDuration: itineraryData.recommendedDuration,
      localCurrency: itineraryData.localCurrency,
      accommodationOptions: itineraryData.accommodationOptions,
      transportInfo: itineraryData.transportInfo,
      transportationDetails: itineraryData.transportationDetails,
      days: processedDays,
      essentialInfo: itineraryData.essentialInfo,
      seasonalInfo: itineraryData.seasonalInfo,
      costBreakdown: itineraryData.costBreakdown,
    };

    return completeItinerary;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    throw error;
  }
}
const requestCache = new Map<string, Itinerary>();
const REQUEST_TIMEOUT = 5000;

async function generateItineraryWithRetry(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode = 'luxury',
): Promise<Itinerary | null> {
  const actualDuration = Math.ceil(
    (preferences.dateRange.end.getTime() - preferences.dateRange.start.getTime()) /
    (1000 * 60 * 60 * 24)
  ) + 1;

  const cacheKey = JSON.stringify({
    destination,
    preferences,
    actualDuration,
    mode,
  });

  // Check cache first
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  let lastError: any;
  const retryState: RetryState = {
    attempt: 0,
    maxAttempts: MAX_RETRIES,
  };

  while (retryState.attempt < retryState.maxAttempts) {
    try {
      const result = await generateItinerary(destination, preferences, actualDuration, mode);
      
      if (result) {
        // Cache successful result
        requestCache.set(cacheKey, result);
        setTimeout(() => requestCache.delete(cacheKey), REQUEST_TIMEOUT);
        return result;
      } else {
        throw new Error('generateItinerary returned null');
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${retryState.attempt + 1} failed:`, error);

      retryState.attempt++;

      if (retryState.attempt < retryState.maxAttempts) {
        // Add jitter to backoff
        const jitter = Math.random() * 1000;
        const backoffTime = Math.min(calculateBackoff(retryState.attempt) + jitter, 10000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  // Log comprehensive error information
  console.error('Failed to generate itinerary after multiple attempts:', {
    lastError,
    retryState,
    destination: destination.name,
    mode,
    duration: actualDuration,
  });

  return null;
}

// Re-export all necessary functions
export {
  generateItinerary,
  generateItineraryWithRetry,
  validateResponse,
  parseGeminiResponse,
  getPromptByMode,
  fetchDestinationImage,
};