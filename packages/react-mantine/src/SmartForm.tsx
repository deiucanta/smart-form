import {
  SmartForm as BaseSmartForm,
  type SmartFormProps,
  type FormDef,
  type InferFormData,
} from "@smart-form/react";
import { mantineRegistry } from "./registry";

export interface MantineSmartFormProps<T extends FormDef>
  extends Omit<SmartFormProps<T>, "components"> {}

export function SmartForm<T extends FormDef>(props: MantineSmartFormProps<T>) {
  return <BaseSmartForm {...props} components={mantineRegistry} />;
}

// Type-safe factory for better inference
export function createSmartForm<T extends FormDef>(
  form: T,
  onSubmit: (data: InferFormData<T>) => void | Promise<void>,
  initialValues?: Partial<InferFormData<T>>
) {
  return {
    form,
    onSubmit,
    initialValues,
  };
}
