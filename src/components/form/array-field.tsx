import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFieldContext } from "@/hooks/form-context";
import { cn, fieldNameToLabel } from "@/lib/utils";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

interface ArrayFieldProps<T> {
  label?: string;
  sortable?: boolean;
  className?: string;
  renderItem: (index: number) => React.ReactNode;
  defaultItem: T;
}

export function ArrayField<T>({
  label,
  sortable = false,
  className,
  renderItem,
  defaultItem,
}: ArrayFieldProps<T>) {
  const field = useFieldContext<T[]>();
  const items = field.state.value ?? [];
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;
  const displayLabel = label ?? fieldNameToLabel(field.name);

  const addItem = () => {
    field.pushValue(defaultItem);
  };

  const removeItem = (index: number) => {
    field.removeValue(index);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    field.swapValues(index, newIndex);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label data-invalid={hasError || undefined}>{displayLabel}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {items.length > 0 && (
        <div className="rounded-md border">
          {items.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-2 items-start p-3",
                index !== 0 && "border-t"
              )}
            >
              {sortable && (
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex-1 grid grid-cols-12 gap-2">
                {renderItem(index)}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {hasError && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors.map((e) => e.message).join(", ")}
        </p>
      )}
    </div>
  );
}
