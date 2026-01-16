# @smart-form/react

React binding for Smart Form - a type-safe form library with Zod validation.

**Demo:** [https://smart-form-docs.vercel.app/docs/examples/react](https://smart-form-docs.vercel.app/docs/examples/react)

## Installation

### Using shadcn CLI (Recommended)

```bash
npx shadcn@latest add https://deiucanta.github.io/smart-form/smart-form.json
```

This automatically installs the package and sets up shadcn/ui components.

### Manual Installation

```bash
npm install @smart-form/react zod
```

## Quick Start

```tsx
import { form, SmartForm, type InferFormData } from '@smart-form/react'
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
      components={myComponents}
      initialValues={{ name: 'John' }}
      onSubmit={handleSubmit}
    />
  )
}
```

## SmartForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `form` | `FormDef` | Yes | Form definition created with `form()` |
| `components` | `ComponentRegistry` | Yes | UI component registry |
| `initialValues` | `object` | No | Initial form values |
| `onSubmit` | `(data) => void` | Yes | Submit handler |

## Field Types

```tsx
form()
  // Text input
  .text('username', {
    schema: z.string().min(3),
    label: 'Username',
    span: 6,  // Grid columns (1-12)
  })

  // Number input
  .text('age', {
    schema: z.coerce.number().min(18),
    inputType: 'number',
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
    placeholder: 'Select a role...',
  })

  // Array (repeatable fields)
  .array('items', {
    sortable: true,
    fields: (row) => row
      .text('name', { span: 8 })
      .text('qty', { span: 4 }),
  })
```

## Component Registry

Provide your own UI components to customize the look and feel:

```tsx
import type { ComponentRegistry } from '@smart-form/react'

const myComponents: ComponentRegistry = {
  TextField: ({ name, value, label, error, onChange, onBlur }) => (
    <div>
      <label>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <span className="error">{error}</span>}
    </div>
  ),

  TextareaField: ({ value, label, rows, error, onChange, onBlur }) => (
    <div>
      <label>{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <span className="error">{error}</span>}
    </div>
  ),

  SelectField: ({ value, label, options, error, onChange, onBlur }) => (
    <div>
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="error">{error}</span>}
    </div>
  ),

  ArrayField: ({ label, value, renderItem, onAdd, onRemove }) => (
    <div>
      <label>{label}</label>
      {value.map((_, index) => (
        <div key={index}>
          {renderItem(index)}
          <button type="button" onClick={() => onRemove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={onAdd}>Add</button>
    </div>
  ),

  FormWrapper: ({ children, onSubmit }) => (
    <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
      {children}
    </form>
  ),

  SubmitButton: ({ isSubmitting }) => (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  ),

  FieldWrapper: ({ span, children }) => (
    <div style={{ gridColumn: `span ${span ?? 12}` }}>
      {children}
    </div>
  ),
}
```

## TypeScript

Full type inference is available:

```tsx
import { form, type InferFormData } from '@smart-form/react'

const myForm = form()
  .text('name', { schema: z.string() })
  .text('age', { schema: z.coerce.number() })

type FormData = InferFormData<typeof myForm>
// { name: string; age: number }
```

## Related Packages

- [@smart-form/core](https://www.npmjs.com/package/@smart-form/core) - Framework-agnostic core
- [@smart-form/vue](https://www.npmjs.com/package/@smart-form/vue) - Vue 3 binding

## License

MIT
