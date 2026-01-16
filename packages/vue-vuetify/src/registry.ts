import { h, type VNode } from "vue";
import {
  VTextField,
  VTextarea,
  VSelect,
  VBtn,
  VIcon,
  VRow,
  VCol,
  VCard,
} from "vuetify/components";
import type {
  VueComponentRegistry,
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
} from "@smart-form/vue";

function getColSpan(span?: number | { sm?: number; md?: number; lg?: number }): Record<string, number | undefined> {
  if (typeof span === "number") {
    return { cols: span };
  }
  if (span && typeof span === "object") {
    return {
      cols: 12,
      sm: span.sm,
      md: span.md,
      lg: span.lg,
    };
  }
  return { cols: 12 };
}

export const vuetifyRegistry: VueComponentRegistry = {
  TextField: (props: TextFieldProps): VNode => {
    return h(VTextField, {
      modelValue: props.value,
      "onUpdate:modelValue": (value: string | number) => props.onChange(value),
      onBlur: () => props.onBlur(),
      label: props.label,
      type: props.inputType ?? "text",
      min: props.min,
      max: props.max,
      step: props.step,
      placeholder: props.placeholder,
      errorMessages: props.touched && props.error ? [props.error] : [],
      variant: "outlined",
      density: "comfortable",
    });
  },

  TextareaField: (props: TextareaFieldProps): VNode => {
    return h(VTextarea, {
      modelValue: props.value,
      "onUpdate:modelValue": (value: string) => props.onChange(value),
      onBlur: () => props.onBlur(),
      label: props.label,
      rows: props.rows ?? 3,
      placeholder: props.placeholder,
      errorMessages: props.touched && props.error ? [props.error] : [],
      variant: "outlined",
      density: "comfortable",
    });
  },

  SelectField: (props: SelectFieldProps): VNode => {
    return h(VSelect, {
      modelValue: props.value,
      "onUpdate:modelValue": (value: string) => props.onChange(value),
      onBlur: () => props.onBlur(),
      label: props.label,
      items: props.options.map((opt) => ({
        title: opt.label,
        value: opt.value,
      })),
      placeholder: props.placeholder,
      errorMessages: props.touched && props.error ? [props.error] : [],
      variant: "outlined",
      density: "comfortable",
    });
  },

  ArrayField: (props: ArrayFieldProps): VNode => {
    const items = props.value ?? [];

    const renderItemRow = (index: number) => {
      return h(
        VCard,
        {
          key: index,
          variant: "outlined",
          class: "mb-3 pa-3",
        },
        () => [
          h(VRow, { alignItems: "center" }, () => [
            h(VCol, { cols: "auto" }, () => [
              h("div", { class: "d-flex flex-column" }, [
                props.sortable &&
                  h(
                    VBtn,
                    {
                      icon: true,
                      size: "x-small",
                      variant: "text",
                      disabled: index === 0,
                      onClick: () => props.onMove(index, index - 1),
                    },
                    () => h(VIcon, { size: "small" }, () => "mdi-chevron-up")
                  ),
                props.sortable &&
                  h(
                    VBtn,
                    {
                      icon: true,
                      size: "x-small",
                      variant: "text",
                      disabled: index === items.length - 1,
                      onClick: () => props.onMove(index, index + 1),
                    },
                    () => h(VIcon, { size: "small" }, () => "mdi-chevron-down")
                  ),
              ]),
            ]),
            h(VCol, {}, () => [h(VRow, {}, () => props.renderItem(index) as VNode)]),
            h(VCol, { cols: "auto" }, () => [
              h(
                VBtn,
                {
                  icon: true,
                  size: "small",
                  variant: "text",
                  color: "error",
                  onClick: () => props.onRemove(index),
                },
                () => h(VIcon, {}, () => "mdi-delete")
              ),
            ]),
          ]),
        ]
      );
    };

    return h("div", { class: "mb-4" }, [
      props.label && h("div", { class: "text-subtitle-1 mb-2" }, props.label),
      ...items.map((_, index) => renderItemRow(index)),
      h(
        VBtn,
        {
          variant: "outlined",
          size: "small",
          onClick: () => props.onAdd(),
        },
        () => [h(VIcon, { start: true }, () => "mdi-plus"), "Add Item"]
      ),
      props.touched && props.error && h("div", { class: "text-error text-caption mt-1" }, props.error),
    ]);
  },

  FormWrapper: (props: FormWrapperProps): VNode => {
    return h(
      "form",
      {
        onSubmit: (e: Event) => {
          e.preventDefault();
          props.onSubmit();
        },
      },
      [h(VRow, {}, () => props.children as VNode)]
    );
  },

  SubmitButton: (props: SubmitButtonProps): VNode => {
    return h(VCol, { cols: 12 }, () =>
      h(
        VBtn,
        {
          type: "submit",
          color: "primary",
          loading: props.isSubmitting,
          disabled: props.isSubmitting,
        },
        () => (props.children as VNode) ?? "Submit"
      )
    );
  },

  FieldWrapper: (props: FieldWrapperProps): VNode => {
    const colProps = getColSpan(props.span);
    return h(VCol, colProps, () => props.children as VNode);
  },
};
