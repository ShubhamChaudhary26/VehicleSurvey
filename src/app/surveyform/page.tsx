

import VehicleSurveyForm from '@/component/VehicleSurveyForm'; // ✅ correct import

// Define metadata for the page
export const metadata = {
  title: 'MintSurvey - Vehicle Ownership Survey',
  description: 'Participate in MintSurvey Vehicle Ownership Survey to share your experience.',
  keywords: ['vehicle', 'survey', 'form', 'feedback'],
  openGraph: {
  title: 'MintSurvey - Vehicle Ownership Survey',
  description: 'Participate in MintSurvey Vehicle Ownership Survey to share your experience.',
  url: 'https://www.micollectionapp.com/',
  type: 'website',
  images: [
    {
      url: 'https://www.micollectionapp.com/MintSurveyLogo.png', // ✅ Full URL to image
      // width: 1200,
      // height: 630,
      alt: 'MintSurvey - Vehicle Ownership Survey',
    },
  ],
},
};

export default function SurveyPage() {
  return <VehicleSurveyForm />;
}