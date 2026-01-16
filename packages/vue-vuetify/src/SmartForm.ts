import { defineComponent, h, type PropType } from "vue";
import { SmartForm as BaseSmartForm, type FormDef, type InferFormData } from "@smart-form/vue";
import { vuetifyRegistry } from "./registry";

export const SmartForm = defineComponent({
  name: "SmartForm",
  props: {
    form: {
      type: Object as PropType<FormDef>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
    onSubmit: {
      type: Function as PropType<(data: unknown) => void | Promise<void>>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(BaseSmartForm, {
        form: props.form,
        components: vuetifyRegistry,
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
      });
  },
});

// Type-safe wrapper for better inference
export function createSmartForm<T extends FormDef>(
  form: T,
  onSubmit: (data: InferFormData<T>) => void | Promise<void>,
  initialValues?: Partial<InferFormData<T>>
) {
  return {
    form,
    onSubmit: onSubmit as (data: unknown) => void | Promise<void>,
    initialValues: initialValues as Record<string, unknown> | undefined,
  };
}
