
'use client';

import { useState, useEffect } from 'react';
import { vehicleData } from '../app/survey/vehicleData';
import ReCaptcha from './ReCaptcha';
import {
  purchaseTypeOptions,
  positiveReasonOptions,
  negativeReasonOptions,
  keyMap,
  monthOptions,
  vehicleConditionOptions,
  cityOptions,
  ageOptions,
  genderOptions,
} from '../app/survey/vehicleData';

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

interface FormData {
  name: string;
  age: string;
  gender: string;
  city: string;
  otherCity: string;
  purchaseTypes: string[];
  brand: string;
  customBrand: string;
  vehicleModel: string;
  customModel: string;
  purchaseMonth: string;
  purchaseYear: string;
  vehicleCondition: string;
  recommendLikelihood: string;
  recommendReasons: string[];
  customReason: string;
  satisfactionLevel: string;
  repurchaseLikelihood: string;
  alternativeBrand: string;
  customAlternativeBrand: string;
  customAlternativeModel: string;
  customAlternativeModelOther: string;
  email: string;
  contactNumber: string;
  recaptchaToken?: string;
}

interface FormErrors {
  name?: string;
  age?: string;
  gender?: string;
  city?: string;
  otherCity?: string;
  purchaseTypes?: string;
  brand?: string;
  customBrand?: string;
  vehicleModel?: string;
  customModel?: string;
  purchaseMonth?: string;
  purchaseYear?: string;
  vehicleCondition?: string;
  recommendLikelihood?: string;
  recommendReasons?: string;
  customReason?: string;
  satisfactionLevel?: string;
  repurchaseLikelihood?: string;
  alternativeBrand?: string;
  customAlternativeBrand?: string;
  customAlternativeModel?: string;
  customAlternativeModelOther?: string;
  email?: string;
  contactNumber?: string;
  form?: string;
}

interface Question {
  id: string;
  component: JSX.Element;
  validate: () => boolean;
  error: () => FormErrors;
  isMultipleChoice?: boolean;
  isSingleChoice?: boolean;
}

export default function VehicleSurveyForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    city: '',
    otherCity: '',
    purchaseTypes: [],
    brand: '',
    customBrand: '',
    vehicleModel: '',
    customModel: '',
    purchaseMonth: '',
    purchaseYear: '',
    vehicleCondition: '',
    recommendLikelihood: '',
    recommendReasons: [],
    customReason: '',
    satisfactionLevel: '',
    repurchaseLikelihood: '',
    alternativeBrand: '',
    customAlternativeBrand: '',
    customAlternativeModel: '',
    customAlternativeModelOther: '',
    email: '',
    contactNumber: '',
    recaptchaToken: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [alternativeBrands, setAlternativeBrands] = useState<string[]>([]);
  const [alternativeModels, setAlternativeModels] = useState<string[]>([]);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(true);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [privacyPolicyAgreed, setPrivacyPolicyAgreed] = useState(false);

  const DEBUG = process.env.PROD === 'false';

  useEffect(() => {
    setFormData({
      name: '',
      age: '',
      gender: '',
      city: '',
      otherCity: '',
      purchaseTypes: [],
      brand: '',
      customBrand: '',
      vehicleModel: '',
      customModel: '',
      purchaseMonth: '',
      purchaseYear: '',
      vehicleCondition: '',
      recommendLikelihood: '',
      recommendReasons: [],
      customReason: '',
      satisfactionLevel: '',
      repurchaseLikelihood: '',
      alternativeBrand: '',
      customAlternativeBrand: '',
      customAlternativeModel: '',
      customAlternativeModelOther: '',
      email: '',
      contactNumber: '',
      recaptchaToken: '',
    });
    setProgress(0);
    setCurrentQuestionIndex(0);
    setErrors({});
    setHasInteracted({});
  }, []);

  const yearOptions = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (DEBUG) {
      console.log('Auto-advance useEffect:', {
        questionId: currentQuestion?.id,
        isSingleChoice: currentQuestion?.isSingleChoice,
        hasInteracted: hasInteracted[currentQuestion?.id],
        formData: {
          purchaseMonth: formData.purchaseMonth,
          purchaseYear: formData.purchaseYear,
          [currentQuestion?.id]: formData[currentQuestion?.id as keyof FormData],
        },
        currentQuestionIndex,
        totalQuestions: questions.length,
      });
    }
    if (currentQuestion?.isSingleChoice && hasInteracted[currentQuestion?.id]) {
      const isValid = currentQuestion.validate();
      if (DEBUG) {
        console.log(`Validation for ${currentQuestion.id}:`, {
          isValid,
          errors: currentQuestion.error(),
          formData: formData[currentQuestion.id as keyof FormData],
        });
      }
      if (isValid) {
        if (
          currentQuestionIndex === 4 &&
          formData.purchaseTypes.includes('10. None of the above')
        ) {
          const newErrors = validate();
          if (Object.keys(newErrors).length === 0) {
            handleSubmit(new Event('submit') as any);
          } else {
            setErrors(newErrors);
            if (DEBUG) console.log('Validation errors on submit:', newErrors);
          }
        } else if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => {
            if (DEBUG) console.log(`Advancing to question ${prev + 1} (${questions[prev + 1]?.id})`);
            return prev + 1;
          });
          setHasInteracted((prev) => ({
            ...prev,
            [questions[currentQuestionIndex + 1]?.id]: false,
          }));
        } else {
          if (DEBUG) console.log('At last question, no auto-advance');
        }
      } else {
        setErrors((prev) => ({ ...prev, ...currentQuestion.error() }));
        if (DEBUG) console.log('Validation failed:', currentQuestion.error());
      }
    }
  }, [formData, currentQuestionIndex, questions, hasInteracted]);

  useEffect(() => {
    const highestPurchaseType =
      formData.purchaseTypes.length > 0
        ? formData.purchaseTypes.reduce((a, b) => {
            const numA = parseInt(a.split('.')[0]) || 0;
            const numB = parseInt(b.split('.')[0]) || 0;
            return numA > numB ? a : b;
          })
        : '';

    if (highestPurchaseType === '10. None of the above') {
      setBrands([]);
      setModels([]);
      setAlternativeBrands([]);
      setAlternativeModels([]);
      setFormData((prev) => ({
        ...prev,
        brand: '',
        customBrand: '',
        vehicleModel: '',
        customModel: '',
        purchaseMonth: '',
        purchaseYear: '',
        vehicleCondition: '',
        alternativeBrand: '',
        customAlternativeBrand: '',
        customAlternativeModel: '',
        customAlternativeModelOther: '',
        recommendLikelihood: '',
        recommendReasons: [],
        satisfactionLevel: '',
        repurchaseLikelihood: '',
      }));
      return;
    }

    if (highestPurchaseType) {
      const key = keyMap[highestPurchaseType] || highestPurchaseType.toLowerCase().replace(/\s+/g, '');
      const newBrands = [...(Object.keys(vehicleData[key] || {}).sort()), 'Other'];
      setBrands(newBrands);
      setAlternativeBrands(newBrands);

      if (!newBrands.includes(formData.brand)) {
        setFormData((prev) => ({
          ...prev,
          brand: '',
          customBrand: '',
          vehicleModel: '',
          customModel: '',
          purchaseMonth: '',
          purchaseYear: '',
          vehicleCondition: '',
        }));
        setModels([]);
      } else {
        const newModels = formData.brand ? [...(vehicleData[key]?.[formData.brand] || []), 'Other'].sort() : [];
        setModels(newModels);
        if (!newModels.includes(formData.vehicleModel)) {
          setFormData((prev) => ({
            ...prev,
            vehicleModel: '',
            customModel: '',
            purchaseMonth: '',
            purchaseYear: '',
            vehicleCondition: '',
          }));
        }
      }

      if (formData.alternativeBrand && newBrands.includes(formData.alternativeBrand)) {
        const altModels = [...(vehicleData[key]?.[formData.alternativeBrand] || []), 'None', 'Other (please specify)'].sort();
        setAlternativeModels(altModels);
      } else {
        setAlternativeModels([]);
        setFormData((prev) => ({
          ...prev,
          alternativeBrand: '',
          customAlternativeBrand: '',
          customAlternativeModel: '',
          customAlternativeModelOther: '',
        }));
      }
    }
  }, [formData.purchaseTypes, formData.brand, formData.alternativeBrand]);

  useEffect(() => {
    const noneSelected = formData.purchaseTypes.includes('10. None of the above');
    const fields = [
      { key: 'name', value: formData.name, required: true },
      { key: 'age', value: formData.age, required: true },
      { key: 'gender', value: formData.gender, required: true },
      { key: 'city', value: formData.city, required: true },
      {
        key: 'otherCity',
        value: formData.city === 'Other' ? formData.otherCity : 'N/A',
        required: formData.city === 'Other',
      },
      {
        key: 'purchaseTypes',
        value: formData.purchaseTypes.length > 0 ? 'filled' : '',
        required: true,
      },
      ...(noneSelected
        ? []
        : [
            { key: 'brand', value: formData.brand, required: true },
            {
              key: 'customBrand',
              value: formData.brand === 'Other' ? formData.customBrand : 'N/A',
              required: formData.brand === 'Other',
            },
            { key: 'vehicleModel', value: formData.vehicleModel, required: true },
            {
              key: 'customModel',
              value: formData.vehicleModel === 'Other' ? formData.customModel : 'N/A',
              required: formData.vehicleModel === 'Other',
            },
            { key: 'purchaseMonth', value: formData.purchaseMonth, required: true },
            { key: 'purchaseYear', value: formData.purchaseYear, required: true },
            { key: 'vehicleCondition', value: formData.vehicleCondition, required: true },
            { key: 'recommendLikelihood', value: formData.recommendLikelihood, required: true },
            {
              key: 'recommendReasons',
              value: formData.recommendReasons.length > 0 ? 'filled' : '',
              required: true,
            },
            {
              key: 'customReason',
              value: formData.recommendReasons.includes('Other') ? formData.customReason : 'N/A',
              required: formData.recommendReasons.includes('Other'),
            },
            { key: 'satisfactionLevel', value: formData.satisfactionLevel, required: true },
            { key: 'repurchaseLikelihood', value: formData.repurchaseLikelihood, required: true },
            { key: 'alternativeBrand', value: formData.alternativeBrand, required: true },
            {
              key: 'customAlternativeBrand',
              value: formData.alternativeBrand === 'Other' ? formData.customAlternativeBrand : 'N/A',
              required: formData.alternativeBrand === 'Other',
            },
            { key: 'customAlternativeModel', value: formData.customAlternativeModel, required: true },
            {
              key: 'customAlternativeModelOther',
              value: formData.customAlternativeModel === 'Other (please specify)' ? formData.customAlternativeModelOther : 'N/A',
              required: formData.customAlternativeModel === 'Other (please specify)',
            },
            { key: 'email', value: formData.email || 'N/A', required: false },
            { key: 'contactNumber', value: formData.contactNumber || 'N/A', required: false },
          ]),
    ];

    const filled = fields.filter(
      (field) => field.required && field.value !== '' && field.value !== 'N/A'
    ).length;
    const totalRequired = fields.filter((field) => field.required).length;
    const progressValue = totalRequired === 0 ? 0 : Math.min(Math.round((filled / totalRequired) * 100), 100);

    if (DEBUG) {
      console.log('Progress calculation:', { filled, totalRequired, progressValue });
    }
    setProgress(progressValue);
  }, [formData]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Please select an age group';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.city) newErrors.city = 'Please select a city';
    if (formData.city === 'Other' && !formData.otherCity.trim())
      newErrors.otherCity = 'Please specify your city';
    if (formData.purchaseTypes.length === 0)
      newErrors.purchaseTypes = 'Please select at least one purchase type';
    if (
      formData.purchaseTypes.length > 0 &&
      !formData.purchaseTypes.includes('10. None of the above')
    ) {
      if (!formData.brand) newErrors.brand = 'Please select a brand';
      if (formData.brand === 'Other' && !formData.customBrand.trim())
        newErrors.customBrand = 'Please specify your brand';
      if (!formData.vehicleModel)
        newErrors.vehicleModel = 'Please select a vehicle model';
      if (formData.vehicleModel === 'Other' && !formData.customModel.trim())
        newErrors.customModel = 'Please specify your model';
      if (!formData.purchaseMonth)
        newErrors.purchaseMonth = 'Please select a purchase month';
      if (!formData.purchaseYear)
        newErrors.purchaseYear = 'Please select a purchase year';
      if (!formData.vehicleCondition)
        newErrors.vehicleCondition = 'Please select vehicle condition';
      if (!formData.recommendLikelihood)
        newErrors.recommendLikelihood = 'Please select a recommendation likelihood';
      if (formData.recommendReasons.length === 0)
        newErrors.recommendReasons = 'Please select at least one reason';
      if (
        formData.recommendReasons.includes('Other') &&
        !formData.customReason.trim()
      )
        newErrors.customReason = 'Please specify your reason';
      if (!formData.satisfactionLevel)
        newErrors.satisfactionLevel = 'Please select a satisfaction level';
      if (!formData.repurchaseLikelihood)
        newErrors.repurchaseLikelihood = 'Please select a repurchase likelihood';
      if (!formData.alternativeBrand)
        newErrors.alternativeBrand = 'Please select an alternative brand';
      if (formData.alternativeBrand === 'Other' && !formData.customAlternativeBrand.trim())
        newErrors.customAlternativeBrand = 'Please specify your alternative brand';
      if (!formData.customAlternativeModel)
        newErrors.customAlternativeModel = 'Please select an alternative model';
      if (
        formData.customAlternativeModel === 'Other (please specify)' &&
        !formData.customAlternativeModelOther.trim()
      )
        newErrors.customAlternativeModelOther = 'Please specify your model';
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Please enter a valid email address';
      if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber))
        newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (DEBUG) console.log('Validate:', newErrors);
    return newErrors;
  };

  const handleReasonCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      recommendReasons: prev.recommendReasons.includes(value)
        ? prev.recommendReasons.filter((reason) => reason !== value)
        : [...prev.recommendReasons, value],
      customReason:
        value === 'Other' && !prev.recommendReasons.includes(value)
          ? ''
          : prev.customReason,
    }));
    setErrors((prev) => ({
      ...prev,
      recommendReasons: undefined,
      customReason: undefined,
      form: undefined,
    }));
    setSubmissionError(null);
    setHasInteracted((prev) => ({
      ...prev,
      recommendReasons: true,
    }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => {
      let newPurchaseTypes;
      if (value === '10. None of the above') {
        newPurchaseTypes = ['10. None of the above'];
      } else {
        newPurchaseTypes = prev.purchaseTypes.includes(value)
          ? prev.purchaseTypes.filter((type) => type !== value)
          : [
              ...prev.purchaseTypes.filter(
                (type) => type !== '10. None of the above'
              ),
              value,
            ];
      }
      return { ...prev, purchaseTypes: newPurchaseTypes };
    });
    setErrors((prev) => ({
      ...prev,
      purchaseTypes: undefined,
      form: undefined,
    }));
    setSubmissionError(null);
    setHasInteracted((prev) => ({
      ...prev,
      purchaseTypes: true,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (DEBUG) console.log(`handleChange: ${name}=${value}`);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'brand' ? { customBrand: '', vehicleModel: '', customModel: '', purchaseMonth: '', purchaseYear: '', vehicleCondition: '' } : {}),
      ...(name === 'vehicleModel' && value !== 'Other' ? { customModel: '' } : {}),
      ...(name === 'brand' && value !== 'Other' ? { customBrand: '' } : {}),
      ...(name === 'alternativeBrand' ? { customAlternativeBrand: '', customAlternativeModel: '', customAlternativeModelOther: '' } : {}),
      ...(name === 'customAlternativeModel' && value !== 'Other (please specify)' ? { customAlternativeModelOther: '' } : {}),
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === 'purchaseMonth' || name === 'purchaseYear'
        ? { purchaseMonth: undefined, purchaseYear: undefined }
        : {}),
      form: undefined,
    }));
    setSubmissionError(null);

    if (
      [
        'age',
        'gender',
        'city',
        'brand',
        'customBrand',
        'vehicleModel',
        'purchaseMonth',
        'purchaseYear',
        'vehicleCondition',
        'recommendLikelihood',
        'satisfactionLevel',
        'repurchaseLikelihood',
        'alternativeBrand',
        'customAlternativeBrand',
        'customAlternativeModel',
      ].includes(name)
    ) {
      setHasInteracted((prev) => ({
        ...prev,
        [name]: !!value,
        ...(name === 'purchaseMonth' || name === 'purchaseYear'
          ? {
              purchaseDate:
                !!((name === 'purchaseMonth' ? value : formData.purchaseMonth) &&
                   (name === 'purchaseYear' ? value : formData.purchaseYear)),
            }
          : {}),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (DEBUG) console.log('Validation errors on submit:', newErrors);
      return;
    }

    try {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.ready(() => {
          if (!window.grecaptcha.execute) {
            return reject(new Error('reCAPTCHA not loaded'));
          }
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'submit_survey' })
            .then(resolve)
            .catch(reject);
        });
      });
      setFormData((prev) => ({ ...prev, recaptchaToken: token }));

      const highestPurchaseType = formData.purchaseTypes.reduce((a, b) => {
        const numA = parseInt(a.split('.')[0]) || 0;
        const numB = parseInt(b.split('.')[0]) || 0;
        return numA > numB ? a : b;
      }, formData.purchaseTypes[0] || '');

      const payload = {
        name: formData.name.trim(),
        age: formData.age,
        gender: formData.gender,
        city: formData.city,
        otherCity: formData.otherCity.trim() || undefined,
        purchaseType: displayVehicleType(highestPurchaseType),
        brand: formData.brand === 'Other' ? formData.customBrand.trim() || 'Other' : formData.brand || undefined,
        vehicleModel: formData.vehicleModel === 'Other' ? formData.customModel.trim() || 'Other' : formData.vehicleModel || undefined,
        purchaseMonth: formData.purchaseMonth || undefined,
        purchaseYear: formData.purchaseYear || undefined,
        vehicleCondition: formData.vehicleCondition || undefined,
        recommendLikelihood: Number(formData.recommendLikelihood) || 0,
        recommendReason: formData.recommendReasons.includes('Other')
          ? [
              ...formData.recommendReasons.filter((r) => r !== 'Other'),
              formData.customReason.trim() || 'Other',
            ]
          : formData.recommendReasons,
        satisfactionLevel: Number(formData.satisfactionLevel) || 0,
        repurchaseLikelihood: Number(formData.repurchaseLikelihood) || 0,
        alternativeBrand: formData.alternativeBrand === 'Other' ? formData.customAlternativeBrand.trim() || 'Other' : formData.alternativeBrand || undefined,
        alternativeVehicle:
          formData.customAlternativeModel === 'Other (please specify)'
            ? formData.customAlternativeModelOther.trim() || 'Other'
            : formData.customAlternativeModel || undefined,
        email: formData.email.trim() || undefined,
        contactNumber: formData.contactNumber.trim() || undefined,
        createdAt: new Date(),
        recaptchaToken: token,
      };
   
      const apiUrl = process.env.NEXT_PUBLIC_PROD==='false'? `${process.env.NEXT_PUBLIC_ALLOWED_ORIGIN_DEV}/api/submit` : `${process.env.NEXT_PUBLIC_ALLOWED_ORIGIN_PROD}/api/submit`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          age: '',
          gender: '',
          city: '',
          otherCity: '',
          purchaseTypes: [],
          brand: '',
          customBrand: '',
          vehicleModel: '',
          customModel: '',
          purchaseMonth: '',
          purchaseYear: '',
          vehicleCondition: '',
          recommendLikelihood: '',
          recommendReasons: [],
          customReason: '',
          satisfactionLevel: '',
          repurchaseLikelihood: '',
          alternativeBrand: '',
          customAlternativeBrand: '',
          customAlternativeModel: '',
          customAlternativeModelOther: '',
          email: '',
          contactNumber: '',
          recaptchaToken: '',
        });
        setBrands([]);
        setModels([]);
        setAlternativeBrands([]);
        setAlternativeModels([]);
        setErrors({});
        setHasInteracted({});
        setProgress(100);
      } else {
        const errorMessage =
          responseData.error ||
          responseData.details ||
          `Submission failed with status ${response.status}`;
        setErrors({ form: errorMessage });
        setSubmissionError(errorMessage);
      }
    } catch (error: any) {
      const errorMessage =
        error.message || 'Submission failed. Please check your network connection and try again.';
      setErrors({ form: errorMessage });
      setSubmissionError(errorMessage);
    }
  };

  const displayVehicleType = (type: string) => {
    return type.replace(/^\d+\.\s*/, '').trim();
  };

  const getRecommendReasons = () => {
    const rating = parseInt(formData.recommendLikelihood || '0');
    return rating >= 7 ? positiveReasonOptions : negativeReasonOptions;
  };

  const highestPurchaseType =
    formData.purchaseTypes.length > 0
      ? displayVehicleType(
          formData.purchaseTypes.reduce((a, b) => {
            const numA = parseInt(a.split('.')[0]) || 0;
            const numB = parseInt(b.split('.')[0]) || 0;
            return numA > numB ? a : b;
          }, formData.purchaseTypes[0])
        )
      : 'vehicle';

  useEffect(() => {
    const noneSelected = formData.purchaseTypes.includes('10. None of the above');

    const baseQuestions: Question[] = [
      {
        id: 'name',
        component: (
          <div className="mb-10 p-6 rounded-lg shadow-md border mt-8 question-border bg-white">
            <label
              htmlFor="name"
              className="block text-black font-semibold text-lg mb-2"
            >{`1. What's your name?`}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border mt-2 rounded-lg ${
                errors.name && hasInteracted.name ? 'border-error' : ''
              }`}
            />
            {errors.name && hasInteracted.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>
        ),
        validate: () => !!formData.name.trim(),
        error: () => ({ name: 'Name is required' }),
      },
      {
        id: 'age',
        component: (
          <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
            <label
              htmlFor="age"
              className="block text-black font-semibold text-lg mb-2"
            >{`2. What's your age group?`}</label>
            <select
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full p-3 border mt-2 rounded-lg text-black ${
                errors.age && hasInteracted.age ? '' : ''
              }`}
            >
              <option value="">Select Age Group</option>
              {ageOptions.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
        ),
        validate: () => !!formData.age,
        error: () => ({ age: 'Please select an age group' }),
        isSingleChoice: true,
      },
      {
        id: 'gender',
        component: (
          <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
            <label
              htmlFor="gender"
              className="block text-black font-semibold text-lg mb-2"
            >{`3. Please select your gender`}</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-3 border mt-2 rounded-lg text-black ${
                errors.gender && hasInteracted.gender ? '' : ''
              }`}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        ),
        validate: () => !!formData.gender,
        error: () => ({ gender: 'Please select a gender ' }),
        isSingleChoice: true,
      },
      {
        id: 'city',
        component: (
          <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question fourteenthquestion-border bg-white">
            <label
              htmlFor="city"
              className="block text-black font-semibold text-lg mb-2"
            >{`4. Which city do you live in?`}</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-3 border mt-2 rounded-lg text-black ${
                errors.city && hasInteracted.city ? '' : ''
              }`}
            >
              <option value="">Select City</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {formData.city === 'Other' && (
              <div className="mt-4">
                <input
                  type="text"
                  id="otherCity"
                  name="otherCity"
                  value={formData.otherCity}
                  onChange={handleChange}
                  placeholder="Please specify"
                  className={`w-full p-3 border rounded-lg text-black ${
                    errors.otherCity && hasInteracted.otherCity ? '' : ''
                  }`}
                />
              </div>
            )}
          </div>
        ),
        validate: () =>
          !!formData.city && (formData.city !== 'Other' || !!formData.otherCity.trim()),
        error: () =>
          !formData.city
            ? { city: 'Please select a city' }
            : { otherCity: 'Please specify your city' },
        isSingleChoice: true,
      },
      {
        id: 'purchaseTypes',
        component: (
          <div className="mb-10 p-6 rounded-lg shadow-md mt-8 border question-border bg-white">
            <label className="block text-black font-semibold text-lg mb-2">{`5. Which of these vehicles do you own?`}</label>
            <div className="flex flex-col gap-3 p-3 mt-2">
              {purchaseTypeOptions.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-4 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.purchaseTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    className={`cursor-pointer ${
                      errors.purchaseTypes && hasInteracted.purchaseTypes ? '' : ''
                    }`}
                  />
                  <span className="text-base text-black">
                    {displayVehicleType(type)}
                  </span>
                </label>
              ))}
            </div>
            {errors.purchaseTypes && hasInteracted.purchaseTypes && (
              <p className="text-error text-xs mt-1">{errors.purchaseTypes}</p>
            )}
          </div>
        ),
        validate: () => formData.purchaseTypes.length > 0,
        error: () => ({
          purchaseTypes: 'Please select at least one purchase type',
        }),
        isMultipleChoice: true,
      },
    ];

    if (
      formData.purchaseTypes.length > 0 &&
      !formData.purchaseTypes.includes('10. None of the above')
    ) {
      setQuestions([
        ...baseQuestions,
        {
          id: 'brand',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="brand"
                className="block text-black font-semibold text-lg mb-2"
              >{`6. Which brand of ${highestPurchaseType} do you own?`}</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full p-3 border mt-2 rounded-lg text-black ${
                  errors.brand && hasInteracted.brand ? '' : ''
                }`}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {formData.brand === 'Other' && (
                <div className="mt-4">
                  <input
                    type="text"
                    id="customBrand"
                    name="customBrand"
                    value={formData.customBrand}
                    onChange={handleChange}
                    placeholder="Please specify your brand"
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.customBrand && hasInteracted.brand ? '' : ''
                    }`}
                  />
                </div>
              )}
            </div>
          ),
          validate: () =>
            !!formData.brand &&
            (formData.brand !== 'Other' || !!formData.customBrand.trim()),
          error: () =>
            !formData.brand
              ? { brand: 'Please select a brand' }
              : { customBrand: 'Please specify your brand' },
          isSingleChoice: true,
        },
        {
          id: 'vehicleModel',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="vehicleModel"
                className="block text-black font-semibold text-lg mb-2"
              >{`7. Which model of ${formData.brand === 'Other' ? formData.customBrand || highestPurchaseType : formData.brand || highestPurchaseType} do you own?`}</label>
              <select
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className={`w-full p-3 border mt-2 rounded-lg text-black ${
                  errors.vehicleModel && hasInteracted.vehicleModel ? '' : ''
                }`}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {formData.vehicleModel === 'Other' && (
                <div className="mt-4">
                  <input
                    type="text"
                    id="customModel"
                    name="customModel"
                    value={formData.customModel}
                    onChange={handleChange}
                    placeholder="Please specify your model"
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.customModel && hasInteracted.vehicleModel ? '' : ''
                    }`}
                  />
                </div>
              )}
            </div>
          ),
          validate: () =>
            !!formData.vehicleModel &&
            (formData.vehicleModel !== 'Other' || !!formData.customModel.trim()),
          error: () =>
            !formData.vehicleModel
              ? { vehicleModel: 'Please select a vehicle model' }
              : { customModel: 'Please specify your model' },
          isSingleChoice: true,
        },
        {
          id: 'purchaseDate',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="purchaseMonth"
                className="block text-black font-semibold text-lg mb-2"
              >{`8. When did you purchase your ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : highestPurchaseType
              }?`}</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <select
                    id="purchaseMonth"
                    name="purchaseMonth"
                    value={formData.purchaseMonth}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.purchaseMonth && hasInteracted.purchaseMonth ? '' : ''
                    }`}
                  >
                    <option value="">Select Month</option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    id="purchaseYear"
                    name="purchaseYear"
                    value={formData.purchaseYear}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.purchaseYear && hasInteracted.purchaseYear ? '' : ''
                    }`}
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ),
          validate: () => {
            const isValid = !!formData.purchaseMonth && !!formData.purchaseYear;
            if (DEBUG) console.log('purchaseDate validate:', { purchaseMonth: formData.purchaseMonth, purchaseYear: formData.purchaseYear, isValid });
            return isValid;
          },
          error: () => ({
            purchaseMonth: !formData.purchaseMonth ? 'Please select a purchase month' : undefined,
            purchaseYear: !formData.purchaseYear ? 'Please select a purchase year' : undefined,
          }),
          isSingleChoice: true,
        },
        {
          id: 'vehicleCondition',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="vehicleCondition"
                className="block text-black font-semibold text-lg mb-2"
              >{`9. Was your ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : highestPurchaseType
              } purchased brand new or used?`}</label>
              <select
                id="vehicleCondition"
                name="vehicleCondition"
                value={formData.vehicleCondition}
                onChange={handleChange}
                className={`w-full p-3 border mt-2 rounded-lg text-black ${
                  errors.vehicleCondition && hasInteracted.vehicleCondition ? '' : ''
                }`}
              >
                <option value="">Select Condition</option>
                {vehicleConditionOptions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          ),
          validate: () => !!formData.vehicleCondition,
          error: () => ({ vehicleCondition: 'Please select vehicle condition' }),
          isSingleChoice: true,
        },
        {
          id: 'recommendLikelihood',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="recommendLikelihood"
                className="block text-black font-semibold text-lg mb-2"
              >{`10. How likely are you to recommend your ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : 'vehicle'
              } to friends or family?`}</label>
              <div className="mt-2">
                <input
                  type="range"
                  id="recommendLikelihood"
                  name="recommendLikelihood"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.recommendLikelihood || '0'}
                  onChange={handleChange}
                  className={`w-full cursor-pointer ${
                    errors.recommendLikelihood && hasInteracted.recommendLikelihood ? 'error' : ''
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>😞 Not Likely</span>
                  <span>😊 Very Likely</span>
                </div>
                <div className="grid grid-cols-11 gap-2 mt-2 text-base text-gray-600 text-center">
                  {Array.from({ length: 11 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        parseInt(formData.recommendLikelihood || '0') === i
                          ? 'font-bold text-primary'
                          : ''
                      }
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <div className="text-center text-base text-black mt-2">
                  Selected: {formData.recommendLikelihood || '0'}
                </div>
              </div>
            </div>
          ),
          validate: () => !!formData.recommendLikelihood,
          error: () => ({ recommendLikelihood: 'Please select a recommendation likelihood' }),
          isSingleChoice: true,
        },
        {
          id: 'recommendReasons',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label className="block text-black font-semibold text-lg mb-2">{`11. What are the reasons for your rating of ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : 'your vehicle'
              }?`}</label>
              <div className="flex flex-col gap-3 p-3 mt-2">
                {getRecommendReasons().map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.recommendReasons.includes(reason)}
                      onChange={() => handleReasonCheckboxChange(reason)}
                      className={`cursor-pointer ${
                        errors.recommendReasons && hasInteracted.recommendReasons ? '' : ''
                      }`}
                    />
                    <span className="text-base text-black">{reason}</span>
                  </label>
                ))}
              </div>
              {formData.recommendReasons.includes('Other') && (
                <div className="mt-4">
                  <input
                    type="text"
                    id="customReason"
                    name="customReason"
                    value={formData.customReason}
                    onChange={handleChange}
                    placeholder="Please specify your reason"
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.customReason && hasInteracted.customReason ? '' : ''
                    }`}
                  />
                </div>
              )}
              {errors.recommendReasons && hasInteracted.recommendReasons && (
                <p className="text-error text-xs mt-1">{errors.recommendReasons}</p>
              )}
            </div>
          ),
          validate: () =>
            formData.recommendReasons.length > 0 &&
            (!formData.recommendReasons.includes('Other') || !!formData.customReason.trim()),
          error: () =>
            formData.recommendReasons.length === 0
              ? { recommendReasons: 'Please select at least one reason' }
              : { customReason: 'Please specify your reason' },
          isMultipleChoice: true,
        },
        {
          id: 'satisfactionLevel',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="satisfactionLevel"
                className="block text-black font-semibold text-lg mb-2"
              >{`12. How satisfied are you with your ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : 'your vehicle'
              }?`}</label>
              <div className="mt-2">
                <input
                  type="range"
                  id="satisfactionLevel"
                  name="satisfactionLevel"
                  min="0"
                  max="5"
                  step="1"
                  value={formData.satisfactionLevel || '0'}
                  onChange={handleChange}
                  className={`w-full cursor-pointer ${
                    errors.satisfactionLevel && hasInteracted.satisfactionLevel ? 'error' : ''
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>😞 Very Dissatisfied</span>
                  <span>😊 Very Satisfied</span>
                </div>
                <div className="grid grid-cols-6 gap-2 mt-2 text-base text-gray-600 text-center">
                  {Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        parseInt(formData.satisfactionLevel || '0') === i
                          ? 'font-bold text-primary'
                          : ''
                      }
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <div className="text-center text-base text-black mt-2">
                  Selected: {formData.satisfactionLevel || '0'}
                </div>
              </div>
            </div>
          ),
          validate: () => !!formData.satisfactionLevel,
          error: () => ({ satisfactionLevel: 'Please select a satisfaction level' }),
          isSingleChoice: true,
        },
        {
          id: 'repurchaseLikelihood',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="repurchaseLikelihood"
                className="block text-black font-semibold text-lg mb-2"
              >{`13. How likely are you to repurchase a vehicle from ${
                formData.brand === 'Other' ? formData.customBrand || 'this brand' : formData.brand || 'this brand'
              }?`}</label>
              <div className="mt-2">
                <input
                  type="range"
                  id="repurchaseLikelihood"
                  name="repurchaseLikelihood"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.repurchaseLikelihood || '0'}
                  onChange={handleChange}
                  className={`w-full cursor-pointer ${
                    errors.repurchaseLikelihood && hasInteracted.repurchaseLikelihood ? 'error' : ''
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>😞 Not Likely</span>
                  <span>😊 Very Likely</span>
                </div>
                <div className="grid grid-cols-11 gap-2 mt-2 text-base text-gray-600 text-center">
                  {Array.from({ length: 11 }, (_, i) => (
                    <span
                      key={i}
                      className={
                        parseInt(formData.repurchaseLikelihood || '0') === i
                          ? 'font-bold text-primary'
                          : ''
                      }
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <div className="text-center text-base text-black mt-2">
                  Selected: {formData.repurchaseLikelihood || '0'}
                </div>
              </div>
            </div>
          ),
          validate: () => !!formData.repurchaseLikelihood,
          error: () => ({ repurchaseLikelihood: 'Please select a repurchase likelihood' }),
          isSingleChoice: true,
        },
        {
          id: 'alternativeBrand',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label
                htmlFor="alternativeBrand"
                className="block text-black font-semibold text-lg mb-2"
              >{`14. Which alternative vehicle did you consider when purchasing your ${
                formData.brand && formData.vehicleModel
                  ? `${formData.brand === 'Other' ? formData.customBrand || 'Other' : formData.brand} ${formData.vehicleModel === 'Other' ? formData.customModel || 'Other' : formData.vehicleModel}`
                  : highestPurchaseType
              }?`}</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <select
                    id="alternativeBrand"
                    name="alternativeBrand"
                    value={formData.alternativeBrand}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.alternativeBrand && hasInteracted.alternativeBrand ? '' : ''
                    }`}
                  >
                    <option value="">Select Alternative Brand</option>
                    {alternativeBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {formData.alternativeBrand === 'Other' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        id="customAlternativeBrand"
                        name="customAlternativeBrand"
                        value={formData.customAlternativeBrand}
                        onChange={handleChange}
                        placeholder="Please specify your brand"
                        className={`w-full p-3 border rounded-lg text-black ${
                          errors.customAlternativeBrand && hasInteracted.customAlternativeBrand ? '' : ''
                        }`}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <select
                    id="customAlternativeModel"
                    name="customAlternativeModel"
                    value={formData.customAlternativeModel}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.customAlternativeModel && hasInteracted.customAlternativeModel ? '' : ''
                    }`}
                  >
                    <option value="">Select Alternative Model</option>
                    {alternativeModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {formData.customAlternativeModel === 'Other (please specify)' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        id="customAlternativeModelOther"
                        name="customAlternativeModelOther"
                        value={formData.customAlternativeModelOther}
                        onChange={handleChange}
                        placeholder="Please specify your model"
                        className={`w-full p-3 border rounded-lg text-black ${
                          errors.customAlternativeModelOther && hasInteracted.customAlternativeModelOther ? '' : ''
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
          validate: () =>
            !!formData.alternativeBrand &&
            (formData.alternativeBrand !== 'Other' || !!formData.customAlternativeBrand.trim()) &&
            !!formData.customAlternativeModel &&
            (formData.customAlternativeModel !== 'Other (please specify)' || !!formData.customAlternativeModelOther.trim()),
          error: () =>
            !formData.alternativeBrand
              ? { alternativeBrand: 'Please select an alternative brand' }
              : formData.alternativeBrand === 'Other' && !formData.customAlternativeBrand.trim()
              ? { customAlternativeBrand: 'Please specify your alternative brand' }
              : !formData.customAlternativeModel
              ? { customAlternativeModel: 'Please select an alternative model' }
              : { customAlternativeModelOther: 'Please specify your model' },
          isSingleChoice: true,
        },
        {
          id: 'contactDetails',
          component: (
            <div className="mb-10 p-6 rounded-lg mt-8 shadow-md border question-border bg-white">
              <label className="block text-black font-semibold text-lg mb-2">{`15. Please provide your contact details (optional)`}</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.email && hasInteracted.email ? '' : ''
                    }`}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full p-3 border rounded-lg text-black ${
                      errors.contactNumber && hasInteracted.contactNumber ? '' : ''
                    }`}
                  />
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Providing your contact details is optional and will only be used to follow up on your survey responses if necessary.
              </p>
            </div>
          ),
          validate: () => {
            if (
              formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
            ) {
              return false;
            }
            if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
              return false;
            }
            return true;
          },
          error: () => ({
            email: formData.email ? 'Please enter a valid email address' : undefined,
            contactNumber: formData.contactNumber ? 'Please enter a valid 10-digit phone number' : undefined,
          }),
        },
      ]);
    } else {
      setQuestions(baseQuestions);
    }
    if (DEBUG) console.log('Questions updated:', questions.map((q) => q.id));
  }, [
    formData,
    errors,
    brands,
    models,
    alternativeBrands,
    alternativeModels,
    highestPurchaseType,
  ]);

  const validateCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion?.validate()) {
      return currentQuestion?.error() || {};
    }
    return {};
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (DEBUG) console.log('handleNext called:', { currentQuestionIndex, questionId: questions[currentQuestionIndex]?.id });

    setHasInteracted((prev) => ({
      ...prev,
      [questions[currentQuestionIndex]?.id]: true,
    }));

    const questionErrors = validateCurrentQuestion();
    if (Object.keys(questionErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...questionErrors }));
      if (DEBUG) console.log('Validation errors on Next:', questionErrors);
      return;
    }

    if (currentQuestionIndex === 4) {
      if (formData.purchaseTypes.length === 0) {
        setErrors((prev) => ({
          ...prev,
          purchaseTypes: 'Please select at least one purchase type',
        }));
        if (DEBUG) alert('Error: No purchase type selected');
        return;
      }
      if (formData.purchaseTypes.includes('10. None of the above')) {
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
          if (DEBUG) alert('Submitting form for "None of the above"');
          handleSubmit(new Event('submit') as any);
        } else {
            setErrors(newErrors);
            if (DEBUG) console.log('Validation errors on submit (None selected):', newErrors);
          }
        return;
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => {
        if (DEBUG) console.log(`Advancing to question ${prev + 1} (${questions[prev + 1]?.id})`);
        return prev + 1;
      });
      setHasInteracted((prev) => ({
        ...prev,
        [questions[currentQuestionIndex + 1]?.id]: false,
      }));
    }
  };

  const handleAgree = () => {
    setShowModal(false);
    setShowSurvey(true);
  };

  const handleDisagree = () => {
    setShowModal(false);
    setShowThankYou(true);
  };

  const shouldShowSubmitButton = () => {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isNoneSelected = formData.purchaseTypes.includes('10. None of the above');
    const show = (isLastQuestion && !isNoneSelected) || (currentQuestionIndex === 4 && isNoneSelected);
    if (DEBUG)
      console.log('shouldShowSubmitButton:', { isLastQuestion, isNoneSelected, show });
    return show;
  };

  const shouldShowNextButton = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isNoneSelected = formData.purchaseTypes.includes('10. None of the above');
    const show =
      (!currentQuestion?.isSingleChoice || currentQuestion?.id === 'purchaseDate') &&
      !isLastQuestion &&
      !(currentQuestionIndex === 4 && isNoneSelected);
    if (DEBUG)
      console.log('shouldShowNextButton:', {
        currentQuestionId: currentQuestion?.id,
        isSingleChoice: currentQuestion?.isSingleChoice,
        isLastQuestion,
        isNoneSelected,
        show,
      });
    return show;
  };

  if (showThankYou || submitted) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="max-w-4xl mx-auto p-6 flex justify-between items-center w-full sm:flex-col sm:gap-4 sm:items-center mt-8">
            <div className="w-[250px] sm:w-full">
              <h1 className="text-2xl font-bold text-gray-500 sm:ml-auto ml-5">
                Vehicle Ownership Survey
              </h1>
              <div className="progress-container mt-2">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill bg-primary"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <p className="progress-label text-gray-500">
                  You have completed 100%
                </p>
              </div>
            </div>
            <div className="p-2 rounded-lg ml-auto sm:ml-auto">
              <img src="/minsurveylogosvg.svg" alt="Logo" className="h-12" />
            </div>
          </div>
        </div>
        <div className="text-center space-y-4 p-6 bg-white rounded-lg shadow-md border question-border mt-8">
          <p className="text-lg text-green-500 font-medium">
            Thank You for Your Feedback!
          </p>
          <p className="text-lg text-green-500">
            We sincerely appreciate your time and interest.
          </p>
          <p className="text-lg text-green-500">
            Your action has been successfully completed, and we are grateful for
            your support!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <div className="flex justify-between items-start w-full modal-header">
              <div className="mt-4">
                <img src="/minsurveylogosvg.svg" alt="MintSurvey Logo" className="h-12" />
              </div>
              <div className="text-right text-gray-600 text-xs">
                <p>Company Name: MintSurvey</p>
                <p>
                  E-19, #630, Innovations Park, <br /> Arkere, BG Road, <br />{" "}
                  Bengaluru – 560076, Karnataka
                </p>
                <p>
                  Email: <a href="mailto:admin@mintsurvey.com" className="underline text-primary hover:text-secondary-color">admin@mintsurvey.com</a>
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-black mt-6 text-center">
              <hr />
              <br />
              Vehicle Ownership Survey
            </h2>
            <br />
            <p className="text-gray-600 mt-4 mb-4">
              MintSurvey is conducting a short survey to better understand vehicle ownership habits, preferences, and experiences. Your insights will help inform industry research and improve products and services in the automotive sector.
            </p>
            <h3 className="text-lg font-semibold text-black mb-2 bg-gray-50 p-4 rounded-lg">Your Privacy Matters</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 p-4 rounded-lg">
              <li>This survey is fully GDPR compliant.</li>
              <li>All your responses will remain strictly confidential.</li>
              <li>No personally identifiable information will be shared with third parties.</li>
              <li>The data collected will be used only for research purposes.</li>
            </ul>
            <h3 className="text-lg font-semibold text-black mb-2 bg-gray-50 p-4 rounded-lg">Quick & Easy</h3>
            <ul className="list-disc list-inside text-gray-600 mb-4 ml-4 p-4 rounded-lg">
              <li>The survey will take less than 5 minutes to complete.</li>
              <li>There are no right or wrong answers — we just want your honest opinion.</li>
            </ul>
            <h3 className="text-lg font-semibold text-black mb-4 bg-gray-50 p-4 rounded-lg">Your Participation Helps</h3>
            <p className="text-gray-600 mb-6">
              Your input contributes to a better understanding of real-world vehicle ownership experiences and helps shape improvements across the industry.
            </p>
            <div className="flex items-center modal-checkbox mb-6">
              <input
                type="checkbox"
                id="privacyPolicyAgree"
                onChange={(e) => setPrivacyPolicyAgreed(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="privacyPolicyAgree" className="text-gray-600 text-base">
                I confirm that I have read and understood the{' '}
                <a
                  href="/privacypolicy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary hover:text-secondary-color"
                >
                  Privacy Policy
                </a>
                , and I agree to its terms.
              </label>
            </div>
            <div className="flex justify-end modal-buttons">
              <button
                onClick={handleAgree}
                disabled={!privacyPolicyAgreed}
                className={`px-4 py-2 rounded-lg text-white ${
                  privacyPolicyAgreed
                    ? 'bg-primary hover:bg-primary-color'
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
              >
                Agree
              </button>
              <button
                onClick={handleDisagree}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-primary-color"
              >
                Disagree
              </button>
            </div>
          </div>
        </div>
      )}
      {showSurvey && (
        <>
          <ReCaptcha />
          <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="max-w-4xl mx-auto p-6 flex justify-between items-center w-full sm:flex-col sm:items-center survey-header">
              <div className="w-[250px] sm:w-full">
                <hr className="horizontal-line" />
                <h1 className="survey-title">
                  Vehicle Ownership Survey
                </h1>
                <div className="progress-container mt-2">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill bg-primary"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="progress-label text-gray-500">
                    You have completed {progress}%
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-lg ml-auto sm:ml-auto">
                <img src="/minsurveylogosvg.svg" alt="Logo" className="h-12" />
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="mt-24">
            {questions.slice(0, currentQuestionIndex + 1).map((question) => (
              <div key={question.id}>{question.component}</div>
            ))}
            {(errors.form || submissionError) && (
              <div className="mb-10 p-6 rounded-lg shadow-md border question-border bg-gray-50">
                <p className="text-error text-xs text-center">
                  {submissionError || errors.form}
                </p>
              </div>
            )}
            <div className="flex justify-end form-buttons mt-6">
              {shouldShowNextButton() && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-color"
                >
                  Next
                </button>
              )}
              {shouldShowSubmitButton() && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-color"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </main>
  );
}
