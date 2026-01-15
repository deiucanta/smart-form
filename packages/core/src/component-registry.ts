import type { SpanValue, SelectOption } from "./form-builder";

// Base props for all field components
export interface FieldProps {
  name: string;
  value: unknown;
  error?: string;
  touched: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

export interface TextFieldProps extends FieldProps {
  value: string | number;
  label?: string;
  inputType?: "text" | "number" | "email" | "password" | "url" | "tel";
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface TextareaFieldProps extends FieldProps {
  value: string;
  label?: string;
  rows?: number;
  placeholder?: string;
}

export interface SelectFieldProps extends FieldProps {
  value: string;
  label?: string;
  options: SelectOption<string>[];
  placeholder?: string;
}

export interface ArrayFieldProps extends FieldProps {
  value: unknown[];
  label?: string;
  sortable?: boolean;
  renderItem: (index: number) => unknown;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove: (from: number, to: number) => void;
}

export interface FormWrapperProps {
  children: unknown;
  onSubmit: () => void;
}

export interface SubmitButtonProps {
  isSubmitting: boolean;
  children?: unknown;
}

export interface FieldWrapperProps {
  span?: SpanValue;
  children: unknown;
}

export interface ErrorMessageProps {
  error: string;
}

export interface LabelProps {
  htmlFor: string;
  children: string;
}

// Component registry - framework bindings implement this
export interface ComponentRegistry {
  TextField: (props: TextFieldProps) => unknown;
  TextareaField: (props: TextareaFieldProps) => unknown;
  SelectField: (props: SelectFieldProps) => unknown;
  ArrayField: (props: ArrayFieldProps) => unknown;
  FormWrapper: (props: FormWrapperProps) => unknown;
  SubmitButton: (props: SubmitButtonProps) => unknown;
  FieldWrapper: (props: FieldWrapperProps) => unknown;
}
