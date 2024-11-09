import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ItineraryPDF } from '../components/ItineraryPDF';
import type { Itinerary } from '../types';

export const generateAndDownloadPDF = async (
  itinerary: Itinerary,
  mode: 'luxury' | 'adventure'
): Promise<void> => {
  try {
    // Validate itinerary data
    if (!itinerary || !itinerary.destination || !itinerary.destination.name) {
      throw new Error('Invalid itinerary data');
    }

    // Create PDF document
    const PdfDocument = React.createElement(ItineraryPDF, {
      itinerary,
      mode,
    });

    // Generate PDF blob
    const blob = await pdf(PdfDocument).toBlob();

    // Generate safe filename
    const filename = `${itinerary.destination.name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')}-itinerary.pdf`;

    // Download using file-saver
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
