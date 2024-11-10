import type {
  Destination,
  TripPreferences,
  Itinerary,
  ThemeMode,
} from '../types';

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

const API_KEY = 'AIzaSyC-do77zfjKjZjMski7yLhGA-yBltlSKww';
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const MAX_DAYS = 4;

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
  if (month >= 3 && month <= 5) {
    return 'Spring';
  } else if (month >= 6 && month <= 8) {
    return 'Summer';
  } else if (month >= 9 && month <= 11) {
    return 'Autumn';
  } else {
    return 'Winter';
  }
}

function formatDates(dateRange: { start: Date; end: Date }): string {
  return `${dateRange.start.toLocaleDateString()} to ${dateRange.end.toLocaleDateString()}`;
}

function getPromptByMode(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode
): string {
  const startDate = preferences.dateRange.start;
  const endDate = preferences.dateRange.end;
  const actualDuration =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Added budgetBarriers function
  const budgetBarriers = () => {
    if (mode === 'luxury') {
      switch (preferences.budget) {
        case 'luxury':
          return 'Set a high budget barrier to include premium accommodations and exclusive activities.';
        case 'moderate':
          return 'Set a medium budget barrier to balance comfort with cost-effective options.';
        case 'budget':
          return 'Set a low budget barrier to prioritize essential experiences over luxury.';
        default:
          return '';
      }
    } else if (mode === 'backpacking') {
      switch (preferences.budget) {
        case 'luxury':
          return 'Set a high budget barrier to include quality accommodations while maintaining affordability.';
        case 'moderate':
          return 'Set a medium budget barrier to balance between cost and experience.';
        case 'budget':
          return 'Set a low budget barrier to maximize affordability with basic accommodations and activities.';
        default:
          return '';
      }
    }
    return '';
  };

  const systemPrompt = `You are a travel itinerary planning assistant. Your task is to create a detailed ${actualDuration}-day itinerary for ${destination.name}, ${destination.country} from ${formatDetailedDate(
    startDate
  )} to ${formatDetailedDate(
    endDate
  )} during ${getSeason(startDate)} season.
  ${budgetBarriers()}
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
  10. All coordinates should be valid numbers within range`;

  console.log(preferences)
  const preferencesDescription = `
  Travel Parameters:
  - Style: ${preferences.travelStyle} travel for ${preferences.groupSize} person(s)
  - Budget Preference: ${preferences.budget}
  - Activity Level: ${preferences.activityLevel}
  - Interests: ${preferences.specialInterests.join(', ')}
  - Dietary: ${
    preferences.dietaryRestrictions.length > 0
      ? preferences.dietaryRestrictions.join(', ')
      : 'None'
  }
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
  ${
    preferences.accessibility.length > 0
      ? `- Accessibility: ${preferences.accessibility.join(', ')}`
      : ''
  }`;

  const experienceType =
    mode === 'luxury'
      ? 'premium and exclusive'
      : 'authentic and budget-friendly';

  const outputFormat = `
  Required JSON Structure:
  {
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
      // Include at least 3 accommodation options
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
      "visaRequirements": string,
      "vaccinations": string[],
      "emergencyContacts": {
        "police": string,
        "ambulance": string,
        "tourOperator": string
      },
      "timeZone": string,
      "languages": string[]
    },
    "seasonalInfo": {
      "weather": string,
      "bestTimeToVisit": string,
      "peakTouristSeason": string
    },
    "costBreakdown": {
      "totalCost": number,
      "currency": string,
      "breakdown": [
        {
          "category": string,
          "amount": number
        }
      ]
    },
    "dailyBudgetSpent": number
  }`;

  const requirements = `
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
  ${
    preferences.restDays ? '10. Balance activities with rest' : ''
  }${
    preferences.photoOpportunities ? '11. Highlight photography spots' : ''
  }`;

  const validationRules = `
  Validation Rules:
  1. All dates must be in ISO 8601 format
  2. All coordinates must be valid latitude/longitude values
  3. All URLs must start with https://
  4. All required fields must be present
  5. No null values allowed - use empty strings or 0 for optional fields
  6. Arrays must contain at least one item
  7. All number fields must contain actual numbers, not strings
  8. All string fields must use double quotes
  9. No trailing commas in objects or arrays
  10. All activities must have valid times in 24-hour format (HH:MM)
  11. The "accommodationOptions" array must contain at least 3 items`;

  return `${systemPrompt}

  ${preferencesDescription}

  ${additionalParams}

  Please consider the following temporal factors:
  - Time of year: ${startDate.toLocaleString('en-US', { month: 'long' })}
  - Season: ${getSeason(startDate)}
  - Day of week start: ${startDate.toLocaleString('en-US', { weekday: 'long' })}
  - Day of week end: ${endDate.toLocaleString('en-US', { weekday: 'long' })}

  Travel Dates: ${formatDates(preferences.dateRange)}

  ${requirements}

  ${outputFormat}

  ${validationRules}

  Respond with only the JSON data structure. No additional text, comments, or markdown.`;
}

async function validateResponse(data: any): Promise<boolean> {
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
      'dailyBudgetSpent', // Added dailyBudgetSpent
    ];

    for (const field of requiredFields) {
      if (!(field in data)) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
  
    // Days array validation
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
        if (!activity.name || !activity.duration || !activity.location) {
          console.error('Invalid activity structure:', activity);
          return false;
        }

        // Validate coordinates
        const coords = activity.location.coordinates;
        if (
          !coords ||
          typeof coords.lat !== 'number' ||
          typeof coords.lng !== 'number'
        ) {
          console.error('Invalid coordinates:', coords);
          return false;
        }
      }

      // Validate meals
      if (Array.isArray(day.meals)) {
        for (const meal of day.meals) {
          if (!meal.time || !meal.venue) {
            console.error('Invalid meal structure:', meal);
            return false;
          }
        }
      }
    }

    // Validate currency information
    if (
      !data.localCurrency?.code ||
      !data.localCurrency?.symbol ||
      typeof data.localCurrency?.exchangeRate !== 'number'
    ) {
      console.error('Invalid currency information');
      return false;
    }

    // Validate cost breakdown
    if (
      !data.costBreakdown?.totalCost ||
      !Array.isArray(data.costBreakdown.breakdown)
    ) {
      console.error('Invalid cost breakdown');
      return false;
    }

    // Validate dailyBudgetSpent
    if (typeof data.dailyBudgetSpent !== 'number') {
      console.error('Invalid or missing dailyBudgetSpent');
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
    // If the response is already a valid JSON string, parse it directly
    if (typeof responseText === 'string') {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        // Attempt to clean any markdown code blocks or decorators
        let jsonStr = responseText.replace(/```json\s*|\s*```/g, '').trim();
        return JSON.parse(jsonStr);
      }
    }

    // If the response is already an object, return it
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

async function generateItinerary(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode = 'luxury'
): Promise<Itinerary | null> {
  try {
    const actualDuration =
      Math.ceil(
        (preferences.dateRange.end.getTime() -
          preferences.dateRange.start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const prompt = getPromptByMode(
      destination,
      preferences,
      actualDuration,
      mode
    );

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.promptFeedback?.blockReason) {
      console.error(`Content blocked: ${data.promptFeedback.blockReason}`);
      throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      return null;
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid response structure from AI service');
      throw new Error('Invalid response structure from AI service');
      return null;
      
    }

    const responseText = data.candidates[0].content.parts[0].text;
    const itineraryData = await parseGeminiResponse(responseText);

    if (!itineraryData) {
      console.error('Failed to parse AI response');
      throw new Error('Failed to parse AI response');
      return null;
    }

    const isValid = await validateResponse(itineraryData);
    if (!isValid) {
      console.error('Validation failed for AI response');
      throw new Error('Validation failed for AI response');
      return null;
    }

    const processedDays = itineraryData.days.map((day: any) => ({
      ...day,
      date: new Date(
        preferences.dateRange.start.getTime() +
          (day.day - 1) * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    const completeItinerary: Itinerary = {
      destination,
      duration: actualDuration,
      preferences: {
        ...preferences,
        budgetPerDay: itineraryData.dailyBudgetSpent, // Fixed dailyBudgetSpent
      },
      mode,
      recommendedDuration: itineraryData.recommendedDuration,
      localCurrency: itineraryData.localCurrency,
      accommodationOptions: itineraryData.accommodationOptions,
      transportInfo: itineraryData.transportInfo,
      days: processedDays,
      essentialInfo: itineraryData.essentialInfo,
      seasonalInfo: itineraryData.seasonalInfo,
      costBreakdown: itineraryData.costBreakdown,
    };

    return completeItinerary;
  } catch (error) {
    console.error('Error in generateItinerary:', error);
    throw new Error('Error in generateItinerary:', error);
    return null;
  }
}

const requestCache = new Map<string, Itinerary>();
const REQUEST_TIMEOUT = 5000;

async function generateItineraryWithRetry(
  destination: Destination,
  preferences: TripPreferences,
  duration: number,
  mode: ThemeMode = 'luxury',
  maxRetries = 3
): Promise<Itinerary | null> {
  const actualDuration =
    Math.ceil(
      (preferences.dateRange.end.getTime() -
        preferences.dateRange.start.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;
  const cacheKey = JSON.stringify({
    destination,
    preferences,
    actualDuration,
    mode,
  });

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!;
  }

  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await generateItinerary(
        destination,
        preferences,
        actualDuration,
        mode
      );

      if (result) {
        // Cache the successful result
        requestCache.set(cacheKey, result);
        setTimeout(() => requestCache.delete(cacheKey), REQUEST_TIMEOUT);
        return result;
      }

      // If result is null but no error was thrown, wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);

      // Exponential backoff for retries
      const backoffTime = Math.min(1000 * Math.pow(2, i), 5000);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  console.error(
    'Failed to generate itinerary after multiple attempts:',
    lastError
  );
  return null;
}

// Re-export all necessary functions
export {
  generateItinerary,
  generateItineraryWithRetry,
  validateResponse,
  parseGeminiResponse,
  getPromptByMode,
};
