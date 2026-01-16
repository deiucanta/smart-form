# @smart-form/core

Framework-agnostic form builder with type-safe schema validation powered by Zod.

## Installation

```bash
npm install @smart-form/core
```

> **Note:** Most users should install a framework-specific binding instead:
> - React: `npm install @smart-form/react`
> - Vue 3: `npm install @smart-form/vue`

## Features

- Type-safe form schema with full TypeScript inference
- Zod-powered validation
- Framework-agnostic core (works with React, Vue, or custom integrations)
- Reactive state management via nanostores
- Support for text, textarea, select, and array fields
- Responsive grid layout with customizable column spans

## Quick Start

```ts
import { form, createFormStore, validate, type InferFormData } from '@smart-form/core'
import { z } from 'zod'

// Define your form schema
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

// Infer the form data type
type FormData = InferFormData<typeof myForm>
// { name: string; email: string; country: 'us' | 'uk' | 'ca' }

// Create a reactive store
const store = createFormStore(myForm, { name: 'John' })

// Access values
store.values.subscribe(values => console.log(values))

// Update a field
store.setValue('email', 'john@example.com')

// Validate
const result = validate(myForm, store.values.get())
if (result.success) {
  console.log(result.data)
}
```

## API

### `form()`

Creates a new form builder. Chain field methods to define your schema:

```ts
const myForm = form()
  .text('username', { schema: z.string().min(3), label: 'Username' })
  .textarea('bio', { schema: z.string(), rows: 5 })
  .select('role', {
    schema: z.enum(['admin', 'user']),
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
    ],
  })
  .array('items', {
    sortable: true,
    fields: (row) => row
      .text('name', { span: 8 })
      .text('qty', { span: 4 }),
  })
```

### Field Options

| Option | Type | Description |
|--------|------|-------------|
| `schema` | `ZodType` | Zod schema for validation |
| `label` | `string` | Field label |
| `placeholder` | `string` | Placeholder text |
| `span` | `number \| { sm?, md?, lg? }` | Grid column span (1-12) |

### `createFormStore(formDef, initialValues?)`

Creates a reactive store for form state management.

```ts
const store = createFormStore(myForm, { name: 'John' })

// Reactive atoms
store.values      // Atom<FormData>
store.errors      // Atom<Record<string, string>>
store.touched     // Atom<Record<string, boolean>>
store.isSubmitting // Atom<boolean>

// Methods
store.setValue(name, value)
store.setTouched(name, touched)
store.setError(name, error)
store.reset(values?)
store.submit(onSubmit)
```

### `validate(formDef, values)`

Validates form values against the schema.

```ts
const result = validate(myForm, values)

if (result.success) {
  // result.data is typed as FormData
} else {
  // result.errors is Record<string, string>
}
```

### Types

```ts
import type {
  FormDef,
  FieldDef,
  InferFormData,
  ComponentRegistry,
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
} from '@smart-form/core'
```

## Building a Custom Integration

To integrate Smart Form with a UI framework, implement the `ComponentRegistry` interface:

```ts
import type { ComponentRegistry } from '@smart-form/core'

const myRegistry: ComponentRegistry = {
  TextField: (props) => /* render text input */,
  TextareaField: (props) => /* render textarea */,
  SelectField: (props) => /* render select */,
  ArrayField: (props) => /* render array field */,
  FormWrapper: (props) => /* render form wrapper */,
  SubmitButton: (props) => /* render submit button */,
  FieldWrapper: (props) => /* render field wrapper */,
}
```

See [@smart-form/react](https://github.com/deiucanta/smart-form/tree/main/packages/react) or [@smart-form/vue](https://github.com/deiucanta/smart-form/tree/main/packages/vue) for reference implementations.

## License

MIT
