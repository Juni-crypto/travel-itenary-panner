import type { Itinerary } from '../types';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const createShareableContent = (
  itinerary: Itinerary,
  mode: 'luxury' | 'adventure'
) => {
  const backgroundColor = mode === 'luxury' ? '#1A1A1A' : '#1F2937';
  const accentColor = mode === 'luxury' ? '#D4AF37' : '#48BB78';
  const secondaryColor = mode === 'luxury' ? '#D4AF3733' : '#48BB7833';

  // Calculate total activities
  const totalActivities = itinerary.days.reduce(
    (acc, day) => acc + day.activities.length,
    0
  );

  // Get first accommodation name or default
  const mainAccommodation =
    itinerary.accommodationOptions[0]?.name || 'Luxury Accommodations';

  // Format budget
  const budget = formatCurrency(itinerary.preferences.budgetPerDay);

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
    >
      <!-- Definitions -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${backgroundColor}ee;stop-opacity:1" />
        </linearGradient>
        
        <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20h40M20 0v40" stroke="${accentColor}" stroke-width="0.5" opacity="0.1"/>
        </pattern>

        <!-- Icon definitions -->
        <g id="locationIcon">
          <path d="M12 0C7.2 0 3.6 3.6 3.6 8.4C3.6 14.7 12 24 12 24C12 24 20.4 14.7 20.4 8.4C20.4 3.6 16.8 0 12 0ZM12 12C10.2 12 8.4 10.2 8.4 8.4C8.4 6.6 10.2 4.8 12 4.8C13.8 4.8 15.6 6.6 15.6 8.4C15.6 10.2 13.8 12 12 12Z" 
                fill="${accentColor}"/>
        </g>

        <g id="calendarIcon">
          <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" 
                fill="${accentColor}"/>
        </g>

        <g id="activityIcon">
          <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.3-3.04.86-4.43a5.582 5.582 0 003.97 1.63c2.66 0 4.75-1.83 5.28-4.43A14.77 14.77 0 0118 14c0 3.31-2.69 6-6 6z" 
                fill="${accentColor}"/>
        </g>
      </defs>

      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGradient)" />
      <rect width="1200" height="630" fill="url(#pattern)" />

      <!-- Accent bars -->
      <rect x="0" y="0" width="1200" height="4" fill="${accentColor}" />
      <rect x="0" y="626" width="1200" height="4" fill="${accentColor}" />

      <!-- Main Title -->
      <text
        x="600"
        y="100"
        font-family="Arial"
        font-size="72"
        font-weight="bold"
        fill="${accentColor}"
        text-anchor="middle"
      >${itinerary.destination.name}</text>

      <!-- Location -->
      <g transform="translate(600, 160)">
        <use href="#locationIcon" x="-12" y="-12" />
        <text
          x="35"
          y="7"
          font-family="Arial"
          font-size="32"
          fill="#FFFFFF"
          text-anchor="start"
        >${itinerary.destination.country}</text>
      </g>

      <!-- Key Information Boxes -->
      <!-- Duration Box -->
      <g transform="translate(150, 250)">
        <rect x="0" y="0" width="250" height="100" rx="15" 
              fill="${backgroundColor}" stroke="${accentColor}" stroke-width="2" />
        <use href="#calendarIcon" x="20" y="20" />
        <text x="125" y="40" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle">Duration</text>
        <text x="125" y="80" font-family="Arial" font-size="36" font-weight="bold" 
              fill="${accentColor}" text-anchor="middle">${itinerary.duration} Days</text>
      </g>

      <!-- Budget Box -->
      <g transform="translate(475, 250)">
        <rect x="0" y="0" width="250" height="100" rx="15" 
              fill="${backgroundColor}" stroke="${accentColor}" stroke-width="2" />
        <text x="125" y="40" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle">Daily Budget</text>
        <text x="125" y="80" font-family="Arial" font-size="36" font-weight="bold" 
              fill="${accentColor}" text-anchor="middle">${budget}</text>
      </g>

      <!-- Travel Style Box -->
      <g transform="translate(800, 250)">
        <rect x="0" y="0" width="250" height="100" rx="15" 
              fill="${backgroundColor}" stroke="${accentColor}" stroke-width="2" />
        <text x="125" y="40" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle">Travel Style</text>
        <text x="125" y="80" font-family="Arial" font-size="32" font-weight="bold" 
              fill="${accentColor}" text-anchor="middle">${itinerary.preferences.travelStyle}</text>
      </g>

      <!-- Highlights Section -->
      <g transform="translate(150, 400)">
        <text x="0" y="0" font-family="Arial" font-size="28" fill="#FFFFFF" font-weight="bold">Trip Highlights</text>
        
        <!-- Accommodations -->
        <g transform="translate(0, 40)">
          <rect x="0" y="0" width="400" height="50" rx="10" 
                fill="${backgroundColor}" stroke="${accentColor}" stroke-width="1" />
          <text x="20" y="32" font-family="Arial" font-size="20" fill="#FFFFFF">
            ${mainAccommodation}
          </text>
        </g>

        <!-- Activities -->
        <g transform="translate(0, 100)">
          <rect x="0" y="0" width="400" height="50" rx="10" 
                fill="${backgroundColor}" stroke="${accentColor}" stroke-width="1" />
          <use href="#activityIcon" x="20" y="13" />
          <text x="60" y="32" font-family="Arial" font-size="20" fill="#FFFFFF">
            ${totalActivities} Activities Planned
          </text>
        </g>
      </g>

      <!-- QR Code Space -->
      <g transform="translate(900, 400)">
        <rect x="0" y="0" width="150" height="150" rx="10" 
              fill="${backgroundColor}" stroke="${accentColor}" stroke-width="2" />
        <text x="75" y="85" font-family="Arial" font-size="14" fill="#FFFFFF" text-anchor="middle">
          Scan to view
        </text>
      </g>

      <!-- Branding -->
      <g transform="translate(600, 580)">
        <text
          x="0"
          y="0"
          font-family="Arial"
          font-size="24"
          font-weight="bold"
          fill="${accentColor}"
          text-anchor="middle"
        >Created by chumaoruworks</text>
      </g>
    </svg>
  `;
};

export const generateShareableImage = async (
  itinerary: Itinerary,
  mode: 'luxury' | 'adventure'
): Promise<Blob> => {
  try {
    // Create SVG content
    const svgContent = createShareableContent(itinerary, mode);

    // Create SVG Blob
    const svgBlob = new Blob([svgContent], {
      type: 'image/svg+xml;charset=utf-8',
    });

    // Create canvas to convert SVG to PNG
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Create image from SVG
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate image'));
            }
          },
          'image/png',
          1.0
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load SVG'));
      };

      img.src = URL.createObjectURL(svgBlob);
    });
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export const shareToSocialMedia = async (
  itinerary: Itinerary,
  mode: 'luxury' | 'adventure',
  platform: 'instagram' | 'facebook' | 'twitter'
): Promise<void> => {
  try {
    const imageBlob = await generateShareableImage(itinerary, mode);
    const shareText = `Check out my ${itinerary.duration}-day ${
      mode === 'luxury' ? 'luxury' : 'adventure'
    } itinerary for ${
      itinerary.destination.name
    }! #Travel #${itinerary.destination.name.replace(
      /\s+/g,
      ''
    )} #chumaoruworks`;

    switch (platform) {
      case 'instagram':
        if (navigator.share && navigator.canShare) {
          await navigator.share({
            title: `${itinerary.destination.name} Itinerary`,
            text: shareText,
            files: [
              new File([imageBlob], 'itinerary.png', { type: 'image/png' }),
            ],
          });
        } else {
          // Fallback - download the image
          const url = URL.createObjectURL(imageBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${itinerary.destination.name.toLowerCase()}-itinerary.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert('Image downloaded! You can now share it on Instagram.');
        }
        break;

      case 'facebook':
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}&quote=${encodeURIComponent(shareText)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
        break;

      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(window.location.href)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;
    }
  } catch (error) {
    console.error('Error sharing:', error);
    throw error;
  }
};
