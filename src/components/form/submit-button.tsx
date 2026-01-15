import { Button } from "@/components/ui/button";
import { useFormContext } from "@/hooks/form-context";

interface SubmitButtonProps {
  label?: string;
  className?: string;
}

export function SubmitButton({ label = "Submit", className }: SubmitButtonProps) {
  const form = useFormContext();

  return (
    <div className={className}>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : label}
          </Button>
        )}
      </form.Subscribe>
    </div>
  );
}
