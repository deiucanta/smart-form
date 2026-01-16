# @smart-form/vue

Vue 3 binding for Smart Form - a framework-agnostic form library with type-safe schema validation.

## Installation

```bash
npm install @smart-form/vue
# or
yarn add @smart-form/vue
# or
pnpm add @smart-form/vue
# or
bun add @smart-form/vue
```

### Peer Dependencies

```bash
npm install vue zod
```

## Quick Start

```vue
<script setup lang="ts">
import { z } from "zod";
import { form, SmartForm, type InferFormData } from "@smart-form/vue";
import { myComponents } from "./my-component-registry";

const myForm = form()
  .text("name", {
    schema: z.string().min(1, "Name is required"),
    label: "Full Name",
  })
  .text("email", {
    schema: z.string().email("Invalid email"),
    label: "Email",
  })
  .select("country", {
    schema: z.enum(["us", "uk", "ca"]),
    label: "Country",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ],
  });

type FormData = InferFormData<typeof myForm>;

function handleSubmit(data: unknown) {
  const formData = data as FormData;
  console.log(formData);
}
</script>

<template>
  <SmartForm
    :form="myForm"
    :components="myComponents"
    :initial-values="{ name: 'John' }"
    :on-submit="handleSubmit"
  />
</template>
```

## Component Registry

Create a component registry that maps Smart Form field types to your UI components. The registry must return VNodes.

### With Vuetify

```ts
import { h, type VNode } from "vue";
import { VTextField, VTextarea, VSelect, VBtn, VForm, VRow, VCol } from "vuetify/components";
import type { VueComponentRegistry, TextFieldProps } from "@smart-form/vue";

export const vuetifyComponents: VueComponentRegistry = {
  TextField: (props: TextFieldProps): VNode =>
    h(VTextField, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      type: props.inputType ?? "text",
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
    }),

  TextareaField: (props) =>
    h(VTextarea, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      rows: props.rows ?? 3,
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
    }),

  SelectField: (props) =>
    h(VSelect, {
      modelValue: props.value,
      "onUpdate:modelValue": props.onChange,
      label: props.label,
      items: props.options.map((opt) => ({ title: opt.label, value: opt.value })),
      errorMessages: props.error ? [props.error] : [],
      onBlur: props.onBlur,
      variant: "outlined",
    }),

  ArrayField: (props) => {
    const items = props.value as unknown[];
    return h("div", [
      h("div", { class: "d-flex justify-space-between mb-2" }, [
        props.label ? h("label", props.label) : null,
        h(VBtn, { variant: "outlined", size: "small", onClick: props.onAdd }, () => "Add"),
      ]),
      ...items.map((_, index) =>
        h("div", { class: "d-flex gap-2 mb-2" }, [
          h(VRow, { dense: true }, () => props.renderItem(index) as VNode[]),
          h(VBtn, { icon: "mdi-delete", variant: "text", onClick: () => props.onRemove(index) }),
        ])
      ),
    ]);
  },

  FormWrapper: (props) =>
    h(VForm, { onSubmit: (e: Event) => { e.preventDefault(); props.onSubmit(); } },
      () => h(VRow, () => props.children as VNode[])),

  SubmitButton: (props) =>
    h(VCol, { cols: 12 }, () =>
      h(VBtn, { type: "submit", color: "primary", block: true, loading: props.isSubmitting },
        () => "Submit")),

  FieldWrapper: (props) =>
    h(VCol, { cols: props.span ?? 12 }, () => props.children as VNode),
};
```

### Custom Components

```ts
import { h, type VNode } from "vue";
import type { VueComponentRegistry } from "@smart-form/vue";

export const myComponents: VueComponentRegistry = {
  TextField: (props) =>
    h("div", [
      props.label && h("label", props.label),
      h("input", {
        value: props.value,
        type: props.inputType ?? "text",
        onInput: (e: Event) => props.onChange((e.target as HTMLInputElement).value),
        onBlur: props.onBlur,
      }),
      props.error && h("span", { class: "error" }, props.error),
    ]),

  TextareaField: (props) =>
    h("div", [
      props.label && h("label", props.label),
      h("textarea", {
        value: props.value,
        rows: props.rows ?? 3,
        onInput: (e: Event) => props.onChange((e.target as HTMLTextAreaElement).value),
        onBlur: props.onBlur,
      }),
      props.error && h("span", { class: "error" }, props.error),
    ]),

  SelectField: (props) =>
    h("div", [
      props.label && h("label", props.label),
      h("select", { value: props.value, onChange: (e: Event) => props.onChange((e.target as HTMLSelectElement).value), onBlur: props.onBlur }, [
        props.placeholder && h("option", { value: "" }, props.placeholder),
        ...props.options.map((opt) => h("option", { value: opt.value }, opt.label)),
      ]),
      props.error && h("span", { class: "error" }, props.error),
    ]),

  ArrayField: (props) => {
    const items = props.value as unknown[];
    return h("div", [
      h("div", [
        props.label && h("label", props.label),
        h("button", { type: "button", onClick: props.onAdd }, "Add"),
      ]),
      ...items.map((_, index) =>
        h("div", [
          ...(props.renderItem(index) as VNode[]),
          h("button", { type: "button", onClick: () => props.onRemove(index) }, "Remove"),
        ])
      ),
    ]);
  },

  FormWrapper: (props) =>
    h("form", { onSubmit: (e: Event) => { e.preventDefault(); props.onSubmit(); } },
      props.children as VNode[]),

  SubmitButton: (props) =>
    h("button", { type: "submit", disabled: props.isSubmitting },
      props.isSubmitting ? "Submitting..." : "Submit"),

  FieldWrapper: (props) =>
    h("div", props.children as VNode),
};
```

## API

### VueComponentRegistry

The registry interface that your components must implement:

```ts
interface VueComponentRegistry {
  TextField: (props: TextFieldProps) => VNode;
  TextareaField: (props: TextareaFieldProps) => VNode;
  SelectField: (props: SelectFieldProps) => VNode;
  ArrayField: (props: ArrayFieldProps) => VNode;
  FormWrapper: (props: FormWrapperProps) => VNode;
  SubmitButton: (props: SubmitButtonProps) => VNode;
  FieldWrapper: (props: FieldWrapperProps) => VNode;
}
```

### SmartForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `form` | `FormDef` | Yes | Form definition created with `form()` |
| `components` | `VueComponentRegistry` | Yes | UI component registry |
| `initialValues` | `object` | No | Initial form values |
| `onSubmit` | `(data: unknown) => void` | Yes | Submit handler |

### Field Types

See the [main documentation](../../README.md#field-types) for available field types and options.

## License

MIT
