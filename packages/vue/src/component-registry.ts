import type { VNode } from "vue";
import type {
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
} from "@smart-form/core";

export interface VueComponentRegistry {
  TextField: (props: TextFieldProps) => VNode;
  TextareaField: (props: TextareaFieldProps) => VNode;
  SelectField: (props: SelectFieldProps) => VNode;
  ArrayField: (props: ArrayFieldProps) => VNode;
  FormWrapper: (props: FormWrapperProps) => VNode;
  SubmitButton: (props: SubmitButtonProps) => VNode;
  FieldWrapper: (props: FieldWrapperProps) => VNode;
}
