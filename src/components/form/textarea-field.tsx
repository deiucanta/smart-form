import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/hooks/form-context";
import { cn, fieldNameToLabel } from "@/lib/utils";

interface TextareaFieldProps {
  label?: string;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export function TextareaField({
  label,
  rows = 3,
  placeholder,
  className,
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const displayLabel = label ?? fieldNameToLabel(field.name);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={field.name} data-invalid={hasError || undefined}>
        {displayLabel}
      </Label>
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        rows={rows}
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
