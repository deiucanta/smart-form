import { ArrayField } from "@/components/form/array-field";
import { Wrapper } from "@/components/form/form-wrapper";
import { NumberField } from "@/components/form/number-field";
import { SelectField } from "@/components/form/select-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";

// Re-export context hooks for convenience
export { useFieldContext, useFormContext } from "./form-context";

// Create the app form hook with pre-bound components
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    ArrayField,
    NumberField,
    SelectField,
    TextField,
    TextareaField,
  },
  formComponents: {
    Wrapper,
    SubmitButton,
  },
});

// Wrapper hook that logs before/after onSubmit
export function useWrappedAppForm<T extends Parameters<typeof useAppForm>[0]>(
  options: T
): ReturnType<typeof useAppForm> {
  const wrappedOptions = {
    ...options,
    onSubmit: async (props: Parameters<NonNullable<T["onSubmit"]>>[0]) => {
      console.log("before");
      await options.onSubmit?.(props);
      console.log("after");
    },
  };

  return useAppForm(wrappedOptions as T);
}
