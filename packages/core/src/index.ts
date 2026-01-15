// Form builder
export {
  form,
  type FormDef,
  type FieldDef,
  type TextDef,
  type TextareaDef,
  type SelectDef,
  type ArrayDef,
  type SelectOption,
  type SpanValue,
  type InferFormData,
} from "./form-builder";

// Store
export { createFormStore, type FormStore, type FormStoreState } from "./store";

// Component registry
export {
  type ComponentRegistry,
  type FieldProps,
  type TextFieldProps,
  type TextareaFieldProps,
  type SelectFieldProps,
  type ArrayFieldProps,
  type FormWrapperProps,
  type SubmitButtonProps,
  type FieldWrapperProps,
  type ErrorMessageProps,
  type LabelProps,
} from "./component-registry";

// Validation
export { validate, type ValidationResult, type ValidationError } from "./validation";
