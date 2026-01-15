import type React from "react";
import { z } from "zod";

// biome-ignore lint/complexity/noBannedTypes: Empty object is intentional for type accumulation
type EmptyFields = {};

// Types
export type SpanValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SelectOption<T> = { value: T; label: string };

export type FieldDef =
  | TextDef
  | TextareaDef
  | SelectDef
  | ArrayDef
  | CustomDef;

export type TextDef<N extends string = string> = {
  type: "text";
  name: N;
  validator: z.ZodType;
  label?: string;
  span?: SpanValue;
  default?: unknown;
};

export type TextareaDef<N extends string = string> = {
  type: "textarea";
  name: N;
  validator: z.ZodType;
  label?: string;
  span?: SpanValue;
  rows?: number;
  default?: unknown;
};

export type SelectDef<N extends string = string> = {
  type: "select";
  name: N;
  validator: z.ZodType;
  label?: string;
  span?: SpanValue;
  options?: SelectOption<unknown>[];
  placeholder?: string;
  default?: unknown;
};

export type ArrayDef<N extends string = string> = {
  type: "array";
  name: N;
  label?: string;
  span?: SpanValue;
  sortable?: boolean;
  fields?: FieldDef[];
  default?: unknown[];
};

export type CustomDef = {
  type: "custom";
  render: (fields: Record<string, unknown>) => React.ReactNode;
  span?: SpanValue;
};

export interface FormDef<Fields = Record<string, unknown>> {
  fields: FieldDef[];
  fieldMap: Record<string, FieldDef>;
  toZod: () => z.ZodObject<{ [K in keyof Fields]: z.ZodType<Fields[K]> }>;
  _fieldsType?: Fields; // phantom type for inference
}

// Config types for each field
type TextConfig<S extends z.ZodType = z.ZodString> = {
  schema?: S;
  label?: string;
  span?: SpanValue;
  default?: z.infer<S>;
};

type TextareaConfig<S extends z.ZodType = z.ZodString> = {
  schema?: S;
  label?: string;
  span?: SpanValue;
  rows?: number;
  default?: z.infer<S>;
};

type SelectConfig<T extends string, S extends z.ZodType = z.ZodType<T>> = {
  schema: S;
  options: SelectOption<T>[];
  label?: string;
  span?: SpanValue;
  placeholder?: string;
  default?: T;
};

type ArrayConfig<R> = {
  fields: (row: FormBuilder<EmptyFields>) => FormBuilder<R>;
  label?: string;
  span?: SpanValue;
  sortable?: boolean;
  default?: R[];
};

type CustomConfig = {
  span?: SpanValue;
};

// Form Builder with type accumulation
class FormBuilder<Fields = EmptyFields> implements FormDef<Fields> {
  private _fields: FieldDef[] = [];
  private _fieldMap: Record<string, FieldDef> | null = null;

  // Phantom type for InferFormData
  declare _fieldsType?: Fields;

  // Expose FormDef-compatible properties directly
  get fields(): FieldDef[] {
    return this._fields;
  }

  get fieldMap(): Record<string, FieldDef> {
    if (!this._fieldMap) {
      this._fieldMap = {};
      for (const field of this._fields) {
        if (field.type !== "custom") {
          this._fieldMap[field.name] = field;
        }
      }
    }
    return this._fieldMap;
  }

  toZod() {
    return this._buildZodSchema(this._fields) as z.ZodObject<{ [K in keyof Fields]: z.ZodType<Fields[K]> }>;
  }

  private _clone<NewFields>(): FormBuilder<NewFields> {
    const next = new FormBuilder<NewFields>();
    next._fields = [...this._fields];
    return next;
  }

  text<N extends string, S extends z.ZodType = z.ZodString>(
    name: N,
    config?: TextConfig<S>
  ): FormBuilder<Fields & { [K in N]: z.infer<S> }> {
    const next = this._clone<Fields & { [K in N]: z.infer<S> }>();
    next._fields.push({
      type: "text",
      name,
      validator: config?.schema ?? z.string(),
      label: config?.label,
      span: config?.span,
      default: config?.default,
    });
    return next;
  }

  textarea<N extends string, S extends z.ZodType = z.ZodString>(
    name: N,
    config?: TextareaConfig<S>
  ): FormBuilder<Fields & { [K in N]: z.infer<S> }> {
    const next = this._clone<Fields & { [K in N]: z.infer<S> }>();
    next._fields.push({
      type: "textarea",
      name,
      validator: config?.schema ?? z.string(),
      label: config?.label,
      span: config?.span,
      rows: config?.rows,
      default: config?.default,
    });
    return next;
  }

  select<N extends string, T extends string>(
    name: N,
    config: SelectConfig<T>
  ): FormBuilder<Fields & { [K in N]: T }> {
    const next = this._clone<Fields & { [K in N]: T }>();
    next._fields.push({
      type: "select",
      name,
      validator: config.schema,
      label: config.label,
      span: config.span,
      options: config.options as SelectOption<unknown>[],
      placeholder: config.placeholder,
      default: config.default,
    });
    return next;
  }

  array<N extends string, R>(
    name: N,
    config: ArrayConfig<R>
  ): FormBuilder<Fields & { [K in N]: R[] }> {
    const next = this._clone<Fields & { [K in N]: R[] }>();
    const rowBuilder = config.fields(new FormBuilder<EmptyFields>());
    next._fields.push({
      type: "array",
      name,
      label: config.label,
      span: config.span,
      sortable: config.sortable,
      fields: rowBuilder._fields,
      default: config.default,
    });
    return next;
  }

  custom(
    render: (fields: Fields) => React.ReactNode,
    config?: CustomConfig
  ): FormBuilder<Fields> {
    const next = this._clone<Fields>();
    next._fields.push({
      type: "custom",
      render: render as (fields: Record<string, unknown>) => React.ReactNode,
      span: config?.span,
    });
    return next;
  }

  private _buildZodSchema(fields: FieldDef[]): z.ZodObject<Record<string, z.ZodType>> {
    const shape: Record<string, z.ZodType> = {};
    for (const field of fields) {
      if (field.type === "custom") continue; // custom fields don't have validators
      shape[field.name] = fieldToZod(field);
    }
    return z.object(shape);
  }
}

// Helper to convert field def to Zod schema
function fieldToZod(field: FieldDef): z.ZodType {
  if (field.type === "array") {
    const itemShape: Record<string, z.ZodType> = {};
    for (const itemField of field.fields ?? []) {
      if (itemField.type === "custom") continue;
      itemShape[itemField.name] = fieldToZod(itemField);
    }
    return z.array(z.object(itemShape));
  }
  if (field.type === "custom") {
    return z.unknown();
  }
  return field.validator;
}

// Factory function
export function form(): FormBuilder<EmptyFields> {
  return new FormBuilder();
}

// Type utility to infer data shape from FormDef
export type InferFormData<T extends FormDef> = T extends FormDef<infer F> ? F : never;
