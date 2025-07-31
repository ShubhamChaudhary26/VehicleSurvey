import mongoose, { Schema, Document } from 'mongoose';

interface ISurveyResponse extends Document {
  industry: string;
  customIndustry?: string;
  name: string;
  age: string;
  gender: string;
  city: string;
  otherCity?: string;
  purchaseType: string;
  brand?: string;
  vehicleModel?: string;
  customModel?: string;
  purchaseMonth?: string;
  purchaseYear?: string;
  vehicleCondition?: string;
  recommendLikelihood: number;
  recommendReason: string[];
  customReason?: string;
  satisfactionLevel: number;
  repurchaseLikelihood: number;
  alternativeBrand?: string;
  customAlternativeBrand?: string;
  alternativeVehicle?: string;
  customAlternativeModelOther?: string;
  email?: string;
  contactNumber?: string;
  createdAt: Date;
}

const SurveyResponseSchema = new Schema<ISurveyResponse>({
  industry: { type: String, required: true },
  customIndustry: { type: String },
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  city: { type: String, required: true },
  otherCity: { type: String },
  purchaseType: { type: String, required: true },
  brand: { type: String },
  vehicleModel: { type: String },
  customModel: { type: String },
  purchaseMonth: { type: String },
  purchaseYear: { type: String },
  vehicleCondition: { type: String },
  recommendLikelihood: { type: Number, required: true },
  recommendReason: { type: [String], default: [] },
  customReason: { type: String },
  satisfactionLevel: { type: Number, required: true },
  repurchaseLikelihood: { type: Number, required: true },
  alternativeBrand: { type: String },
  customAlternativeBrand: { type: String },
  alternativeVehicle: { type: String },
  customAlternativeModelOther: { type: String },
  email: { type: String },
  contactNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.SurveyResponse || mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);