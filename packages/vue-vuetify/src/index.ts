export { SmartForm, createSmartForm } from "./SmartForm";
export { vuetifyRegistry } from "./registry";

// Re-export commonly used types from vue package
export {
  form,
  SmartForm as BaseSmartForm,
  type FormDef,
  type FieldDef,
  type InferFormData,
  type VueComponentRegistry,
  type TextFieldProps,
  type TextareaFieldProps,
  type SelectFieldProps,
  type ArrayFieldProps,
  type FormWrapperProps,
  type SubmitButtonProps,
  type FieldWrapperProps,
} from "@smart-form/vue";
