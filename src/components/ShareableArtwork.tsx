import React from 'react';
import type { Itinerary } from '../types';

interface ShareableArtworkProps {
  itinerary: Itinerary;
  mode: 'luxury' | 'adventure';
}

export const ShareableArtwork: React.FC<ShareableArtworkProps> = ({
  itinerary,
  mode,
}) => {
  return (
    <svg
      width="1200"
      height="630"
      viewBox="0 0 1200 630"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect
        width="1200"
        height="630"
        fill={mode === 'luxury' ? '#1A1A1A' : '#1F2937'}
      />

      {/* Decorative Elements */}
      <path
        d="M0 0 L1200 0 L1200 20 L0 20 Z"
        fill={mode === 'luxury' ? '#D4AF37' : '#48BB78'}
        opacity="0.8"
      />
      <path
        d="M0 610 L1200 610 L1200 630 L0 630 Z"
        fill={mode === 'luxury' ? '#D4AF37' : '#48BB78'}
        opacity="0.8"
      />

      {/* Title */}
      <text
        x="600"
        y="200"
        textAnchor="middle"
        fill={mode === 'luxury' ? '#D4AF37' : '#48BB78'}
        style={{
          fontSize: '64px',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
        }}
      >
        {itinerary.destination.name}
      </text>

      {/* Subtitle */}
      <text
        x="600"
        y="280"
        textAnchor="middle"
        fill="#FFFFFF"
        style={{
          fontSize: '36px',
          fontFamily: 'Helvetica',
        }}
      >
        {itinerary.destination.country}
      </text>

      {/* Duration */}
      <text
        x="600"
        y="350"
        textAnchor="middle"
        fill="#888888"
        style={{
          fontSize: '24px',
          fontFamily: 'Helvetica',
        }}
      >
        {itinerary.duration} Days Journey
      </text>

      {/* Travel Style */}
      <text
        x="600"
        y="400"
        textAnchor="middle"
        fill="#FFFFFF"
        style={{
          fontSize: '28px',
          fontFamily: 'Helvetica',
        }}
      >
        {itinerary.preferences.travelStyle} Experience
      </text>

      {/* Branding */}
      <text
        x="600"
        y="550"
        textAnchor="middle"
        fill={mode === 'luxury' ? '#D4AF37' : '#48BB78'}
        style={{
          fontSize: '24px',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
        }}
      >
        Created by chumaoruworks
      </text>
    </svg>
  );
};
