import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type {
  ComponentRegistry,
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
  SpanValue,
} from "@smart-form/core";
import { cn } from "./utils";

// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md gap-1.5 px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Input component
function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "placeholder:text-muted-foreground border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

// Label component
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        className
      )}
      {...props}
    />
  );
}

// Span class helper
function getSpanClass(span?: SpanValue): string {
  const spanClasses: Record<SpanValue, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };
  return spanClasses[span ?? 12];
}

// Component Registry Implementation
export const shadcnComponents: ComponentRegistry = {
  TextField: ({
    name,
    value,
    error,
    label,
    inputType = "text",
    min,
    max,
    step,
    placeholder,
    onChange,
    onBlur,
  }: TextFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type={inputType}
        value={value as string}
        onChange={(e) => {
          const val =
            inputType === "number" && e.target.value !== ""
              ? Number(e.target.value)
              : e.target.value;
          onChange(val);
        }}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  TextareaField: ({
    name,
    value,
    error,
    label,
    rows = 3,
    placeholder,
    onChange,
    onBlur,
  }: TextareaFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <textarea
        id={name}
        name={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          "placeholder:text-muted-foreground border-input min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  SelectField: ({
    name,
    value,
    error,
    label,
    options,
    placeholder,
    onChange,
    onBlur,
  }: SelectFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <select
        id={name}
        name={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-invalid={!!error}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  ArrayField: ({
    name,
    value,
    error,
    label,
    sortable,
    renderItem,
    onAdd,
    onRemove,
    onMove,
  }: ArrayFieldProps) => {
    const items = value as unknown[];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {label && <Label>{label}</Label>}
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {items.map((_, index) => (
          <div
            key={index}
            className="flex gap-2 items-start p-3 border rounded-md"
          >
            {sortable && (
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMove(index, index - 1)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMove(index, index + 1)}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex-1 grid grid-cols-12 gap-2">
              {renderItem(index) as React.ReactNode}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },

  FormWrapper: ({ children, onSubmit }: FormWrapperProps) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-12 gap-4">{children as React.ReactNode}</div>
    </form>
  ),

  SubmitButton: ({ isSubmitting, children }: SubmitButtonProps) => (
    <div className="col-span-12">
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : (children as React.ReactNode) ?? "Submit"}
      </Button>
    </div>
  ),

  FieldWrapper: ({ span, children }: FieldWrapperProps) => (
    <div className={getSpanClass(span)}>{children as React.ReactNode}</div>
  ),
};
