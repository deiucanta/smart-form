# Smart Form

A framework-agnostic form library with type-safe schema validation. Supports React and Vue 3.

## Installation

```bash
# React
npm install @smart-form/react zod

# Vue 3
npm install @smart-form/vue zod

# Vue 3 + Vuetify (includes pre-built components)
npm install @smart-form/vue-vuetify zod
```

## Quick Start

```tsx
import { form, SmartForm, type InferFormData } from '@smart-form/react'
import { shadcnComponents } from '@/components/ui/smart-form'
import { z } from 'zod'

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
      components={shadcnComponents}
      initialValues={{ name: 'John' }}
      onSubmit={handleSubmit}
    />
  )
}
```

## API

### Field Types

```tsx
form()
  // Text input
  .text('username', {
    schema: z.string().min(3),
    label: 'Username',
    span: 6,  // Grid columns (1-12)
  })

  // Number input (via schema)
  .text('age', {
    schema: z.coerce.number().min(18),
  })

  // Textarea
  .textarea('bio', {
    schema: z.string(),
    rows: 5,
  })

  // Select
  .select('role', {
    schema: z.enum(['admin', 'user']),
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
    placeholder: 'Select...',
  })

  // Array (repeatable fields)
  .array('items', {
    sortable: true,
    fields: (row) => row
      .text('name', { span: 8 })
      .text('qty', { span: 4 }),
  })
```

### Custom Components

Provide your own UI components:

```tsx
import type { ComponentRegistry } from '@smart-form/react'

const myComponents: ComponentRegistry = {
  TextField: ({ name, value, label, error, onChange, onBlur }) => (
    <div>
      <label>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} />
      {error && <span>{error}</span>}
    </div>
  ),
  TextareaField: ({ ... }) => ...,
  SelectField: ({ ... }) => ...,
  ArrayField: ({ ... }) => ...,
  FormWrapper: ({ children, onSubmit }) => <form onSubmit={e => { e.preventDefault(); onSubmit() }}>{children}</form>,
  SubmitButton: ({ isSubmitting }) => <button disabled={isSubmitting}>Submit</button>,
  FieldWrapper: ({ span, children }) => <div>{children}</div>,
}
```

## Packages

| Package | Description |
|---------|-------------|
| [`@smart-form/core`](packages/core) | Framework-agnostic core (form builder, store, types) |
| [`@smart-form/react`](packages/react) | React binding |
| [`@smart-form/vue`](packages/vue) | Vue 3 binding |
| [`@smart-form/vue-vuetify`](packages/vue-vuetify) | Vue 3 + Vuetify pre-built components |

## Examples

| Example | Description |
|---------|-------------|
| [`react-shadcn`](examples/react-shadcn) | React with shadcn/ui components |
| [`vue-vuetify`](examples/vue-vuetify) | Vue 3 with Vuetify components |

## License

MIT
