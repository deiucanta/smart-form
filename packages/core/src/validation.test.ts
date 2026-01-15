import { describe, it, expect } from "vitest";
import { z } from "zod";
import { validate } from "./validation";

describe("validate", () => {
  it("returns success for valid data", () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = validate(schema, { name: "John" });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ name: "John" });
  });

  it("returns errors for invalid data", () => {
    const schema = z.object({ name: z.string().min(1) });
    const result = validate(schema, { name: "" });
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors?.[0].path).toBe("name");
  });

  it("handles nested paths", () => {
    const schema = z.object({
      user: z.object({ email: z.string().email() }),
    });
    const result = validate(schema, { user: { email: "invalid" } });
    expect(result.success).toBe(false);
    expect(result.errors?.[0].path).toBe("user.email");
  });

  it("handles array paths", () => {
    const schema = z.object({
      items: z.array(z.object({ name: z.string().min(1) })),
    });
    const result = validate(schema, { items: [{ name: "" }] });
    expect(result.success).toBe(false);
    expect(result.errors?.[0].path).toBe("items.0.name");
  });

  it("collects multiple errors", () => {
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });
    const result = validate(schema, { name: "", email: "invalid" });
    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
