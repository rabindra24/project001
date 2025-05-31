import React from "react";
import { useFormStore } from "~/store/formStore";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "~/components/ui/card";

export const FieldEditor: React.FC = () => {
  const { currentForm, selectedFieldId, updateField } = useFormStore();

  const selectedField = currentForm?.fields.find(
    (field: any) => field.id === selectedFieldId
  );

  if (!selectedField) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Select a field to edit its properties.</p>
        </CardContent>
      </Card>
    );
  }

  const updateProperty = (key: string, value: any) => {
    updateField(selectedField.id, { [key]: value });
  };

  const updateValidation = (key: string, value: any) => {
    updateField(selectedField.id, {
      validation: {
        ...selectedField.validation,
        [key]: value,
      },
    });
  };

  const addOption = () => {
    const options = [...(selectedField.options || []), "New Option"];
    updateField(selectedField.id, { options });
  };

  const changeOption = (index: number, value: string) => {
    const options = [...(selectedField.options || [])];
    options[index] = value;
    updateField(selectedField.id, { options });
  };

  const deleteOption = (index: number) => {
    const options = (selectedField.options || []).filter(
      (_: any, i: number) => i !== index
    );
    updateField(selectedField.id, { options });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(e) => updateProperty("label", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ""}
            onChange={(e) => updateProperty("placeholder", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) => updateProperty("required", checked)}
          />
          <Label htmlFor="field-required">Required</Label>
        </div>

        <div>
          <Label htmlFor="field-help">Help Text</Label>
          <Textarea
            id="field-help"
            value={selectedField.helpText || ""}
            onChange={(e) => updateProperty("helpText", e.target.value)}
            rows={2}
          />
        </div>

        {selectedField.type === "dropdown" && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {selectedField.options?.map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => changeOption(index, e.target.value)}
                    placeholder="Option text"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteOption(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addOption}>
                Add Option
              </Button>
            </div>
          </div>
        )}

        {(selectedField.type === "text" || selectedField.type === "textarea") && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium">Validation</h4>
            <div>
              <Label htmlFor="min-length">Min Length</Label>
              <Input
                id="min-length"
                type="number"
                value={selectedField.validation?.minLength || ""}
                onChange={(e) =>
                  updateValidation("minLength", parseInt(e.target.value) || undefined)
                }
              />
            </div>
            <div>
              <Label htmlFor="max-length">Max Length</Label>
              <Input
                id="max-length"
                type="number"
                value={selectedField.validation?.maxLength || ""}
                onChange={(e) =>
                  updateValidation("maxLength", parseInt(e.target.value) || undefined)
                }
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
