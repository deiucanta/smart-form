# Smart Form

A framework-agnostic form library with type-safe schema validation. Currently supports React with Shadcn UI components.

## Installation

### Using shadcn CLI (Recommended)

```bash
npx shadcn@latest add https://deiucanta.github.io/smart-form/smart-form.json
```

This will automatically:
- Install `@smart-form/react` from npm
- Install required shadcn components (input, label, select, button, textarea)
- Copy the smart-form component to your project

### Manual Installation

```bash
npm install @smart-form/react
# or
yarn add @smart-form/react
# or
pnpm add @smart-form/react
# or
bun add @smart-form/react
```

Then create your own component registry (see Custom Components below).

### Validation Library

```bash
npm install zod
# or
yarn add zod
# or
pnpm add zod
# or
bun add zod
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
| `@smart-form/react` | React binding (includes core) |
| `@smart-form/core` | Form builder, store, types (framework-agnostic, installed automatically) |

## License

MIT
