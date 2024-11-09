import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import type { Itinerary } from '../types';
import { createPdfStyles } from '../utils/pdf-styles';
import {
  safeText,
  formatCurrency,
  formatTime,
} from '../utils/pdf-format-utils';

interface ItineraryPDFProps {
  itinerary: Itinerary;
  mode: 'luxury' | 'adventure';
}

export const ItineraryPDF: React.FC<ItineraryPDFProps> = ({
  itinerary,
  mode,
}) => {
  const styles = createPdfStyles(mode);

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverPage}>
          <Text style={styles.coverTitle}>
            {safeText(itinerary.destination.name)}
          </Text>
          <View style={styles.accentBar} />
          <Text style={styles.coverSubtitle}>
            {safeText(itinerary.destination.country)}
          </Text>
          <Text style={styles.brandText}>Created by chumaoruworks</Text>
        </View>
      </Page>

      {/* Trip Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Overview</Text>
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{itinerary.duration} Days</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Travel Style</Text>
              <Text style={styles.value}>
                {safeText(itinerary.preferences.travelStyle)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Group Size</Text>
              <Text style={styles.value}>
                {itinerary.preferences.groupSize} People
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Daily Budget</Text>
              <Text style={styles.value}>
                {formatCurrency(itinerary.preferences.budgetPerDay)}
              </Text>
            </View>
          </View>
        </View>

        {/* Essential Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Information</Text>
          <View style={styles.infoBox}>
            <Text style={styles.warningText}>Visa Requirements</Text>
            <Text style={styles.value}>
              {safeText(itinerary.essentialInfo.visaRequirements)}
            </Text>

            <Text style={styles.warningText}>Required Vaccinations</Text>
            {itinerary.essentialInfo.vaccinations.map((vaccine, index) => (
              <Text key={index} style={styles.bulletPoint}>
                • {vaccine}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by chumaoruworks</Text>
          <Text style={styles.pageNumber}>1</Text>
        </View>
      </Page>

      {/* Accommodations */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Accommodations</Text>

        {itinerary.accommodationOptions.map((hotel, index) => (
          <View key={index} style={styles.hotelCard}>
            <Text style={styles.hotelName}>{safeText(hotel.name)}</Text>
            <Text style={styles.hotelDescription}>
              {safeText(hotel.description)}
            </Text>

            <View style={styles.amenitiesList}>
              <Text style={styles.warningText}>Amenities</Text>
              {hotel.amenities.map((amenity, aIndex) => (
                <Text key={aIndex} style={styles.bulletPoint}>
                  • {amenity}
                </Text>
              ))}
            </View>

            {hotel.pricePerNight && (
              <Text style={styles.priceInfo}>
                Price per night: {formatCurrency(hotel.pricePerNight)}
              </Text>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by chumaoruworks</Text>
          <Text style={styles.pageNumber}>2</Text>
        </View>
      </Page>

      {/* Daily Itinerary */}
      {itinerary.days.map((day, dayIndex) => (
        <Page key={dayIndex} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Day {day.day}</Text>

          {day.activities.map((activity, actIndex) => (
            <View key={actIndex} style={styles.daySection}>
              <Text style={styles.activityTitle}>
                {safeText(activity.name)}
              </Text>
              <Text style={styles.timeInfo}>
                {formatTime(activity.startTime)} • {safeText(activity.duration)}
              </Text>
              <Text style={styles.activityDetails}>
                {safeText(activity.description)}
              </Text>
              {activity.cost > 0 && (
                <Text style={styles.costInfo}>
                  Cost: {formatCurrency(activity.cost)}
                </Text>
              )}
            </View>
          ))}

          {day.meals?.map((meal, mealIndex) => (
            <View key={mealIndex} style={styles.daySection}>
              <Text style={styles.hotelName}>{safeText(meal.venue)}</Text>
              <Text style={styles.timeInfo}>{formatTime(meal.time)}</Text>
              <Text style={styles.activityDetails}>
                {safeText(meal.description)}
              </Text>
              <Text style={styles.costInfo}>
                {formatCurrency(meal.priceRange.min)} -{' '}
                {formatCurrency(meal.priceRange.max)}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Created by chumaoruworks</Text>
            <Text style={styles.pageNumber}>{dayIndex + 3}</Text>
          </View>
        </Page>
      ))}

      {/* Transportation Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Transportation</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          {itinerary.transportInfo.taxiServices.map((service, index) => (
            <View key={index} style={styles.hotelCard}>
              <Text style={styles.hotelName}>{safeText(service.name)}</Text>
              <Text style={styles.hotelDescription}>
                {safeText(service.description)}
              </Text>
              <Text style={styles.priceInfo}>
                Price Range: {formatCurrency(service.priceRange.min)} -{' '}
                {formatCurrency(service.priceRange.max)}
              </Text>
            </View>
          ))}
        </View>

        {itinerary.transportInfo.publicTransport && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Public Transportation</Text>
            <View style={styles.infoBox}>
              <Text style={styles.value}>
                Day Pass:{' '}
                {formatCurrency(
                  itinerary.transportInfo.publicTransport.dayPassCost
                )}
              </Text>
              <View style={styles.amenitiesList}>
                <Text style={styles.warningText}>Available Options</Text>
                {itinerary.transportInfo.publicTransport.options.map(
                  (option, index) => (
                    <Text key={index} style={styles.bulletPoint}>
                      • {option}
                    </Text>
                  )
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by chumaoruworks</Text>
          <Text style={styles.pageNumber}>{itinerary.days.length + 3}</Text>
        </View>
      </Page>

      {/* Cost Breakdown Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>

        <View style={styles.infoBox}>
          {itinerary.costBreakdown.breakdown.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{item.category}</Text>
              <Text style={styles.value}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          <View style={[styles.row, { borderBottomWidth: 0, marginTop: 10 }]}>
            <Text
              style={[
                styles.label,
                { fontSize: 14, fontFamily: 'Helvetica-Bold' },
              ]}
            >
              Total Cost
            </Text>
            <Text
              style={[
                styles.value,
                {
                  fontSize: 14,
                  color: mode === 'luxury' ? '#D4AF37' : '#48BB78',
                },
              ]}
            >
              {formatCurrency(itinerary.costBreakdown.totalCost)}
            </Text>
          </View>
        </View>

        {/* Seasonal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather & Best Time to Visit</Text>
          <View style={styles.infoBox}>
            <Text style={styles.value}>
              {safeText(itinerary.seasonalInfo.weather)}
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Best Time to Visit</Text>
              <Text style={styles.value}>
                {safeText(itinerary.seasonalInfo.bestTimeToVisit)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Peak Season</Text>
              <Text style={styles.value}>
                {safeText(itinerary.seasonalInfo.peakTouristSeason)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by chumaoruworks</Text>
          <Text style={styles.pageNumber}>{itinerary.days.length + 4}</Text>
        </View>
      </Page>
    </Document>
  );
};
