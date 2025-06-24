import mongoose, { Schema, Document } from 'mongoose';

interface ISurveyResponse extends Document {
  name: string;
  age: string;
  gender: string;
  city: string;
  otherCity?: string;
  purchaseType: string;
  brand?: string;
  vehicleModel?: string;
  recommendLikelihood: number;
  recommendReason: string;
  satisfactionLevel: number;
  repurchaseLikelihood: number;
  alternativeVehicle: string;
  createdAt: Date;
}

const SurveyResponseSchema = new Schema<ISurveyResponse>({
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  city: { type: String, required: true },
  otherCity: { type: String },
  purchaseType: { type: String, required: true },
  brand: { type: String },
  vehicleModel: { type: String },
  recommendLikelihood: { type: Number, required: true },
  recommendReason: { type: String },
  satisfactionLevel: { type: Number, required: true },
  repurchaseLikelihood: { type: Number, required: true },
  alternativeVehicle: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SurveyResponse || mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);