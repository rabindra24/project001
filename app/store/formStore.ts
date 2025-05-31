import { create } from "zustand";
import {
  FormConfig,
  FormField,
  FormStep,
  ViewMode,
  BuilderTab,
  FormTemplate,
} from "~/types/form";

interface FormStore {
  currentForm: FormConfig | null;
  selectedFieldId: string | null;
  viewMode: ViewMode;
  builderTab: BuilderTab;
  draggedFieldType: string | null;

  // Actions
  setCurrentForm: (form: FormConfig) => void;
  updateForm: (updates: Partial<FormConfig>) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  removeField: (fieldId: string) => void;
  setSelectedField: (fieldId: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setBuilderTab: (tab: BuilderTab) => void;
  setDraggedFieldType: (type: string | null) => void;
  addStep: (step: FormStep) => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  removeStep: (stepId: string) => void;
  saveForm: () => void;
  loadForm: (formId: string) => FormConfig | null;
  createNewForm: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultForm: FormConfig = {
  id: generateId(),
  title: "Untitled Form",
  description: "Form description",
  fields: [],
  steps: [
    {
      id: "step-1",
      title: "Step 1",
      description: "First step",
      fields: [],
    },
  ],
  isMultiStep: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useFormStore = create<FormStore>((set, get) => ({
  currentForm: defaultForm,
  selectedFieldId: null,
  viewMode: "desktop",
  builderTab: "builder",
  draggedFieldType: null,

  setCurrentForm: (form) => set({ currentForm: form }),

  updateForm: (updates) =>
    set((state) => ({
      currentForm: state.currentForm
        ? {
            ...state.currentForm,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),

  addField: (field) =>
    set((state) => {
      if (!state.currentForm) return state;

      const updatedFields = [...state.currentForm.fields, field];

      return {
        currentForm: {
          ...state.currentForm,
          fields: updatedFields,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  updateField: (fieldId, updates) =>
    set((state) => {
      if (!state.currentForm) return state;

      const updatedFields = state.currentForm.fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      );

      return {
        currentForm: {
          ...state.currentForm,
          fields: updatedFields,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  removeField: (fieldId) =>
    set((state) => {
      if (!state.currentForm) return state;

      const updatedFields = state.currentForm.fields.filter(
        (field) => field.id !== fieldId
      );

      return {
        currentForm: {
          ...state.currentForm,
          fields: updatedFields,
          updatedAt: new Date().toISOString(),
        },
        selectedFieldId:
          state.selectedFieldId === fieldId ? null : state.selectedFieldId,
      };
    }),

  setSelectedField: (fieldId) => set({ selectedFieldId: fieldId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setBuilderTab: (tab) => set({ builderTab: tab }),
  setDraggedFieldType: (type) => set({ draggedFieldType: type }),

  addStep: (step) =>
    set((state) => {
      if (!state.currentForm) return state;

      return {
        currentForm: {
          ...state.currentForm,
          steps: [...state.currentForm.steps, step],
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  updateStep: (stepId, updates) =>
    set((state) => {
      if (!state.currentForm) return state;

      const updatedSteps = state.currentForm.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      );

      return {
        currentForm: {
          ...state.currentForm,
          steps: updatedSteps,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  removeStep: (stepId) =>
    set((state) => {
      if (!state.currentForm) return state;

      const updatedSteps = state.currentForm.steps.filter(
        (step) => step.id !== stepId
      );

      return {
        currentForm: {
          ...state.currentForm,
          steps: updatedSteps,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  saveForm: () => {
    const { currentForm } = get();
    if (currentForm) {
      localStorage.setItem(
        `form_${currentForm.id}`,
        JSON.stringify(currentForm)
      );
      localStorage.setItem(
        "form_list",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("form_list") || "[]").filter(
            (id: string) => id !== currentForm.id
          ),
          currentForm.id,
        ])
      );
    }
  },

  loadForm: (formId) => {
    const formData = localStorage.getItem(`form_${formId}`);
    if (formData) {
      const form = JSON.parse(formData);
      set({ currentForm: form });
      return form;
    }
    return null;
  },

  createNewForm: () => {
    const newForm = {
      ...defaultForm,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ currentForm: newForm, selectedFieldId: null });
  },
  loadFormById: (id: string) => {
    const formData = localStorage.getItem(`form-${id}`);
    if (formData) {
      const form = JSON.parse(formData);
      set({ currentForm: form });
    } else {
      alert("Form not found!");
      get().createNewForm();
    }
  },
}));

export function getAllForms(): FormConfig[] {
  const formIds = JSON.parse(
    localStorage.getItem("form_list") || "[]"
  ) as string[];

  return formIds
    .map((id) => {
      const formData = localStorage.getItem(`form_${id}`);
      return formData ? JSON.parse(formData) : null;
    })
    .filter((form) => form !== null);
}
