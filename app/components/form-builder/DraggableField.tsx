import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import { useFormStore } from "~/store/formStore";
import { FormField } from "~/types/form";
import { FieldComponent } from "./FieldComponents";
import { Button } from "~/components/ui/button";

interface DraggableFieldProps {
  field: FormField;
  index: number;
}

export const DraggableField: React.FC<DraggableFieldProps> = ({ field, index }) => {
  const {
    selectedFieldId,
    setSelectedField,
    removeField,
  } = useFormStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  const isSelected = selectedFieldId === field.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected ? "border-blue-500" : ""
      } ${isDragging ? "opacity-50" : ""}`}
      onClick={() => setSelectedField(field.id)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="cursor-grab p-1 rounded" {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">
            Field {index + 1}: {field.type}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation(); 
            removeField(field.id);
          }}
        >
          <X className="h-3 w-3 text-red-500" />
        </Button>
      </div>

      <FieldComponent field={field} preview />
    </div>
  );
};
