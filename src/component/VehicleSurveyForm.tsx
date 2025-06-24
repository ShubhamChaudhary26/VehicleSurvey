
'use client';

import { useState, useEffect } from 'react';
import { vehicleData } from '../app/survey/vehicleData';
import { Smile } from 'lucide-react';

interface FormData {
  name: string;
  age: string;
  gender: string;
  city: string;
  otherCity: string;
  purchaseType: string;
  brand: string;
  vehicleModel: string;
  recommendLikelihood: string;
  recommendReason: string;
  satisfactionLevel: string;
  repurchaseLikelihood: string;
  alternativeVehicle: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  gender?: string;
  city?: string;
  otherCity?: string;
  purchaseType?: string;
  brand?: string;
  vehicleModel?: string;
  recommendLikelihood?: string;
  recommendReason?: string;
  satisfactionLevel?: string;
  repurchaseLikelihood?: string;
  alternativeVehicle?: string;
  form?: string;
}

export default function VehicleSurveyForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    city: '',
    otherCity: '',
    purchaseType: '',
    brand: '',
    vehicleModel: '',
    recommendLikelihood: '',
    recommendReason: '',
    satisfactionLevel: '',
    repurchaseLikelihood: '',
    alternativeVehicle: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const DEBUG = true;

  const keyMap: Record<string, string> = {
    'Scooter/Moped': '2-wheeler',
    'Motorcycle/Bike': '2-wheeler',
    '3 Wheeler': '3-wheeler',
    'Cars/SUVs': 'cars',
    Tractor: 'tractor',
    Truck: 'truck',
    Pickups: 'pickups',
    Trailer: 'trailer',
    'Earthmoving Vehicle': 'earthmoving vehicle',
    Buses: 'buses',
  };

  useEffect(() => {
    if (formData.purchaseType && formData.purchaseType !== 'None') {
      const key = keyMap[formData.purchaseType] || formData.purchaseType.toLowerCase().replace(/ /g, '');
      const newBrands = Object.keys(vehicleData[key] || {});
      setBrands(newBrands);
      if (!newBrands.includes(formData.brand)) {
        setFormData((prev) => ({ ...prev, brand: '', vehicleModel: '' }));
        setModels([]);
      } else {
        const newModels = vehicleData[key]?.[formData.brand] || [];
        setModels(newModels);
        if (!newModels.includes(formData.vehicleModel)) {
          setFormData((prev) => ({ ...prev, vehicleModel: '' }));
        }
      }
    } else {
      setBrands([]);
      setModels([]);
      setFormData((prev) => ({ ...prev, brand: '', vehicleModel: '' }));
    }
  }, [formData.purchaseType, formData.brand]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Please select an age group';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.city) newErrors.city = 'Please select a city';
    if (formData.city === 'Other' && !formData.otherCity) newErrors.otherCity = 'Please enter a city name';
    if (!formData.purchaseType) newErrors.purchaseType = 'Please select a purchase option';
    if (formData.purchaseType !== 'None' && !formData.brand) newErrors.brand = 'Please select a brand';
    if (formData.purchaseType !== 'None' && !formData.vehicleModel) newErrors.vehicleModel = 'Please select a vehicle model';
    if (!formData.recommendLikelihood) newErrors.recommendLikelihood = 'Please select a recommendation likelihood';
    if (!formData.recommendReason) newErrors.recommendReason = 'Please provide a reason';
    if (!formData.satisfactionLevel) newErrors.satisfactionLevel = 'Please select a satisfaction level';
    if (!formData.repurchaseLikelihood) newErrors.repurchaseLikelihood = 'Please select a repurchase likelihood';
    if (!formData.alternativeVehicle) newErrors.alternativeVehicle = 'Please enter an alternative vehicle';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    setSubmissionError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (DEBUG) console.log('Validation errors:', newErrors);
      return;
    }

    const payload = {
      ...formData,
      recommendLikelihood: Number(formData.recommendLikelihood),
      satisfactionLevel: Number(formData.satisfactionLevel),
      repurchaseLikelihood: Number(formData.repurchaseLikelihood),
    };

    if (DEBUG) console.log('Submitting payload:', payload);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/submit';
      if (DEBUG) console.log('Fetching URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (DEBUG) console.log('Response status:', response.status, 'Response headers:', Object.fromEntries(response.headers));

      if (response.ok) {
        if (DEBUG) console.log('Form Data Submitted:', formData);
        setSubmitted(true);
        setFormData({
          name: '',
          age: '',
          gender: '',
          city: '',
          otherCity: '',
          purchaseType: '',
          brand: '',
          vehicleModel: '',
          recommendLikelihood: '',
          recommendReason: '',
          satisfactionLevel: '',
          repurchaseLikelihood: '',
          alternativeVehicle: '',
        });
        setBrands([]);
        setModels([]);
        setErrors({});
      } else {
        const errorData = await response.json();
        if (DEBUG) console.error('API submission failed:', errorData);
        const errorMessage = errorData.details || `Submission failed with status ${response.status}`;
        setErrors({ form: errorMessage });
        setSubmissionError(errorMessage);
      }
    } catch (error: any) {
      if (DEBUG) console.error('Submission error:', error.message || error);
      const errorMessage = 'Submission failed. Please check your network connection and try again.';
      setErrors({ form: errorMessage });
      setSubmissionError(errorMessage);
    }
  };

  if (submitted) {
    return (
      <main className="container mx-auto p-4 sm:p-6 min-h-screen bg-gray-100" style={{ color: '#0e4d89' }}>
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200">
          <p className="text-lg sm:text-xl text-green-600 text-center">Thank You for Your Feedback!</p>
          <p className="text-lg sm:text-xl text-green-600 text-center mt-2">
            We sincerely appreciate your time and interest.
          </p>
          <p className="text-lg sm:text-xl text-green-600 text-center mt-2">
            Your action has been successfully completed, and we are grateful for your support!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 min-h-screen bg-gray-100" style={{ color: '#0e4d89' }}>
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#0e4d89' }}>
          Vehicle Purchase Survey
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="name" className="block text-base sm:text-lg font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="age" className="block text-base sm:text-lg font-medium mt-10">Age</label>
            <select
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            >
              <option value="">Select Age</option>
              {['18-24', '25-34', '35-44', '45-54', '55 and Above'].map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
            {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="gender" className="block text-base sm:text-lg font-medium mt-10">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.gender ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            >
              <option value="">Select Gender</option>
              {['Male', 'Female'].map((gender) => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-base sm:text-lg font-medium mt-10">City</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            >
              <option value="">Select City</option>
              {['Mumbai', 'Delhi and NCR', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Lucknow', 'Other'].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
          </div>

          {formData.city === 'Other' && (
            <div>
              <label htmlFor="otherCity" className="block text-base sm:text-lg font-medium">Other City</label>
              <input
                type="text"
                id="otherCity"
                name="otherCity"
                value={formData.otherCity}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.otherCity ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
              />
              {errors.otherCity && <p className="text-sm text-red-500 mt-1">{errors.otherCity}</p>}
            </div>
          )}

          <div>
            <label htmlFor="purchaseType" className="block text-base sm:text-lg font-medium mt-10">Most Recent Purchase for Personal Use</label>
            <select
              id="purchaseType"
              name="purchaseType"
              value={formData.purchaseType}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.purchaseType ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            >
              <option value="">Select Purchase Type</option>
              {['Scooter/Moped', 'Motorcycle/Bike', '3 Wheeler', 'Cars/SUVs', 'Tractor', 'Truck', 'Pickups', 'Trailer', 'Earthmoving Vehicle', 'Buses', 'None'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.purchaseType && <p className="text-sm text-red-500 mt-1">{errors.purchaseType}</p>}
          </div>

          {formData.purchaseType !== 'None' && (
            <>
              <div>
                <label htmlFor="brand" className="block text-base sm:text-lg font-medium mt-10">Brand</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.brand ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
              </div>

              <div>
                <label htmlFor="vehicleModel" className="block text-base sm:text-lg font-medium mt-10">Vehicle Model</label>
                <select
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.vehicleModel ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
                >
                  <option value="">Select Model</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                {errors.vehicleModel && <p className="text-sm text-red-500 mt-1">{errors.vehicleModel}</p>}
              </div>
            </>
          )}

          <div>
            <label htmlFor="recommendLikelihood" className="block text-base sm:text-lg font-medium mt-10">
              How likely are you to recommend your current vehicle brand to friends or family?
            </label>
            <div className="mt-3">
              <div className="relative flex items-center">
                <input
                  type="range"
                  id="recommendLikelihood"
                  name="recommendLikelihood"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.recommendLikelihood || '0'}
                  onChange={handleChange}
                  className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#087dba] focus:outline-none focus:ring-2 focus:ring-[#087dba] transition-colors ${errors.recommendLikelihood ? 'border-red-500' : ''}`}
                  onMouseDown={(e) => (e.target as HTMLInputElement).classList.add('ring-2', 'ring-[#087dba]')}
                  onMouseUp={(e) => (e.target as HTMLInputElement).classList.remove('ring-2', 'ring-[#087dba]')}
                />
                <div className="absolute w-full flex justify-between text-sm sm:text-base mt-8">
                  {/* <span >0 Not Likely</span>
                  <span>10 Very Likely</span> */}
                </div>
              </div>
              <div className="flex justify-between text-sm sm:text-base mt-2">
                {Array.from({ length: 11 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-gray-600 ${parseInt(formData.recommendLikelihood || '0') === i ? 'font-bold text-[#087dba]' : ''}`}
                  >
                    {i}
                  </span>
                ))}
              </div>
              <div className="text-center mt-2 text-sm sm:text-base text-gray-700">
                Selected: {formData.recommendLikelihood || '0'}
              </div>
            </div>
            {errors.recommendLikelihood && <p className="text-sm text-red-500 mt-2">{errors.recommendLikelihood}</p>}
          </div>

          <div>
            <label htmlFor="recommendReason" className="block text-base sm:text-lg font-medium mt-10">Please tell me the reason for your rating</label>
            <textarea
              id="recommendReason"
              name="recommendReason"
              value={formData.recommendReason}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.recommendReason ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
              rows={4}
            />
            {errors.recommendReason && <p className="text-sm text-red-500 mt-1">{errors.recommendReason}</p>}
          </div>

          <div>
            <label className="block text-base sm:text-lg font-medium mt-10">Please rate your satisfaction level for your chosen vehicle</label>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { value: '0', label: '😞 0 Very Dissatisfied' },
                { value: '1', label: '😣 1' },
                { value: '2', label: '😕 2' },
                { value: '3', label: '😐 3' },
                { value: '4', label: '🙂 4' },
                { value: '5', label: '😊 5 Very Satisfied' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="radio"
                      name="satisfactionLevel"
                      value={value}
                      checked={formData.satisfactionLevel === value}
                      onChange={handleChange}
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-[#087dba] checked:border-[#0e4d89] focus:outline-none focus:ring-2 focus:ring-[#087dba] transition-colors cursor-pointer checked:before:content-[''] checked:before:absolute checked:before:inset-0 checked:before:m-auto checked:before:h-2 checked:before:w-2 checked:before:bg-white checked:before:rounded-full"
                    />
                  </div>
                  <span className="text-sm sm:text-base">{label}</span>
                </label>
              ))}
            </div>
            {errors.satisfactionLevel && <p className="text-sm text-red-500 mt-2">{errors.satisfactionLevel}</p>}
          </div>

          <div>
            <label className="block text-base sm:text-lg font-medium mt-10">How likely are you to repurchase your vehicle again?</label>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { value: '0', label: '😞 0 Extremely Unlikely' },
                { value: '1', label: '😣 1' },
                { value: '2', label: '😕 2' },
                { value: '3', label: '😐 3' },
                { value: '4', label: '🙂 4' },
                { value: '5', label: '😊 5 Extremely Likely' },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="radio"
                      name="repurchaseLikelihood"
                      value={value}
                      checked={formData.repurchaseLikelihood === value}
                      onChange={handleChange}
                      className="appearance-none h-5 w-5 border-2 border-gray-300 rounded-full checked:bg-[#087dba] checked:border-[#0e4d89] focus:outline-none focus:ring-2 focus:ring-[#087dba] transition-colors cursor-pointer checked:before:content-[''] checked:before:absolute checked:before:inset-0 checked:before:m-auto checked:before:h-2 checked:before:w-2 checked:before:bg-white checked:before:rounded-full"
                    />
                  </div>
                  <span className="text-sm sm:text-base">{label}</span>
                </label>
              ))}
            </div>
            {errors.repurchaseLikelihood && <p className="text-sm text-red-500 mt-2">{errors.repurchaseLikelihood}</p>}
          </div>

          <div>
            <label htmlFor="alternativeVehicle" className="block text-base sm:text-lg font-medium mt-10">Which was the closest alternative vehicle you considered while purchasing this vehicle</label>
            <input
              type="text"
              id="alternativeVehicle"
              name="alternativeVehicle"
              value={formData.alternativeVehicle}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 sm:p-3 border rounded-md ${errors.alternativeVehicle ? 'border-red-500' : 'border-gray-300'} focus:ring focus:ring-opacity-50 focus:ring-[#087dba]`}
            />
            {errors.alternativeVehicle && <p className="text-sm text-red-500 mt-1">{errors.alternativeVehicle}</p>}
          </div>

          {(errors.form || submissionError) && (
            <p className="text-sm text-red-500 text-center mt-4">{submissionError || errors.form}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#0e4d89] text-white py-2 sm:py-3 px-4 rounded-md hover:bg-[#087dba] transition-colors text-base sm:text-lg font-semibold"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}