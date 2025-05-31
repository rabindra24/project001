
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '~/store/formStore';
import { formTemplates } from '~/data/templates';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

export const TemplateSelector: React.FC = () => {
  const { setCurrentForm } = useFormStore();
  const navigate = useNavigate();

  const loadTemplate = (templateId: string) => {
    const template = formTemplates.find(t => t.id === templateId);
    if (template) {
      const newForm = {
        ...template.config,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCurrentForm(newForm);
      navigate('/builder');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {formTemplates.map(template => (
        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {template.config.fields.length} fields
              </span>
              <Button 
                size="sm" 
                onClick={() => loadTemplate(template.id)}
              >
                Use Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
