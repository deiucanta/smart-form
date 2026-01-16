# Smart Form

A framework-agnostic form library with type-safe schema validation. Define your form once, use it with React or Vue.

## Example

**Define your form once:**

```ts
// forms/contact.ts
import { form } from '@smart-form/core'
import { z } from 'zod'

export const contactForm = form()
  .text('name', { schema: z.string().min(1), label: 'Name' })
  .text('email', { schema: z.string().email(), label: 'Email' })
  .select('priority', {
    schema: z.enum(['low', 'medium', 'high']),
    label: 'Priority',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
  })
  .array('attachments', {
    label: 'Attachments',
    fields: (row) => row
      .text('filename', { schema: z.string(), label: 'Filename' })
      .text('url', { schema: z.string().url(), label: 'URL' }),
  })
```

**Use in React (with Mantine):**

```tsx
import { SmartForm } from '@smart-form/react-mantine'
import { contactForm } from './forms/contact'

function ContactPage() {
  return (
    <SmartForm
      form={contactForm}
      onSubmit={(data) => console.log(data)}
    />
  )
}
```

**Use in Vue (with Vuetify):**

```vue
<script setup lang="ts">
import { SmartForm } from '@smart-form/vue-vuetify'
import { contactForm } from './forms/contact'
</script>

<template>
  <SmartForm
    :form="contactForm"
    @submit="(data) => console.log(data)"
  />
</template>
```

## Documentation

[**View Full Documentation**](https://deiucanta.github.io/smart-form/) *(in development)*

## Installation

```bash
# React
npm install @smart-form/react zod

# React + Mantine (includes pre-built components)
npm install @smart-form/react-mantine zod

# Vue 3
npm install @smart-form/vue zod

# Vue 3 + Vuetify (includes pre-built components)
npm install @smart-form/vue-vuetify zod
```

## Packages

| Package | Description |
|---------|-------------|
| [`@smart-form/core`](./packages/core) | Framework-agnostic core (form builder, store, types) |
| [`@smart-form/react`](./packages/react) | React bindings |
| [`@smart-form/react-mantine`](./packages/react-mantine) | React + Mantine pre-built components |
| [`@smart-form/vue`](./packages/vue) | Vue 3 bindings |
| [`@smart-form/vue-vuetify`](./packages/vue-vuetify) | Vue 3 + Vuetify pre-built components |

## Examples

| Example | Description |
|---------|-------------|
| [`react-shadcn`](./examples/react-shadcn) | React with shadcn/ui components |
| [`react-mantine`](./examples/react-mantine) | React with Mantine components |
| [`vue-vuetify`](./examples/vue-vuetify) | Vue 3 with Vuetify components |

## License

MIT
