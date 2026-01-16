import { defineComponent, type PropType, type VNode } from "vue";
import { useStore } from "@nanostores/vue";
import {
  createFormStore,
  validate,
  type FormDef,
  type FieldDef,
  type TextFieldProps,
  type TextareaFieldProps,
  type SelectFieldProps,
  type ArrayFieldProps,
  type SelectOption,
} from "@smart-form/core";
import type { VueComponentRegistry } from "./component-registry";

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
  const zodDef = (field.validator as { _zod?: { def?: { type?: string } } })._zod?.def;
  if (zodDef?.type === "number") return "number";
  return "text";
}

function getNumberConstraints(field: FieldDef): { min?: number; max?: number } {
  if (field.type !== "text") return {};
  const bag = (field.validator as { _zod?: { bag?: { minimum?: number; maximum?: number } } })._zod?.bag;
  return { min: bag?.minimum, max: bag?.maximum };
}

export const SmartForm = defineComponent({
  name: "SmartForm",
  props: {
    form: {
      type: Object as PropType<FormDef>,
      required: true,
    },
    components: {
      type: Object as PropType<VueComponentRegistry>,
      required: true,
    },
    initialValues: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
onSubmit: {
      type: Function as PropType<(data: unknown) => void | Promise<void>>,
      required: true,
    },
  },
  setup(props) {
    const store = createFormStore({
      ...initializeFormData(props.form.fields),
      ...props.initialValues,
    } as Record<string, unknown>);

    const values = useStore(store.$values);
    const errors = useStore(store.$errors);
    const touched = useStore(store.$touched);
    const isSubmitting = useStore(store.$isSubmitting);

    const handleSubmit = async () => {
      const schema = props.form.toZod();
      const result = validate(schema, values.value);

      if (!result.success) {
        for (const error of result.errors ?? []) {
          store.setError(error.path, error.message);
        }
        return;
      }

      store.setSubmitting(true);
      try {
        await props.onSubmit(result.data);
      } finally {
        store.setSubmitting(false);
      }
    };

    function renderTextField(name: string, field: FieldDef & { type: "text" }): VNode {
      const constraints = getNumberConstraints(field);
      const fieldProps: TextFieldProps = {
        name,
        value: (values.value[name] as string | number) ?? "",
        error: errors.value[name],
        touched: touched.value[name] ?? false,
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
      return props.components.TextField(fieldProps);
    }

    function renderTextareaField(name: string, field: FieldDef & { type: "textarea" }): VNode {
      const fieldProps: TextareaFieldProps = {
        name,
        value: (values.value[name] as string) ?? "",
        error: errors.value[name],
        touched: touched.value[name] ?? false,
        label: getLabel(field, name),
        rows: field.rows,
        onChange: (value) => {
          store.setValue(name, value);
          store.clearError(name);
        },
        onBlur: () => store.setTouched(name),
      };
      return props.components.TextareaField(fieldProps);
    }

    function renderSelectField(name: string, field: FieldDef & { type: "select" }): VNode {
      const fieldProps: SelectFieldProps = {
        name,
        value: (values.value[name] as string) ?? "",
        error: errors.value[name],
        touched: touched.value[name] ?? false,
        label: getLabel(field, name),
        options: (field.options ?? []) as SelectOption<string>[],
        placeholder: field.placeholder,
        onChange: (value) => {
          store.setValue(name, value);
          store.clearError(name);
        },
        onBlur: () => store.setTouched(name),
      };
      return props.components.SelectField(fieldProps);
    }

    function renderArrayField(name: string, field: FieldDef & { type: "array" }): VNode {
      const items = (values.value[name] as unknown[]) ?? [];
      const itemFields = field.fields ?? [];

      const renderItem = (index: number): VNode[] => {
        const item = items[index] as Record<string, unknown>;
        return itemFields.map((itemField) => {
          const itemPath = `${name}.${index}.${itemField.name}`;
          const itemValue = item?.[itemField.name];

          if (itemField.type === "text") {
            const constraints = getNumberConstraints(itemField);
            const fieldProps: TextFieldProps = {
              name: itemPath,
              value: (itemValue as string | number) ?? "",
              error: errors.value[itemPath],
              touched: touched.value[itemPath] ?? false,
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
            return props.components.FieldWrapper({
              span: itemField.span,
              children: props.components.TextField(fieldProps),
            });
          }

          if (itemField.type === "textarea") {
            const fieldProps: TextareaFieldProps = {
              name: itemPath,
              value: (itemValue as string) ?? "",
              error: errors.value[itemPath],
              touched: touched.value[itemPath] ?? false,
              label: getLabel(itemField, itemField.name),
              rows: itemField.rows,
              onChange: (value) => {
                store.setValue(itemPath, value);
                store.clearError(itemPath);
              },
              onBlur: () => store.setTouched(itemPath),
            };
            return props.components.FieldWrapper({
              span: itemField.span,
              children: props.components.TextareaField(fieldProps),
            });
          }

          if (itemField.type === "select") {
            const fieldProps: SelectFieldProps = {
              name: itemPath,
              value: (itemValue as string) ?? "",
              error: errors.value[itemPath],
              touched: touched.value[itemPath] ?? false,
              label: getLabel(itemField, itemField.name),
              options: (itemField.options ?? []) as SelectOption<string>[],
              placeholder: itemField.placeholder,
              onChange: (value) => {
                store.setValue(itemPath, value);
                store.clearError(itemPath);
              },
              onBlur: () => store.setTouched(itemPath),
            };
            return props.components.FieldWrapper({
              span: itemField.span,
              children: props.components.SelectField(fieldProps),
            });
          }

          return null as unknown as VNode;
        });
      };

      const arrayProps: ArrayFieldProps = {
        name,
        value: items,
        error: errors.value[name],
        touched: touched.value[name] ?? false,
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
      return props.components.ArrayField(arrayProps);
    }

    function renderField(field: FieldDef): VNode {
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

    return () => {
      const fieldNodes = props.form.fields.map((field) =>
        props.components.FieldWrapper({
          span: field.span,
          children: renderField(field),
        })
      );

      return props.components.FormWrapper({
        onSubmit: handleSubmit,
        children: [
          ...fieldNodes,
          props.components.SubmitButton({ isSubmitting: isSubmitting.value }),
        ],
      });
    };
  },
});
