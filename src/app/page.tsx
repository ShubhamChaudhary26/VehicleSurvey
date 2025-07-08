import VehicleSurveyForm from '@/component/VehicleSurveyForm'
import React from 'react'

export const metadata = {
  title: 'MintSurvey - Vehicle Ownership Survey',
  description: 'Participate in MintSurvey Vehicle Ownership Survey to share your experience and help shape the future of mobility.',
  keywords: ['vehicle', 'survey', 'form', 'feedback'],
  openGraph: {
  title: 'MintSurvey - Vehicle Ownership Survey',
  description: 'Participate in MintSurvey Vehicle Ownership Survey to share your experience and help shape the future of mobility.',
  url: 'https://www.micollectionapp.com/',
  type: 'website',
  images: [
    {
      url: 'https://www.micollectionapp.com/MintSurveyLogo.png', // ✅ Full URL to image
      width: 1200,
      height: 630,
      alt: 'MintSurvey - Vehicle Ownership Survey',
    },
  ],
},
};

const page = () => {
  return (
    <div><VehicleSurveyForm/></div>
  )
}

export default page