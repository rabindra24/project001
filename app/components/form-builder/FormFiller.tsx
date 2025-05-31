import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FieldComponent } from './FieldComponents';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { FormConfig } from '~/types/form';

export const FormFiller: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const savedForm = localStorage.getItem(`form_${id}`);
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, [id]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validate = () => {
    const visibleFields = form?.isMultiStep
      ? form.fields.filter(f => form.steps[step].fields.includes(f.id))
      : form?.fields || [];

    const newErrors: Record<string, string> = {};
    visibleFields.forEach(f => {
      const val = formData[f.id];
      if (f.required && !val) newErrors[f.id] = 'Required';
      if (f.validation?.minLength && val?.length < f.validation.minLength)
        newErrors[f.id] = `Min ${f.validation.minLength} chars`;
      if (f.validation?.maxLength && val?.length > f.validation.maxLength)
        newErrors[f.id] = `Max ${f.validation.maxLength} chars`;
      if (f.validation?.pattern && !new RegExp(f.validation.pattern).test(val))
        newErrors[f.id] = 'Invalid format';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !form) return;

    const prevSubmissions = JSON.parse(localStorage.getItem(`submissions_${form.id}`) || '[]');
    prevSubmissions.push({ data: formData, submittedAt: new Date().toISOString() });
    localStorage.setItem(`submissions_${form.id}`, JSON.stringify(prevSubmissions));

    setSubmitted(true);
  };

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold">Form Not Found</h2>
            <p>The form you're looking for doesn't exist or was removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <h2 className="text-xl font-semibold">Thank You!</h2>
            <p>Your form has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const visibleFields = form.isMultiStep
    ? form.fields.filter(f => form.steps[step].fields.includes(f.id))
    : form.fields;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && <p className="text-gray-600">{form.description}</p>}
          </CardHeader>

          <CardContent>
            {form.isMultiStep && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1">{form.steps[step].title}</h3>
                <div className="bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${((step + 1) / form.steps.length) * 100}%` }}
                  />
                </div>
                {form.steps[step].description && (
                  <p className="text-gray-600 mb-4">{form.steps[step].description}</p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {visibleFields.map(field => (
                <FieldComponent
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(val) => handleChange(field.id, val)}
                  error={errors[field.id]}
                  preview
                />
              ))}

              <div className="flex justify-between pt-4">
                {form.isMultiStep && step > 0 && (
                  <Button type="button" onClick={() => setStep(s => s - 1)} variant="outline">
                    Previous
                  </Button>
                )}

                <div className="ml-auto">
                  {form.isMultiStep && step < form.steps.length - 1 ? (
                    <Button type="button" onClick={() => validate() && setStep(s => s + 1)}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
