import { useFormContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";

interface FormWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function Wrapper({ children, className }: FormWrapperProps) {
  const form = useFormContext();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className={cn("grid grid-cols-12 gap-4", className)}>
        {children}
      </div>
    </form>
  );
}
