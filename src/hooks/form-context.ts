import { createFormHookContexts } from "@tanstack/react-form";

// Create form contexts - these are exported separately to avoid circular dependencies
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
