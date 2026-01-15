import { describe, it, expect } from "vitest";
import { createFormStore } from "./store";

describe("FormStore", () => {
  describe("initial state", () => {
    it("initializes with provided values", () => {
      const store = createFormStore({ name: "John", age: 25 });
      expect(store.$values.get()).toEqual({ name: "John", age: 25 });
      expect(store.$errors.get()).toEqual({});
      expect(store.$touched.get()).toEqual({});
      expect(store.$isSubmitting.get()).toBe(false);
    });
  });

  describe("setValue", () => {
    it("sets simple value", () => {
      const store = createFormStore({ name: "" });
      store.setValue("name", "John");
      expect(store.$values.get().name).toBe("John");
    });

    it("sets nested value with dot notation", () => {
      const store = createFormStore({ user: { name: "" } });
      store.setValue("user.name", "John");
      expect(store.$values.get().user.name).toBe("John");
    });

    it("sets array item value", () => {
      const store = createFormStore({ items: [{ name: "A" }, { name: "B" }] });
      store.setValue("items.1.name", "Updated");
      expect(store.$values.get().items[1].name).toBe("Updated");
    });
  });

  describe("errors", () => {
    it("sets error", () => {
      const store = createFormStore({ name: "" });
      store.setError("name", "Required");
      expect(store.$errors.get().name).toBe("Required");
    });

    it("clears error", () => {
      const store = createFormStore({ name: "" });
      store.setError("name", "Required");
      store.clearError("name");
      expect(store.$errors.get().name).toBeUndefined();
    });
  });

  describe("touched", () => {
    it("sets touched", () => {
      const store = createFormStore({ name: "" });
      store.setTouched("name");
      expect(store.$touched.get().name).toBe(true);
    });
  });

  describe("isSubmitting", () => {
    it("sets submitting state", () => {
      const store = createFormStore({});
      store.setSubmitting(true);
      expect(store.$isSubmitting.get()).toBe(true);
      store.setSubmitting(false);
      expect(store.$isSubmitting.get()).toBe(false);
    });
  });

  describe("reset", () => {
    it("resets to initial values", () => {
      const store = createFormStore({ name: "John" });
      store.setValue("name", "Jane");
      store.setError("name", "Error");
      store.setTouched("name");
      store.setSubmitting(true);

      store.reset();

      expect(store.$values.get().name).toBe("John");
      expect(store.$errors.get()).toEqual({});
      expect(store.$touched.get()).toEqual({});
      expect(store.$isSubmitting.get()).toBe(false);
    });

    it("resets to custom values", () => {
      const store = createFormStore({ name: "John" });
      store.reset({ name: "Custom" });
      expect(store.$values.get().name).toBe("Custom");
    });
  });

  describe("getSnapshot", () => {
    it("returns current state", () => {
      const store = createFormStore({ name: "John" });
      store.setError("name", "Error");
      store.setTouched("name");
      store.setSubmitting(true);

      const snapshot = store.getSnapshot();
      expect(snapshot).toEqual({
        values: { name: "John" },
        errors: { name: "Error" },
        touched: { name: true },
        isSubmitting: true,
      });
    });
  });
});
