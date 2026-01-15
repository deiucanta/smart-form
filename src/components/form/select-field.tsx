import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/hooks/form-context";
import { cn, fieldNameToLabel } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function SelectField({
  label,
  options,
  placeholder,
  className,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const displayLabel = label ?? fieldNameToLabel(field.name);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={field.name} data-invalid={hasError || undefined}>
        {displayLabel}
      </Label>
      <Select
        value={field.state.value ?? ""}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={hasError}
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors.map((e) => e.message).join(", ")}
        </p>
      )}
    </div>
  );
}
