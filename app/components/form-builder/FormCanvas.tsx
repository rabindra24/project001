import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "~/store/formStore";
import { DraggableField } from "./DraggableField";

const DroppableArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] space-y-3 transition-colors ${
        isOver ? " border-2 border-dashed border-blue-300" : ""
      }`}
    >
      {children}
    </div>
  );
};

export const FormCanvas: React.FC = () => {
  const { currentForm } = useFormStore();

  if (!currentForm) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No form selected
      </div>
    );
  }

  return (
    <div className="p-6  rounded-lg border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold ">{currentForm.title}</h2>
        <p className="">{currentForm.description}</p>
      </div>

      <DroppableArea>
        {currentForm.fields.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Drag fields from the library to start building your form
            </p>
          </div>
        ) : (
          <SortableContext
            items={currentForm.fields.map((field: any) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {currentForm.fields.map((field: any, index: any) => (
              <DraggableField key={field.id} field={field} index={index} />
            ))}
          </SortableContext>
        )}
      </DroppableArea>
    </div>
  );
};
