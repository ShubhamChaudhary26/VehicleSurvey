'use client';

import VehicleSurveyForm from '@/component/VehicleSurveyForm'; // ✅ correct import

// Define metadata for the page
export const metadata = {
  title: 'Vehicle Survey Form',
  description: 'Fill out the vehicle survey form to provide your feedback.',
  keywords: ['vehicle', 'survey', 'form', 'feedback'],
  openGraph: {
    title: 'Vehicle Survey Form',
    description: 'Participate in our vehicle survey to share your experience.',
    url: 'https://yourdomain.com/surveyform', // Replace with your actual domain
    type: 'website',
  },
};

export default function SurveyPage() {
  return <VehicleSurveyForm />;
}