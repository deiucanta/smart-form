# @smart-form/react-mantine

Mantine components for Smart Form - a type-safe form library with Zod validation.

**Demo:** [https://smart-form-docs.vercel.app/docs/examples/react-mantine](https://smart-form-docs.vercel.app/docs/examples/react-mantine)

## Installation

```bash
npm install @smart-form/react-mantine
```

### Peer Dependencies

```bash
npm install react @mantine/core @mantine/hooks @tabler/icons-react zod
```

Make sure Mantine is configured in your app:

```tsx
// main.tsx
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

function App() {
  return (
    <MantineProvider>
      {/* your app */}
    </MantineProvider>
  )
}
```

## Quick Start

```tsx
import { z } from 'zod'
import { form, SmartForm, type InferFormData } from '@smart-form/react-mantine'

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

function App() {
  const handleSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <SmartForm
      form={myForm}
      initialValues={{ name: 'John' }}
      onSubmit={handleSubmit}
    />
  )
}
```

## Features

- Pre-configured Mantine component registry
- Responsive grid layout using `Grid`/`Grid.Col`
- Array fields with sortable items and card-based layout
- Validation error display on touched fields
- Loading state on submit button

## Field Types

```tsx
form()
  // Text input (TextInput)
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

  // Textarea (Textarea)
  .textarea('bio', {
    schema: z.string(),
    rows: 5,
  })

  // Select (Select)
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

```tsx
.text('name', {
  span: { sm: 12, md: 6, lg: 4 }
})
```

## Using the Registry Directly

If you need more control, use `mantineRegistry` with `@smart-form/react`:

```tsx
import { form, SmartForm } from '@smart-form/react'
import { mantineRegistry } from '@smart-form/react-mantine'

const myForm = form().text('name', { schema: z.string() })

function App() {
  return (
    <SmartForm
      form={myForm}
      components={mantineRegistry}
      onSubmit={handleSubmit}
    />
  )
}
```

## Type-Safe Helper

Use `createSmartForm` for better type inference:

```tsx
import { form, createSmartForm, type InferFormData } from '@smart-form/react-mantine'

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
export { SmartForm, createSmartForm, mantineRegistry }

// Re-exported from @smart-form/react
export {
  form,
  type FormDef,
  type FieldDef,
  type InferFormData,
  type ComponentRegistry,
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
- [@smart-form/react](https://www.npmjs.com/package/@smart-form/react) - React binding (base package)
- [@smart-form/vue](https://www.npmjs.com/package/@smart-form/vue) - Vue 3 binding

## License

MIT
