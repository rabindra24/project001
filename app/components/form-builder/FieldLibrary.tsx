
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FormField } from '~/types/form';

interface FieldTypeProps {
  type: string;
  label: string;
  icon: string;
}

const FieldType: React.FC<FieldTypeProps> = ({ type, label, icon }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `field-type-${type}`,
    data: { type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        flex items-center space-x-3 p-3 border rounded-lg cursor-grab  transition-colors
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const FieldLibrary: React.FC = () => {
  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'textarea', label: 'Textarea', icon: '📄' },
    { type: 'email', label: 'Email', icon: '✉️' },
    { type: 'phone', label: 'Phone', icon: '📞' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'dropdown', label: 'Dropdown', icon: '📋' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'date', label: 'Date', icon: '📅' },
  ];

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4">Field Types</h3>
      {fieldTypes.map((fieldType) => (
        <FieldType
          key={fieldType.type}
          type={fieldType.type}
          label={fieldType.label}
          icon={fieldType.icon}
        />
      ))}
    </div>
  );
};
