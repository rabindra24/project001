import React, { useState } from 'react';
import { useFormStore } from '~/store/formStore';
import { FieldComponent } from './FieldComponents';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type FormField = {
  id: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  [key: string]: any;
};

export const FormPreview: React.FC = () => {
  const { currentForm, viewMode } = useFormStore();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No form to preview
      </div>
    );
  }

  const validateField = (field: FormField, value: unknown): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return 'This field is required';
    }

    const { validation } = field;
    if (validation) {
      if (validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
        return `Minimum length is ${validation.minLength} characters`;
      }

      if (validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
        return `Maximum length is ${validation.maxLength} characters`;
      }

      if (validation.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) {
        return 'Invalid format';
      }
    }

    return null;
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));

    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const fieldsToValidate = currentForm.isMultiStep
      ? currentForm.fields.filter((field: FormField) =>
          currentForm.steps?.[currentStep]?.fields.includes(field.id)
        )
      : currentForm.fields;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    fieldsToValidate.forEach((field: FormField) => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < currentForm.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  const getDeviceClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-md mx-auto';
      default:
        return 'max-w-2xl mx-auto';
    }
  };

  const fieldsToShow = currentForm.isMultiStep
    ? currentForm.fields.filter((field: FormField) =>
        currentForm.steps?.[currentStep]?.fields.includes(field.id)
      )
    : currentForm.fields;

  return (
    <div className={cn('p-6', getDeviceClass())}>
      <div className="rounded-lg border shadow-sm p-6">
        {currentForm.isMultiStep && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                {currentForm.steps?.[currentStep]?.title}
              </h3>
              <span className="text-sm">
                Step {currentStep + 1} of {currentForm.steps.length}
              </span>
            </div>

            <div className="w-full rounded-full h-2 mb-4 bg-gray-200">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentStep + 1) / currentForm.steps.length) * 100}%`,
                }}
              />
            </div>

            {currentForm.steps?.[currentStep]?.description && (
              <p className="text-gray-600 mb-4">
                {currentForm.steps[currentStep].description}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldsToShow.map((field: FormField) => (
            <FieldComponent
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={value => handleFieldChange(field.id, value)}
              error={errors[field.id]}
              preview
            />
          ))}

          <div className="flex justify-between pt-4">
            {currentForm.isMultiStep && currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}

            <div className="ml-auto">
              {currentForm.isMultiStep && currentStep < currentForm.steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
