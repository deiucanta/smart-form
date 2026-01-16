import { h, type VNode } from "vue";
import {
  VTextField,
  VTextarea,
  VSelect,
  VBtn,
  VForm,
  VRow,
  VCol,
  VCard,
  VCardText,
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

function getColSpan(span?: number): number {
  return span ?? 12;
}

export const vuetifyComponents: VueComponentRegistry = {
  TextField: (props: TextFieldProps): VNode =>
    h(VTextField, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      type: props.inputType ?? "text",
      min: props.min,
      max: props.max,
      step: props.step,
      placeholder: props.placeholder,
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
      density: "comfortable",
    }),

  TextareaField: (props: TextareaFieldProps): VNode =>
    h(VTextarea, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      rows: props.rows ?? 3,
      placeholder: props.placeholder,
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
      density: "comfortable",
    }),

  SelectField: (props: SelectFieldProps): VNode =>
    h(VSelect, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      items: props.options.map((opt) => ({ title: opt.label, value: opt.value })),
      placeholder: props.placeholder,
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
      density: "comfortable",
    }),

  ArrayField: (props: ArrayFieldProps): VNode => {
    const items = props.value as unknown[];
    return h("div", { class: "mb-4" }, [
      h("div", { class: "d-flex align-center justify-space-between mb-2" }, [
        props.label ? h("label", { class: "text-subtitle-1 font-weight-medium" }, props.label) : null,
        h(
          VBtn,
          {
            variant: "outlined",
            size: "small",
            onClick: props.onAdd,
            prependIcon: "mdi-plus",
          },
          () => "Add"
        ),
      ]),
      ...items.map((_, index) =>
        h(
          VCard,
          { variant: "outlined", class: "mb-2" },
          () =>
            h(VCardText, { class: "d-flex align-start gap-2" }, () => [
              props.sortable
                ? h("div", { class: "d-flex flex-column" }, [
                    h(
                      VBtn,
                      {
                        variant: "text",
                        size: "x-small",
                        icon: "mdi-chevron-up",
                        onClick: () => props.onMove(index, index - 1),
                        disabled: index === 0,
                      }
                    ),
                    h(
                      VBtn,
                      {
                        variant: "text",
                        size: "x-small",
                        icon: "mdi-chevron-down",
                        onClick: () => props.onMove(index, index + 1),
                        disabled: index === items.length - 1,
                      }
                    ),
                  ])
                : null,
              h(VRow, { class: "flex-grow-1", dense: true }, () =>
                props.renderItem(index) as VNode[]
              ),
              h(VBtn, {
                variant: "text",
                size: "small",
                icon: "mdi-delete",
                color: "error",
                onClick: () => props.onRemove(index),
              }),
            ])
        )
      ),
      props.error ? h("div", { class: "text-error text-caption" }, props.error) : null,
    ]);
  },

  FormWrapper: (props: FormWrapperProps): VNode =>
    h(
      VForm,
      {
        onSubmit: (e: Event) => {
          e.preventDefault();
          props.onSubmit();
        },
      },
      () => h(VRow, () => props.children as VNode[])
    ),

  SubmitButton: (props: SubmitButtonProps): VNode =>
    h(
      VCol,
      { cols: 12 },
      () =>
        h(
          VBtn,
          {
            type: "submit",
            color: "primary",
            block: true,
            loading: props.isSubmitting,
            disabled: props.isSubmitting,
          },
          () => (props.children as VNode) ?? "Submit"
        )
    ),

  FieldWrapper: (props: FieldWrapperProps): VNode =>
    h(VCol, { cols: getColSpan(props.span) }, () => props.children as VNode),
};
