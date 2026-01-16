# Smart Form

A framework-agnostic form library with type-safe schema validation. Currently supports React with Shadcn UI components.

## Installation

```bash
npm install @smart-form/core @smart-form/react @smart-form/ui-shadcn
```

### Peer Dependencies

```bash
npm install react zod
```

For `@smart-form/ui-shadcn`, you also need Tailwind CSS v4 configured.

## Quick Start

```tsx
import { form, type InferFormData } from '@smart-form/core'
import { SmartForm } from '@smart-form/react'
import { shadcnComponents } from '@smart-form/ui-shadcn'
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

## Tailwind CSS Setup

Add the ui-shadcn source to your CSS:

```css
@import "tailwindcss";
@source "node_modules/@smart-form/ui-shadcn/dist";
```

Add Shadcn theme variables:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
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
import type { ComponentRegistry } from '@smart-form/core'

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
| `@smart-form/core` | Form builder, store, types (framework-agnostic) |
| `@smart-form/react` | React binding |
| `@smart-form/ui-shadcn` | Shadcn/Tailwind components |

## License

MIT
