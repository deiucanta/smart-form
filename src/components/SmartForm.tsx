import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  FormDef,
  FieldDef,
  TextDef,
  TextareaDef,
  SelectDef,
  ArrayDef,
  SpanValue,
  InferFormData,
} from "@/lib/form-builder";

interface SmartFormProps<T extends FormDef> {
  form: T;
  initialValues?: Partial<InferFormData<T>>;
  onSubmit: (data: InferFormData<T>) => void;
}

function initializeFormData(fields: FieldDef[]): Record<string, unknown> {
  const initial: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "custom") {
      continue;
    }
    if (field.type === "array") {
      initial[field.name] = field.default ?? [];
    } else {
      initial[field.name] = field.default ?? "";
    }
  }
  return initial;
}

function getLabel(field: Exclude<FieldDef, { type: "custom" }>, fieldName: string): string {
  if (field.label) return field.label;
  const lastSegment = fieldName.split(".").pop() ?? fieldName;
  return lastSegment.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export function SmartForm<T extends FormDef>({ form, initialValues, onSubmit }: SmartFormProps<T>) {
  const [formData, setFormData] = useState<Record<string, unknown>>(() => ({
    ...initializeFormData(form.fields),
    ...initialValues,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getSpanClass(span?: SpanValue): string {
    const spanClasses: Record<SpanValue, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    };
    return spanClasses[span ?? 12];
  }

  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayItemChange = (
    arrayField: string,
    index: number,
    itemField: string,
    value: unknown
  ) => {
    setFormData((prev) => {
      const array = [...(prev[arrayField] as Record<string, unknown>[])];
      array[index] = { ...array[index], [itemField]: value };
      return { ...prev, [arrayField]: array };
    });
  };

  const addArrayItem = (arrayField: string, fields: FieldDef[]) => {
    setFormData((prev) => {
      const array = [...(prev[arrayField] as Record<string, unknown>[])];
      array.push(initializeFormData(fields));
      return { ...prev, [arrayField]: array };
    });
  };

  const removeArrayItem = (arrayField: string, index: number) => {
    setFormData((prev) => {
      const array = [...(prev[arrayField] as Record<string, unknown>[])];
      array.splice(index, 1);
      return { ...prev, [arrayField]: array };
    });
  };

  const moveArrayItem = (arrayField: string, index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const array = [...(prev[arrayField] as Record<string, unknown>[])];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= array.length) return prev;
      [array[index], array[newIndex]] = [array[newIndex], array[index]];
      return { ...prev, [arrayField]: array };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = form.toZod();
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data as InferFormData<T>);
  };

  function renderTextField(name: string, field: TextDef, value: unknown) {
    const isNumber = field.validator._zod?.def?.type === "number";
    const bag = field.validator._zod?.bag as { minimum?: number; maximum?: number } | undefined;

    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{getLabel(field, name)}</Label>
        <Input
          id={name}
          name={name}
          type={isNumber ? "number" : "text"}
          value={value as string}
          onChange={(e) => handleChange(name, e.target.value)}
          aria-invalid={!!errors[name]}
          min={bag?.minimum}
          max={bag?.maximum}
        />
        {errors[name] && (
          <p className="text-sm text-destructive">{errors[name]}</p>
        )}
      </div>
    );
  }

  function renderTextareaField(name: string, field: TextareaDef, value: unknown) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{getLabel(field, name)}</Label>
        <textarea
          id={name}
          name={name}
          value={value as string}
          onChange={(e) => handleChange(name, e.target.value)}
          rows={field.rows ?? 3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors[name]}
        />
        {errors[name] && (
          <p className="text-sm text-destructive">{errors[name]}</p>
        )}
      </div>
    );
  }

  function renderSelectField(name: string, field: SelectDef, value: unknown) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{getLabel(field, name)}</Label>
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={(e) => handleChange(name, e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors[name]}
        >
          {field.placeholder && (
            <option value="">{field.placeholder}</option>
          )}
          {field.options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors[name] && (
          <p className="text-sm text-destructive">{errors[name]}</p>
        )}
      </div>
    );
  }

  function renderArrayField(name: string, field: ArrayDef, items: Record<string, unknown>[]) {
    const itemFields = field.fields ?? [];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>{getLabel(field, name)}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem(name, itemFields)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start p-3 border rounded-md">
            {field.sortable && (
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveArrayItem(name, index, "up")}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveArrayItem(name, index, "down")}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex-1 grid grid-cols-12 gap-2">
              {itemFields
                .filter((f): f is Exclude<FieldDef, { type: "custom" }> => f.type !== "custom")
                .map((itemField) =>
                  renderArrayItemField(
                    name,
                    index,
                    itemField.name,
                    itemField,
                    item[itemField.name]
                  )
                )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeArrayItem(name, index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {errors[name] && (
          <p className="text-sm text-destructive">{errors[name]}</p>
        )}
      </div>
    );
  }

  function renderArrayItemField(
    arrayName: string,
    index: number,
    fieldName: string,
    field: FieldDef,
    value: unknown
  ) {
    const errorKey = `${arrayName}.${index}.${fieldName}`;
    const isNumber = field.type === "text" && field.validator._zod?.def?.type === "number";
    const bag = field.type === "text"
      ? (field.validator._zod?.bag as { minimum?: number; maximum?: number } | undefined)
      : undefined;

    if (field.type === "text") {
      return (
        <div key={fieldName} className={`${getSpanClass(field.span)} space-y-2`}>
          <Label htmlFor={errorKey}>{getLabel(field, fieldName)}</Label>
          <Input
            id={errorKey}
            type={isNumber ? "number" : "text"}
            value={value as string ?? ""}
            onChange={(e) => handleArrayItemChange(arrayName, index, fieldName, e.target.value)}
            aria-invalid={!!errors[errorKey]}
            min={bag?.minimum}
            max={bag?.maximum}
          />
          {errors[errorKey] && (
            <p className="text-sm text-destructive">{errors[errorKey]}</p>
          )}
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div key={fieldName} className={`${getSpanClass(field.span)} space-y-2`}>
          <Label htmlFor={errorKey}>{getLabel(field, fieldName)}</Label>
          <textarea
            id={errorKey}
            value={value as string ?? ""}
            onChange={(e) => handleArrayItemChange(arrayName, index, fieldName, e.target.value)}
            rows={field.rows ?? 3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors[errorKey]}
          />
          {errors[errorKey] && (
            <p className="text-sm text-destructive">{errors[errorKey]}</p>
          )}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={fieldName} className={`${getSpanClass(field.span)} space-y-2`}>
          <Label htmlFor={errorKey}>{getLabel(field, fieldName)}</Label>
          <select
            id={errorKey}
            value={value as string ?? ""}
            onChange={(e) => handleArrayItemChange(arrayName, index, fieldName, e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors[errorKey]}
          >
            {field.placeholder && <option value="">{field.placeholder}</option>}
            {field.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors[errorKey] && (
            <p className="text-sm text-destructive">{errors[errorKey]}</p>
          )}
        </div>
      );
    }

    return null;
  }

  function renderField(name: string, field: FieldDef, value: unknown) {
    switch (field.type) {
      case "text":
        return renderTextField(name, field, value);
      case "textarea":
        return renderTextareaField(name, field, value);
      case "select":
        return renderSelectField(name, field, value);
      case "array":
        return renderArrayField(name, field, value as Record<string, unknown>[]);
      case "custom":
        return field.render(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {form.fields.map((field, index) => {
          const key = field.type === "custom" ? `custom-${index}` : field.name;
          const name = field.type === "custom" ? "" : field.name;
          const value = field.type === "custom" ? null : formData[field.name];
          return (
            <div key={key} className={getSpanClass(field.span)}>
              {renderField(name, field, value)}
            </div>
          );
        })}
      </div>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
