import { NextResponse } from 'next/server';
import SurveyResponse from '../../models/SurveyResponse';
import { connectToDatabase } from '@/lib/mongoose';

export async function POST(request: Request) {
  try {
  await connectToDatabase();
    const data = await request.json();
  

    // Define required fields based on whether purchaseType is 'None of the above'
    const baseRequiredFields = ['name', 'age', 'gender', 'city', 'purchaseType'];
    const vehicleRequiredFields = [
      'brand',
      'vehicleModel',
      'purchaseMonth',
      'purchaseYear',
      'vehicleCondition',
      'recommendLikelihood',
      'satisfactionLevel',
      'repurchaseLikelihood',
      'alternativeBrand',
      'alternativeVehicle',
    ];

    // Check if purchaseType is 'None of the above'
    const isNoneSelected = data.purchaseType === 'None of the above';
    const requiredFields = isNoneSelected
      ? [...baseRequiredFields, ...(data.city === 'Other' ? ['otherCity'] : [])]
      : [
          ...baseRequiredFields,
          ...(data.city === 'Other' ? ['otherCity'] : []),
          ...vehicleRequiredFields,
          ...(data.vehicleModel === 'Other' ? ['customModel'] : []),
          ...(data.recommendReason.includes('Other') ? ['customReason'] : []),
          ...(data.alternativeBrand === 'Other' ? ['customAlternativeBrand'] : []),
          ...(data.alternativeVehicle === 'Other (please specify)' ? ['customAlternativeModelOther'] : []),
        ];

    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined || data[field] === null || (typeof data[field] === 'string' && data[field].trim() === '')
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          details: `Missing or empty required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate email and contactNumber if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid payload', details: 'Invalid email format' },
        { status: 400 }
      );
    }
    if (data.contactNumber && !/^\d{10}$/.test(data.contactNumber)) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          details: 'Contact number must be a 10-digit number',
        },
        { status: 400 }
      );
    }

    const surveyResponse = new SurveyResponse(data);
    await surveyResponse.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Submission failed', details: errorMessage },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectToDatabase();
    const responses = await SurveyResponse.find({});
    return NextResponse.json(responses, { status: 200 });
  } catch (error) {
    console.error('Error fetching survey responses:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch survey responses', details: errorMessage },
      { status: 500 }
    );
  }
}