import React from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// Importing components and state from our project
import { useFormStore } from "~/store/formStore";
import { FieldLibrary } from "./FieldLibrary";
import { FormCanvas } from "./FormCanvas";
import { FieldEditor } from "./FieldEditor";
import { FormPreview } from "./FormPreview";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ModeToggle } from "./mode-toggle";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
// This is the main component
export const FormBuilder: React.FC = () => {
  // Getting state and functions from our custom store
  const {
    builderTab,
    setBuilderTab,
    saveForm,
    createNewForm,
    currentForm,
    addField,
  } = useFormStore();

  // Setting up sensors to detect dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Function that runs when a drag ends
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Make sure we dropped the field on the right place
    if (!over || !currentForm) return;

    // If we're dragging a new field from the side to the form area
    if (
      active.id.toString().startsWith("field-type-") &&
      over.id === "form-canvas"
    ) {
      const fieldType = active.data.current?.type;

      if (fieldType) {
        // Create a new field object
        const newField = {
          id: `field-${Date.now()}`, // Unique ID
          type: fieldType,
          label: `${fieldType} Field`,
          placeholder: `Enter ${fieldType}`,
          required: false,
          helpText: "",
          ...(fieldType === "dropdown" && {
            options: ["Option 1", "Option 2", "Option 3"],
          }),
        };

        addField(newField); // Add field to form
      }
    }
  };

  // Function to save the form
  const handleSave = () => {
    saveForm();
    alert("Form saved!");
  };

  return (
    <div className="h-screen">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Form Builder</h1>
          <div className="flex space-x-2">
            <ModeToggle />
            <Button variant="outline" onClick={createNewForm}>
              New Form
            </Button>
            <Button onClick={handleSave}>Save Form</Button>
          </div>
        </div>
      </div>

      {/* Tabs for switching between builder, preview, and settings */}
      <Tabs value={builderTab} onValueChange={setBuilderTab} className="h-full">
        <div className="border-b px-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        {/* Builder tab content */}
        <TabsContent value="builder" className="h-full m-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex h-full">
              {/* Left sidebar: field library */}
              <div className="w-64 border-r p-4 overflow-y-auto">
                <FieldLibrary />
              </div>

              {/* Middle area: form canvas */}
              <div className="flex-1 p-6 overflow-y-auto">
                <FormCanvas />
              </div>

              {/* Right sidebar: edit selected field */}
              <div className="w-80 border-l p-4 overflow-y-auto">
                <FieldEditor />
              </div>
            </div>
          </DndContext>
        </TabsContent>

        {/* Preview tab content */}
        <TabsContent value="preview" className="h-full m-0">
          <div className="h-full">
            <div className="border-b px-6 py-4">
              {/* Here you can change view mode (mobile, tablet, desktop) */}
              <ViewModeSelector />
            </div>
            <div className="overflow-y-auto h-full">
              <FormPreview />
            </div>
          </div>
        </TabsContent>

        {/* Settings tab content */}
        <TabsContent value="settings" className="h-full m-0">
          <div className="p-6 overflow-y-auto max-w-2xl">
            {/* You can edit title, description, share URL, etc. */}
            <FormSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// This component lets you choose between desktop, tablet, and mobile preview
const ViewModeSelector = () => {
  const { viewMode, setViewMode } = useFormStore();

  return (
    <div className="flex space-x-2">
      <Button
        variant={viewMode === "desktop" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("desktop")}
      >
        Desktop
      </Button>
      <Button
        variant={viewMode === "tablet" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("tablet")}
      >
        Tablet
      </Button>
      <Button
        variant={viewMode === "mobile" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("mobile")}
      >
        Mobile
      </Button>
    </div>
  );
};


const FormSettings: React.FC = () => {
  const { currentForm, updateForm } = useFormStore();

  if (!currentForm) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={currentForm.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={currentForm.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="multi-step"
              checked={currentForm.isMultiStep}
              onCheckedChange={(checked) =>
                updateForm({ isMultiStep: checked })
              }
            />
            <Label htmlFor="multi-step">Multi-step form</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label>Form ID</Label>
              <Input value={currentForm.id} readOnly />
            </div>
            <div>
              <Label>Shareable URL</Label>
              <Input
                value={`${window.location.origin}/form/${currentForm.id}`}
                readOnly
              />
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/form/${currentForm.id}`
                );
                alert("URL copied to clipboard!");
              }}
            >
              Copy Share URL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
