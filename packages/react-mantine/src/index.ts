export { SmartForm, createSmartForm, type MantineSmartFormProps } from "./SmartForm";
export { mantineRegistry } from "./registry";

// Re-export commonly used types from react package
export {
  SmartForm as BaseSmartForm,
  type SmartFormProps,
  form,
  type FormDef,
  type FieldDef,
  type InferFormData,
  type ComponentRegistry,
  type TextFieldProps,
  type TextareaFieldProps,
  type SelectFieldProps,
  type ArrayFieldProps,
  type FormWrapperProps,
  type SubmitButtonProps,
  type FieldWrapperProps,
} from "@smart-form/react";
