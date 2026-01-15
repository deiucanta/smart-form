import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/form-context";
import { cn, fieldNameToLabel } from "@/lib/utils";

interface NumberFieldProps {
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberField({
  label,
  placeholder,
  min,
  max,
  step,
  className,
}: NumberFieldProps) {
  const field = useFieldContext<number>();
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
        type="number"
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
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
