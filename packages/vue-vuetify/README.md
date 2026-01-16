# @smart-form/vue-vuetify

Vuetify 3 components for Smart Form - a type-safe form library with Zod validation.

**Demo:** [https://smart-form-docs.vercel.app/docs/examples/vue-vuetify](https://smart-form-docs.vercel.app/docs/examples/vue-vuetify)

## Installation

```bash
npm install @smart-form/vue-vuetify
```

### Peer Dependencies

```bash
npm install vue vuetify zod
```

Make sure Vuetify is configured in your app with Material Design Icons:

```ts
// main.ts
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify()
app.use(vuetify)
```

## Quick Start

```vue
<script setup lang="ts">
import { z } from 'zod'
import { form, SmartForm, type InferFormData } from '@smart-form/vue-vuetify'

const myForm = form()
  .text('name', {
    schema: z.string().min(1, 'Name is required'),
    label: 'Full Name',
  })
  .text('email', {
    schema: z.string().email('Invalid email'),
    label: 'Email',
  })
  .select('country', {
    schema: z.enum(['us', 'uk', 'ca']),
    label: 'Country',
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ],
  })

type FormData = InferFormData<typeof myForm>

function handleSubmit(data: unknown) {
  const formData = data as FormData
  console.log(formData)
}
</script>

<template>
  <SmartForm
    :form="myForm"
    :initial-values="{ name: 'John' }"
    :on-submit="handleSubmit"
  />
</template>
```

## Features

- Pre-configured Vuetify 3 component registry
- Outlined variant with comfortable density
- Responsive grid layout using `VRow`/`VCol`
- Array fields with sortable items and card-based layout
- Validation error display on touched fields
- Loading state on submit button

## Field Types

```ts
form()
  // Text input (VTextField)
  .text('username', {
    schema: z.string().min(3),
    label: 'Username',
    span: 6,  // Grid columns (1-12)
  })

  // Number input
  .text('age', {
    schema: z.coerce.number().min(18),
    inputType: 'number',
    min: 0,
    max: 120,
  })

  // Textarea (VTextarea)
  .textarea('bio', {
    schema: z.string(),
    rows: 5,
  })

  // Select (VSelect)
  .select('role', {
    schema: z.enum(['admin', 'user']),
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
    placeholder: 'Select a role...',
  })

  // Array with sortable items
  .array('items', {
    sortable: true,
    fields: (row) => row
      .text('name', { span: 8 })
      .text('qty', { span: 4 }),
  })
```

## Responsive Spans

Use responsive column spans:

```ts
.text('name', {
  span: { sm: 12, md: 6, lg: 4 }
})
```

## Using the Registry Directly

If you need more control, use `vuetifyRegistry` with `@smart-form/vue`:

```vue
<script setup lang="ts">
import { form, SmartForm } from '@smart-form/vue'
import { vuetifyRegistry } from '@smart-form/vue-vuetify'

const myForm = form().text('name', { schema: z.string() })
</script>

<template>
  <SmartForm
    :form="myForm"
    :components="vuetifyRegistry"
    :on-submit="handleSubmit"
  />
</template>
```

## Type-Safe Helper

Use `createSmartForm` for better type inference:

```ts
import { form, createSmartForm, type InferFormData } from '@smart-form/vue-vuetify'

const myForm = form()
  .text('name', { schema: z.string() })
  .text('email', { schema: z.string().email() })

const formProps = createSmartForm(
  myForm,
  (data) => {
    // data is fully typed as { name: string; email: string }
    console.log(data)
  },
  { name: 'Initial Name' }
)
```

## Exports

```ts
// Components
export { SmartForm, createSmartForm, vuetifyRegistry }

// Re-exported from @smart-form/vue
export {
  form,
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
}
```

## Related Packages

- [@smart-form/core](https://www.npmjs.com/package/@smart-form/core) - Framework-agnostic core
- [@smart-form/vue](https://www.npmjs.com/package/@smart-form/vue) - Vue 3 binding (base package)
- [@smart-form/react](https://www.npmjs.com/package/@smart-form/react) - React binding

## License

MIT
