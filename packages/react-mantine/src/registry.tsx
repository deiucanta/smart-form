import type { ReactNode } from "react";
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Stack,
  Paper,
  ActionIcon,
  Grid,
  Group,
  Text,
} from "@mantine/core";
import {
  IconPlus,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import type {
  ComponentRegistry,
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
} from "@smart-form/react";

function getGridSpan(span?: number | { sm?: number; md?: number; lg?: number }): {
  span?: number | { base?: number; sm?: number; md?: number; lg?: number };
} {
  if (typeof span === "number") {
    return { span };
  }
  if (span && typeof span === "object") {
    return {
      span: {
        base: 12,
        sm: span.sm,
        md: span.md,
        lg: span.lg,
      },
    };
  }
  return { span: 12 };
}

export const mantineRegistry: ComponentRegistry = {
  TextField: (props: TextFieldProps): ReactNode => {
    return (
      <TextInput
        name={props.name}
        value={String(props.value ?? "")}
        onChange={(e) => {
          const val = e.currentTarget.value;
          props.onChange(props.inputType === "number" ? (val === "" ? "" : Number(val)) : val);
        }}
        onBlur={() => props.onBlur()}
        label={props.label}
        type={props.inputType ?? "text"}
        min={props.min}
        max={props.max}
        step={props.step}
        placeholder={props.placeholder}
        error={props.touched && props.error ? props.error : undefined}
      />
    );
  },

  TextareaField: (props: TextareaFieldProps): ReactNode => {
    return (
      <Textarea
        name={props.name}
        value={props.value ?? ""}
        onChange={(e) => props.onChange(e.currentTarget.value)}
        onBlur={() => props.onBlur()}
        label={props.label}
        rows={props.rows ?? 3}
        placeholder={props.placeholder}
        error={props.touched && props.error ? props.error : undefined}
      />
    );
  },

  SelectField: (props: SelectFieldProps): ReactNode => {
    return (
      <Select
        name={props.name}
        value={props.value || null}
        onChange={(value) => props.onChange(value ?? "")}
        onBlur={() => props.onBlur()}
        label={props.label}
        data={props.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }))}
        placeholder={props.placeholder}
        error={props.touched && props.error ? props.error : undefined}
      />
    );
  },

  ArrayField: (props: ArrayFieldProps): ReactNode => {
    const items = props.value ?? [];

    return (
      <Stack gap="sm">
        {props.label && (
          <Text fw={500} size="sm">
            {props.label}
          </Text>
        )}
        {items.map((_, index) => (
          <Paper key={index} withBorder p="sm">
            <Group align="flex-start" gap="sm" wrap="nowrap">
              {props.sortable && (
                <Stack gap={4}>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => props.onMove(index, index - 1)}
                  >
                    <IconChevronUp size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    disabled={index === items.length - 1}
                    onClick={() => props.onMove(index, index + 1)}
                  >
                    <IconChevronDown size={16} />
                  </ActionIcon>
                </Stack>
              )}
              <Grid gutter="sm" style={{ flex: 1 }}>
                {props.renderItem(index) as ReactNode}
              </Grid>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => props.onRemove(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
        <Button
          variant="outline"
          size="sm"
          leftSection={<IconPlus size={16} />}
          onClick={() => props.onAdd()}
        >
          Add Item
        </Button>
        {props.touched && props.error && (
          <Text c="red" size="sm">
            {props.error}
          </Text>
        )}
      </Stack>
    );
  },

  FormWrapper: (props: FormWrapperProps): ReactNode => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSubmit();
        }}
      >
        <Grid gutter="md">{props.children as ReactNode}</Grid>
      </form>
    );
  },

  SubmitButton: (props: SubmitButtonProps): ReactNode => {
    return (
      <Grid.Col span={12}>
        <Button type="submit" loading={props.isSubmitting}>
          {(props.children as ReactNode) ?? "Submit"}
        </Button>
      </Grid.Col>
    );
  },

  FieldWrapper: (props: FieldWrapperProps): ReactNode => {
    const gridProps = getGridSpan(props.span);
    return <Grid.Col {...gridProps}>{props.children as ReactNode}</Grid.Col>;
  },
};
