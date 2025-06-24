import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongoose';
import SurveyResponse from '../../models/SurveyResponse';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const surveyResponse = new SurveyResponse(data);
    await surveyResponse.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving survey response:', error);
    return NextResponse.json({ error: 'Submission failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}