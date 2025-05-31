export interface FormField {
  id: string;
  type:
    | "text"
    | "textarea"
    | "dropdown"
    | "checkbox"
    | "date"
    | "email"
    | "phone"
    | "number";
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  stepId?: string;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  steps: FormStep[];
  isMultiStep: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  config: Omit<FormConfig, "id" | "createdAt" | "updatedAt">;
}

export type ViewMode = "desktop" | "tablet" | "mobile";
export type BuilderTab = "builder" | "preview" | "settings";
