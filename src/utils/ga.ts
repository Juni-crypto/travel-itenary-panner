// src/utils/ga.ts
export const GA_TRACKING_ID = 'G-QEC3MH14E2'; // Replace with your GA Measurement ID

// Function to send events
export const sendGAEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log(window.gtag)
  } else {
    console.warn('GA tracking not initialized');
  }
};
