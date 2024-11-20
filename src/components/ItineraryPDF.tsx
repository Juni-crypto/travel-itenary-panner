import React from 'react';
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';
import type { Itinerary } from '../types';
import {
  safeText,
  formatTime,
} from '../utils/pdf-format-utils';

// Define the ItineraryPDFProps interface
interface ItineraryPDFProps {
  itinerary: Itinerary;
  mode: 'luxury' | 'adventure';
}

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Define the ItineraryPDF component
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
          <Text style={styles.brandText}>Created by Chumaoru Works</Text>
        </View>
      </Page>

      {/* Trip Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Overview</Text>
          <View style={styles.infoBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>
                {itinerary.recommendedDuration.optimal} Days
              </Text>
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
                {itinerary.preferences.budgetPerDay}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Chumaoru Works</Text>
          <Text style={styles.pageNumber}>1</Text>
        </View>
      </Page>

      {/* Accommodations */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Accommodations</Text>

        {itinerary.accommodationOptions.map((hotel) => (
          <View key={hotel.id} style={styles.hotelCard}>
            {hotel.imageUrl && (
              <Image style={styles.hotelImage} src={hotel.imageUrl} />
            )}
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{safeText(hotel.name)}</Text>
              <Text style={styles.hotelDescription}>
                {safeText(hotel.description)}
              </Text>

              <View style={styles.amenitiesList}>
                <Text style={styles.warningText}>Amenities</Text>
                {hotel.amenities.map((amenity, index) => (
                  <Text key={index} style={styles.bulletPoint}>
                    • {amenity}
                  </Text>
                ))}
              </View>

              {hotel.pricePerNight !== undefined && (
                <Text style={styles.priceInfo}>
                  Price per night: {hotel.pricePerNight}
                </Text>
              )}
              {hotel.bookingUrl && (
                <Text style={styles.link}>
                  Booking: {safeText(hotel.bookingUrl)}
                </Text>
              )}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Created by Chumaoru Works</Text>
          <Text style={styles.pageNumber}>2</Text>
        </View>
      </Page>

      {/* Transportation Details */}
      {itinerary.transportationDetails && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Transportation</Text>

          {/* Available Routes */}
          {(itinerary.transportationDetails.routes?.length ?? 0) > 0 && (
            <View style={styles.section}>
              <Text style={styles.subSectionTitle}>Available Routes</Text>
              {itinerary.transportationDetails.routes.map((route, index) => (
                <View key={index} style={styles.routeCard}>
                  <Text style={styles.routeType}>{route.type}</Text>
                  <Text style={styles.routeProvider}>{route.provider}</Text>
                  <Text style={styles.routeDetail}>
                    Schedule: {safeText(route.schedule)}
                  </Text>
                  <Text style={styles.routeDetail}>
                    Duration: {safeText(route.duration)}
                  </Text>
                  <Text style={styles.routeDetail}>
                    Cost: {route.cost}
                  </Text>
                  {route.bookingUrl && (
                    <Text style={styles.link}>
                      Book Here: {safeText(route.bookingUrl)}
                    </Text>
                  )}
                  <View style={styles.notesList}>
                    {route.notes.map((note, nIndex) => (
                      <Text key={nIndex} style={styles.bulletPoint}>
                        • {note}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Transportation Hubs */}
          {(itinerary.transportationDetails.hubs?.length ?? 0) > 0 && (
            <View style={styles.section}>
              <Text style={styles.subSectionTitle}>Transportation Hubs</Text>
              {itinerary.transportationDetails.hubs.map((hub, index) => (
                <View key={index} style={styles.hubCard}>
                  <Text style={styles.hubName}>{hub.name}</Text>
                  <Text style={styles.hubType}>{hub.type}</Text>
                  <Text style={styles.hubDetail}>
                    Coordinates: {hub.location.coordinates.lat}, {hub.location.coordinates.lng}
                  </Text>
                  <Text style={styles.hubDetail}>
                    Distance: {hub.distance} km
                  </Text>
                  <View style={styles.transportOptions}>
                    <Text style={styles.warningText}>Transport Options</Text>
                    {hub.transportOptions.map((option, oIndex) => (
                      <Text key={oIndex} style={styles.bulletPoint}>
                        • {option}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.facilities}>
                    <Text style={styles.warningText}>Facilities</Text>
                    {hub.facilities.map((facility, fIndex) => (
                      <Text key={fIndex} style={styles.bulletPoint}>
                        • {facility}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Created by Chumaoru Works</Text>
            <Text style={styles.pageNumber}>3</Text>
          </View>
        </Page>
      )}

      {/* Daily Itinerary */}
      {itinerary.days.map((day, dayIndex) => (
        <Page key={dayIndex} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>
            Day {day.day} - {formatDate(day.date)}
          </Text>

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
                  Cost: {activity.cost}
                </Text>
              )}
            </View>
          ))}

          {day.meals?.map((meal, mealIndex) => (
            <View key={mealIndex} style={styles.mealSection}>
              <Text style={styles.mealTime}>{meal.time}</Text>
              <Text style={styles.mealVenue}>{safeText(meal.venue)}</Text>
              <Text style={styles.mealDescription}>
                {safeText(meal.description)}
              </Text>
              <Text style={styles.priceInfo}>
                {meal.priceRange.min} - {meal.priceRange.max}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Created by Chumaoru Works</Text>
            <Text style={styles.pageNumber}>
              {dayIndex + (itinerary.transportationDetails ? 4 : 3)}
            </Text>
          </View>
        </Page>
      ))}

      {/* Cost Breakdown Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>

        <View style={styles.infoBox}>
          {Object.entries(itinerary.costBreakdown.categories).map(([category, amount], index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{capitalizeFirstLetter(category)}</Text>
              <Text style={styles.value}>
                {amount}
              </Text>
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
                  color: mode === 'luxury' ? '#FFD700' : '#48BB78',
                },
              ]}
            >
              {itinerary.costBreakdown.totalEstimatedCost}
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
          <Text style={styles.footerText}>Created by Chumaoru Works</Text>
          <Text style={styles.pageNumber}>
            {itinerary.days.length + (itinerary.transportationDetails ? 4 : 3)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Define the createPdfStyles function
const createPdfStyles = (mode: 'luxury' | 'adventure') => {
  const luxuryColors = {
    primary: '#FFFFFF',
    accent: '#FFD700', // Gold
    background: '#000000',
    link: '#FFD700',
  };

  const adventureColors = {
    primary: '#FF5733',
    accent: '#33FF57',
    background: '#F0F8FF',
    link: '#FF5733',
  };

  const colors = mode === 'luxury' ? luxuryColors : adventureColors;

  return StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      fontSize: 12,
      lineHeight: 1.5,
      color: colors.primary,
      backgroundColor: colors.background,
    },
    coverPage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    coverTitle: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
      color: colors.accent,
    },
    accentBar: {
      width: 100,
      height: 4,
      backgroundColor: colors.accent,
      marginBottom: 10,
    },
    coverSubtitle: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.primary,
    },
    brandText: {
      fontSize: 12,
      color: '#777',
      marginTop: 20,
      textAlign: 'center',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.accent,
    },
    subSectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
      color: colors.accent,
    },
    infoBox: {
      backgroundColor: '#333333',
      padding: 10,
      borderRadius: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    label: {
      fontWeight: 'bold',
      color: colors.accent,
    },
    value: {
      textAlign: 'right',
      color: colors.primary,
    },
    warningText: {
      fontWeight: 'bold',
      marginTop: 10,
      color: colors.accent,
    },
    bulletPoint: {
      marginLeft: 10,
      marginTop: 2,
      color: colors.primary,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 40,
      right: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: {
      fontSize: 10,
      color: '#777',
    },
    pageNumber: {
      fontSize: 10,
      color: '#777',
    },
    hotelCard: {
      flexDirection: 'row',
      marginBottom: 15,
      border: `1pt solid ${colors.accent}`,
      borderRadius: 5,
      overflow: 'hidden',
    },
    hotelImage: {
      width: '40%',
      height: 100,
      objectFit: 'cover',
    },
    hotelInfo: {
      padding: 10,
      width: '60%',
    },
    hotelName: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      color: colors.accent,
    },
    hotelDescription: {
      marginBottom: 5,
      color: colors.primary,
    },
    amenitiesList: {
      marginTop: 5,
    },
    priceInfo: {
      marginTop: 5,
      fontStyle: 'italic',
      color: colors.primary,
    },
    link: {
      marginTop: 5,
      color: colors.link,
      textDecoration: 'underline',
    },
    routeCard: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#444444',
      borderRadius: 5,
    },
    routeType: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.accent,
    },
    routeProvider: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.primary,
    },
    routeDetail: {
      fontSize: 12,
      marginBottom: 3,
      color: colors.primary,
    },
    notesList: {
      marginTop: 5,
    },
    hubCard: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#444444',
      borderRadius: 5,
    },
    hubName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.accent,
    },
    hubType: {
      fontSize: 12,
      marginBottom: 5,
      color: colors.primary,
    },
    hubDetail: {
      fontSize: 12,
      marginBottom: 3,
      color: colors.primary,
    },
    transportOptions: {
      marginTop: 5,
    },
    facilities: {
      marginTop: 5,
    },
    daySection: {
      marginBottom: 10,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.accent,
    },
    timeInfo: {
      fontSize: 12,
      color: '#FFD700',
      marginBottom: 3,
    },
    activityDetails: {
      fontSize: 12,
      marginBottom: 3,
      color: colors.primary,
    },
    costInfo: {
      fontSize: 12,
      fontStyle: 'italic',
      color: '#FFD700',
    },
    mealSection: {
      marginBottom: 10,
    },
    mealTime: {
      fontSize: 12,
      fontWeight: 'bold',
      color: colors.accent,
    },
    mealVenue: {
      fontSize: 12,
      color: colors.accent,
    },
    mealDescription: {
      fontSize: 12,
      marginBottom: 3,
      color: colors.primary,
    },
  });
};
