import React from 'react';
import {
  Calendar,
  Hotel,
  Utensils,
  Car,
  Map,
  ArrowLeft,
  CreditCard,
  Printer,
  Share2,
  Download,
  Camera,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Itinerary } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

import { generateAndDownloadPDF } from '../utils/pdf-utils';
import { shareToSocialMedia } from '../utils/share-utils';

// Add state for share modal

interface Props {
  itinerary: Itinerary;
  onBack: () => void;
}

export function ItineraryView({ itinerary, onBack }: Props) {
  const { mode, colors } = useTheme();
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [activeDay, setActiveDay] = React.useState(1);

  const formatLocalPrice = (price: number) => {
    if (!itinerary.localCurrency) return formatCurrency(price);

    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: itinerary.localCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return `${formatted} (${formatCurrency(
      price / itinerary.localCurrency.exchangeRate
    )})`;
  };

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return time;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async (
    platform?: 'instagram' | 'facebook' | 'twitter'
  ) =>  {
    try {
      if (platform) {
        await shareToSocialMedia(itinerary, mode, platform);
        setIsShareModalOpen(false); // Close modal after sharing
      } else {
        setIsShareModalOpen(true); // Just open the modal when no platform is specified
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('There was an error sharing your itinerary. Please try again.');
    }
  };

  const ShareModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4 border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-xl font-semibold ${
              mode === 'luxury' ? 'text-gold' : 'text-adventure-500'
            }`}
          >
            Share Itinerary
          </h3>
          {/* <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button> */}
        </div>

        <div className="space-y-4">
          {/* Instagram */}
          <button
            onClick={() => handleShare('instagram')}
            className="w-full p-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Share to Instagram
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="w-full p-4 rounded-lg bg-[#1877F2] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Share to Facebook
          </button>

          {/* Twitter */}
          <button
            onClick={() => handleShare('twitter')}
            className="w-full p-4 rounded-lg bg-[#1DA1F2] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Share to Twitter
          </button>
        </div>

        <button
          onClick={() => setIsShareModalOpen(false)}
          className="mt-6 w-full p-4 rounded-lg border border-gray-700 text-gray-300 font-medium hover:border-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const handleDownload = async () => {
    try {
      await generateAndDownloadPDF(itinerary, mode);
    } catch (error) {
      // Handle error - maybe show a toast notification
      console.error('Failed to generate PDF:', error);
    }
  };

  return (
    <div className="w-full max-w-5xl animate-fadeIn">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Search</span>
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
          onClick={() => handleShare()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Share2 size={18} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Destination Header */}
      <div
        className={`bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 transition-colors hover:border-${
          mode === 'luxury' ? 'gold' : 'adventure-500'
        } mb-8`}
      >
        <div className="relative h-64">
          <img
            src={itinerary.destination.imageUrl}
            alt={itinerary.destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
            <div className="absolute bottom-6 left-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {itinerary.destination.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <Map size={20} />
                <span>{itinerary.destination.country}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>
            Trip Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Duration</span>
              <span className="text-gray-200">{itinerary.duration} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Budget</span>
              <span className="text-gray-200">
                {formatLocalPrice(itinerary.preferences.budgetPerDay)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Travel Style</span>
              <span className="text-gray-200 capitalize">
                {itinerary.preferences.travelStyle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Group Size</span>
              <span className="text-gray-200">
                {itinerary.preferences.groupSize} people
              </span>
            </div>
          </div>
        </div>

        {itinerary.recommendedDuration && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>
              Recommended Stay
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Optimal Duration</span>
                <span className="text-gray-200">
                  {itinerary.recommendedDuration.optimal} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Suggested Range</span>
                <span className="text-gray-200">
                  {itinerary.recommendedDuration.minimum}-
                  {itinerary.recommendedDuration.maximum} days
                </span>
              </div>
              {itinerary.recommendedDuration.note && (
                <p className="text-gray-400 text-sm mt-2">
                  {itinerary.recommendedDuration.note}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Essential Information */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className={colors.primary} size={20} />
          <h2 className={`text-xl font-semibold ${colors.primary}`}>
            Essential Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Travel Requirements
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Visa</h4>
                <p className="text-sm text-gray-400">
                  {itinerary.essentialInfo.visaRequirements}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-300 mb-2">Vaccinations</h4>
                <ul className="list-disc list-inside text-sm text-gray-400">
                  {itinerary.essentialInfo.vaccinations.map(
                    (vaccine, index) => (
                      <li key={index}>{vaccine}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Police</span>
                <span className="text-gray-200">
                  {itinerary.essentialInfo.emergencyContacts.police}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ambulance</span>
                <span className="text-gray-200">
                  {itinerary.essentialInfo.emergencyContacts.ambulance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tour Operator</span>
                <span className="text-gray-200">
                  {itinerary.essentialInfo.emergencyContacts.tourOperator}
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Accommodation Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Hotel className={colors.primary} size={20} />
          <h2 className={`text-xl font-semibold ${colors.primary}`}>
            {mode === 'luxury' ? 'Luxury Stays' : 'Places to Stay'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {itinerary.accommodationOptions.map((option) => (
            <div
              key={option.id}
              className="p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-semibold ${colors.primary}`}>
                  {option.name}
                </h3>
                {/* <div className="flex items-center text-sm text-gray-400">
                  <CreditCard size={16} className="mr-2" />
                  <span>{formatLocalPrice(option.pricePerNight)}/night</span>
                </div> */}
              </div>

              <p className="text-gray-400 mb-4">{option.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {option.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              {option.bookingUrl && (
                <a
                  href={option.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center text-sm ${colors.primary} hover:${colors.secondary} transition-colors`}
                >
                  Book Now <ArrowLeft size={16} className="ml-1 rotate-180" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transportation Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Car className={colors.primary} size={20} />
          <h2 className={`text-xl font-semibold ${colors.primary}`}>
            Getting Around
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transport Services */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Available Services
            </h3>
            <div className="space-y-4">
              {itinerary.transportInfo.taxiServices.map((service, index) => (
                <div
                  key={index}
                  className="border-b border-gray-800 last:border-0 pb-4 last:pb-0"
                >
                  <h4 className="font-medium text-gray-300 mb-1">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {service.description}
                  </p>
                  <div className="text-sm text-gray-400">
                    Price Range: {formatLocalPrice(service.priceRange.min)} -{' '}
                    {formatLocalPrice(service.priceRange.max)}
                  </div>
                  {service.bookingUrl && (
                    <a
                      href={service.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm ${colors.primary} hover:${colors.secondary} transition-colors mt-2 inline-block`}
                    >
                      Book Service →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Average Costs & Public Transport */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Average Costs
              </h3>
              <div className="space-y-3">
                {itinerary.transportInfo.averageCosts.map((cost, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="text-gray-400">
                      <div>{cost.type}</div>
                      {cost.notes && (
                        <div className="text-xs text-gray-500">
                          {cost.notes}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-200">
                      {formatLocalPrice(cost.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {itinerary.transportInfo.publicTransport && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-lg font-medium text-gray-200 mb-4">
                  Public Transportation
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Day Pass Cost</span>
                    <span className="text-gray-200">
                      {formatLocalPrice(
                        itinerary.transportInfo.publicTransport.dayPassCost
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-2">
                      Available Options:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.transportInfo.publicTransport.options.map(
                        (option, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
                          >
                            {option}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold ${colors.primary} mb-6`}>
          Daily Itinerary
        </h2>

        {/* Day Selector */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {itinerary.days.map((day) => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors whitespace-nowrap ${
                activeDay === day.day
                  ? mode === 'luxury'
                    ? 'bg-gold text-black border-gold'
                    : 'bg-adventure-500 text-black border-adventure-500'
                  : 'border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>

        {/* Active Day Details */}
        {itinerary.days.find((day) => day.day === activeDay) && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Activities */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">
                  Activities
                </h3>
                <div className="space-y-4">
                  {itinerary.days
                    .find((day) => day.day === activeDay)
                    ?.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-800 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-300">
                            {activity.name}
                          </h4>
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-400">
                              {formatTime(activity.startTime)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.duration}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {activity.description}
                        </p>
                        <div className="flex flex-wrap gap-2 my-2">
                          {activity.photoSpot && (
                            <span className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
                              <Camera size={12} />
                              Photo Spot
                            </span>
                          )}
                          {activity.weatherDependent && (
                            <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
                              Weather Dependent
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
                            {activity.intensity} intensity
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-400">
                            {formatLocalPrice(activity.cost)}
                          </span>
                          {activity.bookingUrl && (
                            <a
                              href={activity.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${colors.primary} hover:${colors.secondary} transition-colors`}
                            >
                              Book Now →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Meals */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Dining</h3>
                <div className="space-y-4">
                  {itinerary.days
                    .find((day) => day.day === activeDay)
                    ?.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-800 last:border-0 pb-4 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-300">
                            {meal.venue}
                          </h4>
                          <span className="text-sm text-gray-400">
                            {meal.time}
                          </span>
                        </div>
                        {meal.description && (
                          <p className="text-sm text-gray-400 mb-2">
                            {meal.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 my-2">
                          <span className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300">
                            {meal.cuisine}
                          </span>
                          {meal.dietaryOptions?.map((option, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-800 rounded-full text-gray-300"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-400">
                            {formatLocalPrice(meal.priceRange.min)} -{' '}
                            {formatLocalPrice(meal.priceRange.max)}
                          </span>
                          {meal.bookingUrl && (
                            <a
                              href={meal.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm ${colors.primary} hover:${colors.secondary} transition-colors`}
                            >
                              Make Reservation →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Transportation */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">
                  Transportation
                </h3>
                <ul className="space-y-2">
                  {itinerary.days
                    .find((day) => day.day === activeDay)
                    ?.transportation.map((transport, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Car size={16} className={`${colors.primary} mt-1`} />
                        <span className="text-gray-300">{transport}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Notes */}
              {itinerary.days.find((day) => day.day === activeDay)?.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-200">Notes</h3>
                  <ul className="space-y-2">
                    {itinerary.days
                      .find((day) => day.day === activeDay)
                      ?.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className={`${colors.primary} mt-1`}>•</span>
                          <span className="text-gray-300">{note}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seasonal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>
            Weather & Climate
          </h2>
          <div className="space-y-3">
            <div className="text-gray-300">
              {itinerary.seasonalInfo.weather}
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Best Time to Visit</span>
              <span className="text-gray-200">
                {itinerary.seasonalInfo.bestTimeToVisit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Peak Season</span>
              <span className="text-gray-200">
                {itinerary.seasonalInfo.peakTouristSeason}
              </span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className={`text-xl font-semibold ${colors.primary} mb-4`}>
            Cost Breakdown
          </h2>
          <div className="space-y-3">
            {itinerary.costBreakdown.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-400">{item.category}</span>
                <span className="text-gray-200">
                  {formatLocalPrice(item.amount)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-800 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-300">Total Cost</span>
                <span className="text-gray-200">
                  {formatLocalPrice(itinerary.costBreakdown.totalCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bottom-6 right-6 flex gap-3 print:hidden">
        <button
          onClick={onBack}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            mode === 'luxury'
              ? 'bg-black/50 hover:bg-black/70 text-gold'
              : 'bg-black/50 hover:bg-black/70 text-adventure-500'
          }`}
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={handlePrint}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            mode === 'luxury'
              ? 'bg-black/50 hover:bg-black/70 text-gold'
              : 'bg-black/50 hover:bg-black/70 text-adventure-500'
          }`}
        >
          <Printer size={20} />
        </button>

        <button
          onClick={handleShare}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            mode === 'luxury'
              ? 'bg-black/50 hover:bg-black/70 text-gold'
              : 'bg-black/50 hover:bg-black/70 text-adventure-500'
          }`}
        >
          <Share2 size={20} />
        </button>

        <button
          onClick={handleDownload}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            mode === 'luxury'
              ? 'bg-black/50 hover:bg-black/70 text-gold'
              : 'bg-black/50 hover:bg-black/70 text-adventure-500'
          }`}
        >
          <Download size={20} />
        </button>
      </div>
      {isShareModalOpen && <ShareModal />}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          
          body {
            background: white;
            color: black;
          }
          
          .container {
            max-width: none;
            padding: 0;
          }
          
          button {
            display: none;
          }
          
          a {
            text-decoration: none;
            color: inherit;
          }
          
          img {
            max-width: 100%;
            height: auto;
          }
          
          .bg-gray-900 {
            background: white;
            border: 1px solid #eee;
          }
          
          .text-gray-300,
          .text-gray-400 {
            color: #333;
          }
        }
      `}</style>
    </div>
  );
}
