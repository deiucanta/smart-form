import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/form-context";
import { cn, fieldNameToLabel } from "@/lib/utils";

interface TextFieldProps {
  label?: string;
  type?: "text" | "number" | "email" | "password";
  placeholder?: string;
  className?: string;
}

export function TextField({
  label,
  type = "text",
  placeholder,
  className,
}: TextFieldProps) {
  const field = useFieldContext<string | number>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const displayLabel = label ?? fieldNameToLabel(field.name);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={field.name} data-invalid={hasError || undefined}>
        {displayLabel}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value ?? ""}
        onChange={(e) => {
          const value = type === "number" ? Number(e.target.value) : e.target.value;
          field.handleChange(value as string & number);
        }}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors.map((e) => e.message).join(", ")}
        </p>
      )}
    </div>
  );
}
