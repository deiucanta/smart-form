import { useMemo, Fragment, type ReactNode } from "react";
import { useStore } from "@nanostores/react";
import {
  createFormStore,
  validate,
  type FormDef,
  type FieldDef,
  type InferFormData,
  type ComponentRegistry,
  type TextFieldProps,
  type TextareaFieldProps,
  type SelectFieldProps,
  type ArrayFieldProps,
  type SelectOption,
} from "@smart-form/core";

export interface SmartFormProps<T extends FormDef> {
  form: T;
  components: ComponentRegistry;
  initialValues?: Partial<InferFormData<T>>;
  onSubmit: (data: InferFormData<T>) => void | Promise<void>;
}

function initializeFormData(fields: FieldDef[]): Record<string, unknown> {
  const initial: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "array") {
      initial[field.name] = field.default ?? [];
    } else {
      initial[field.name] = field.default ?? "";
    }
  }
  return initial;
}

function getLabel(field: FieldDef, fieldName: string): string {
  if (field.label) return field.label;
  const lastSegment = fieldName.split(".").pop() ?? fieldName;
  return lastSegment.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function getInputType(field: FieldDef): TextFieldProps["inputType"] {
  if (field.type !== "text") return "text";
  // Check if it's a number type by inspecting Zod validator
  const zodDef = (field.validator as { _zod?: { def?: { type?: string } } })._zod?.def;
  if (zodDef?.type === "number") return "number";
  return "text";
}

function getNumberConstraints(field: FieldDef): { min?: number; max?: number } {
  if (field.type !== "text") return {};
  const bag = (field.validator as { _zod?: { bag?: { minimum?: number; maximum?: number } } })._zod?.bag;
  return { min: bag?.minimum, max: bag?.maximum };
}

export function SmartForm<T extends FormDef>({
  form,
  components,
  initialValues,
  onSubmit,
}: SmartFormProps<T>) {
  const store = useMemo(
    () =>
      createFormStore({
        ...initializeFormData(form.fields),
        ...initialValues,
      } as Record<string, unknown>),
    [form.fields, initialValues]
  );

  const values = useStore(store.$values);
  const errors = useStore(store.$errors);
  const touched = useStore(store.$touched);
  const isSubmitting = useStore(store.$isSubmitting);

  const handleSubmit = async () => {
    const schema = form.toZod();
    const result = validate(schema, values);

    if (!result.success) {
      for (const error of result.errors ?? []) {
        store.setError(error.path, error.message);
      }
      return;
    }

    store.setSubmitting(true);
    try {
      await onSubmit(result.data as InferFormData<T>);
    } finally {
      store.setSubmitting(false);
    }
  };

  function renderTextField(name: string, field: FieldDef & { type: "text" }): ReactNode {
    const constraints = getNumberConstraints(field);
    const props: TextFieldProps = {
      name,
      value: (values[name] as string | number) ?? "",
      error: errors[name],
      touched: touched[name] ?? false,
      label: getLabel(field, name),
      inputType: getInputType(field),
      min: constraints.min,
      max: constraints.max,
      onChange: (value) => {
        store.setValue(name, value);
        store.clearError(name);
      },
      onBlur: () => store.setTouched(name),
    };
    return components.TextField(props) as ReactNode;
  }

  function renderTextareaField(name: string, field: FieldDef & { type: "textarea" }): ReactNode {
    const props: TextareaFieldProps = {
      name,
      value: (values[name] as string) ?? "",
      error: errors[name],
      touched: touched[name] ?? false,
      label: getLabel(field, name),
      rows: field.rows,
      onChange: (value) => {
        store.setValue(name, value);
        store.clearError(name);
      },
      onBlur: () => store.setTouched(name),
    };
    return components.TextareaField(props) as ReactNode;
  }

  function renderSelectField(name: string, field: FieldDef & { type: "select" }): ReactNode {
    const props: SelectFieldProps = {
      name,
      value: (values[name] as string) ?? "",
      error: errors[name],
      touched: touched[name] ?? false,
      label: getLabel(field, name),
      options: (field.options ?? []) as SelectOption<string>[],
      placeholder: field.placeholder,
      onChange: (value) => {
        store.setValue(name, value);
        store.clearError(name);
      },
      onBlur: () => store.setTouched(name),
    };
    return components.SelectField(props) as ReactNode;
  }

  function renderArrayField(name: string, field: FieldDef & { type: "array" }): ReactNode {
    const items = (values[name] as unknown[]) ?? [];
    const itemFields = field.fields ?? [];

    const renderItem = (index: number): ReactNode => {
      const item = items[index] as Record<string, unknown>;
      return (
        <>
          {itemFields.map((itemField) => {
            const itemPath = `${name}.${index}.${itemField.name}`;
            const itemValue = item?.[itemField.name];

            if (itemField.type === "text") {
              const constraints = getNumberConstraints(itemField);
              const props: TextFieldProps = {
                name: itemPath,
                value: (itemValue as string | number) ?? "",
                error: errors[itemPath],
                touched: touched[itemPath] ?? false,
                label: getLabel(itemField, itemField.name),
                inputType: getInputType(itemField),
                min: constraints.min,
                max: constraints.max,
                onChange: (value) => {
                  store.setValue(itemPath, value);
                  store.clearError(itemPath);
                },
                onBlur: () => store.setTouched(itemPath),
              };
              return (
                <Fragment key={itemField.name}>
                  {components.FieldWrapper({
                    span: itemField.span,
                    children: components.TextField(props),
                  }) as ReactNode}
                </Fragment>
              );
            }

            if (itemField.type === "textarea") {
              const props: TextareaFieldProps = {
                name: itemPath,
                value: (itemValue as string) ?? "",
                error: errors[itemPath],
                touched: touched[itemPath] ?? false,
                label: getLabel(itemField, itemField.name),
                rows: itemField.rows,
                onChange: (value) => {
                  store.setValue(itemPath, value);
                  store.clearError(itemPath);
                },
                onBlur: () => store.setTouched(itemPath),
              };
              return (
                <Fragment key={itemField.name}>
                  {components.FieldWrapper({
                    span: itemField.span,
                    children: components.TextareaField(props),
                  }) as ReactNode}
                </Fragment>
              );
            }

            if (itemField.type === "select") {
              const props: SelectFieldProps = {
                name: itemPath,
                value: (itemValue as string) ?? "",
                error: errors[itemPath],
                touched: touched[itemPath] ?? false,
                label: getLabel(itemField, itemField.name),
                options: (itemField.options ?? []) as SelectOption<string>[],
                placeholder: itemField.placeholder,
                onChange: (value) => {
                  store.setValue(itemPath, value);
                  store.clearError(itemPath);
                },
                onBlur: () => store.setTouched(itemPath),
              };
              return (
                <Fragment key={itemField.name}>
                  {components.FieldWrapper({
                    span: itemField.span,
                    children: components.SelectField(props),
                  }) as ReactNode}
                </Fragment>
              );
            }

            return null;
          })}
        </>
      );
    };

    const props: ArrayFieldProps = {
      name,
      value: items,
      error: errors[name],
      touched: touched[name] ?? false,
      label: getLabel(field, name),
      sortable: field.sortable,
      renderItem,
      onChange: (value) => store.setValue(name, value),
      onBlur: () => store.setTouched(name),
      onAdd: () => {
        const newItem = initializeFormData(itemFields);
        store.setValue(name, [...items, newItem]);
      },
      onRemove: (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        store.setValue(name, newItems);
      },
      onMove: (from, to) => {
        if (to < 0 || to >= items.length) return;
        const newItems = [...items];
        [newItems[from], newItems[to]] = [newItems[to], newItems[from]];
        store.setValue(name, newItems);
      },
    };
    return components.ArrayField(props) as ReactNode;
  }

  function renderField(field: FieldDef): ReactNode {
    switch (field.type) {
      case "text":
        return renderTextField(field.name, field);
      case "textarea":
        return renderTextareaField(field.name, field);
      case "select":
        return renderSelectField(field.name, field);
      case "array":
        return renderArrayField(field.name, field);
    }
  }

  return (
    <>
      {components.FormWrapper({
        onSubmit: handleSubmit,
        children: (
          <>
            {form.fields.map((field) => (
              <Fragment key={field.name}>
                {components.FieldWrapper({
                  span: field.span,
                  children: renderField(field),
                }) as ReactNode}
              </Fragment>
            ))}
            {components.SubmitButton({ isSubmitting }) as ReactNode}
          </>
        ),
      }) as ReactNode}
    </>
  );
}
