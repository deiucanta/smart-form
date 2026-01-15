import { atom, map } from "nanostores";

export interface FormStoreState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

export interface FormStore<T extends object = Record<string, unknown>> {
  $values: ReturnType<typeof map<T>>;
  $errors: ReturnType<typeof map<Record<string, string>>>;
  $touched: ReturnType<typeof map<Record<string, boolean>>>;
  $isSubmitting: ReturnType<typeof atom<boolean>>;
  setValue: (path: string, value: unknown) => void;
  setError: (path: string, error: string) => void;
  clearError: (path: string) => void;
  setTouched: (path: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  reset: (values?: T) => void;
  getSnapshot: () => FormStoreState<T>;
}

// Deep set helper for nested paths like "hobbies.0.name"
function deepSet<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const result = { ...obj } as T & Record<string, unknown>;
  let current: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextArray = /^\d+$/.test(nextKey);

    if (Array.isArray(current[key])) {
      current[key] = [...current[key]];
    } else if (typeof current[key] === "object" && current[key] !== null) {
      current[key] = { ...current[key] };
    } else {
      current[key] = isNextArray ? [] : {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return result;
}

export function createFormStore<T extends object>(
  initialValues: T
): FormStore<T> {
  const $values = map<T>(initialValues);
  const $errors = map<Record<string, string>>({});
  const $touched = map<Record<string, boolean>>({});
  const $isSubmitting = atom(false);

  return {
    $values,
    $errors,
    $touched,
    $isSubmitting,

    setValue(path: string, value: unknown) {
      const current = $values.get();
      $values.set(deepSet(current, path, value));
    },

    setError(path: string, error: string) {
      $errors.setKey(path, error);
    },

    clearError(path: string) {
      const current = $errors.get();
      if (path in current) {
        const next = { ...current };
        delete next[path];
        $errors.set(next);
      }
    },

    setTouched(path: string) {
      $touched.setKey(path, true);
    },

    setSubmitting(isSubmitting: boolean) {
      $isSubmitting.set(isSubmitting);
    },

    reset(values?: T) {
      $values.set(values ?? initialValues);
      $errors.set({});
      $touched.set({});
      $isSubmitting.set(false);
    },

    getSnapshot(): FormStoreState<T> {
      return {
        values: $values.get(),
        errors: $errors.get(),
        touched: $touched.get(),
        isSubmitting: $isSubmitting.get(),
      };
    },
  };
}
