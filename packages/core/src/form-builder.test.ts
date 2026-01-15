import { describe, it, expect } from "vitest";
import { z } from "zod";
import { form, type InferFormData } from "./form-builder";

describe("FormBuilder", () => {
  describe("text field", () => {
    it("creates a text field with defaults", () => {
      const f = form().text("name");
      expect(f.fields).toHaveLength(1);
      expect(f.fields[0]).toMatchObject({
        type: "text",
        name: "name",
      });
    });

    it("creates a text field with custom schema", () => {
      const f = form().text("email", {
        schema: z.string().email(),
        label: "Email",
        span: 6,
      });
      expect(f.fields[0]).toMatchObject({
        type: "text",
        name: "email",
        label: "Email",
        span: 6,
      });
    });
  });

  describe("textarea field", () => {
    it("creates a textarea field", () => {
      const f = form().textarea("bio", { rows: 5, label: "Biography" });
      expect(f.fields[0]).toMatchObject({
        type: "textarea",
        name: "bio",
        rows: 5,
        label: "Biography",
      });
    });
  });

  describe("select field", () => {
    it("creates a select field with options", () => {
      const f = form().select("country", {
        schema: z.enum(["us", "uk", "ca"]),
        options: [
          { value: "us", label: "United States" },
          { value: "uk", label: "United Kingdom" },
          { value: "ca", label: "Canada" },
        ],
        placeholder: "Select country",
      });
      expect(f.fields[0]).toMatchObject({
        type: "select",
        name: "country",
        placeholder: "Select country",
      });
      expect(f.fields[0].type === "select" && f.fields[0].options).toHaveLength(3);
    });
  });

  describe("array field", () => {
    it("creates an array field with nested fields", () => {
      const f = form().array("hobbies", {
        fields: (row) =>
          row
            .text("name", { schema: z.string().min(1) })
            .text("years", { schema: z.number() }),
        sortable: true,
      });
      expect(f.fields[0]).toMatchObject({
        type: "array",
        name: "hobbies",
        sortable: true,
      });
      expect(f.fields[0].type === "array" && f.fields[0].fields).toHaveLength(2);
    });
  });

  describe("chaining", () => {
    it("chains multiple fields", () => {
      const f = form()
        .text("firstName")
        .text("lastName")
        .textarea("bio")
        .select("country", {
          schema: z.enum(["us"]),
          options: [{ value: "us", label: "US" }],
        });
      expect(f.fields).toHaveLength(4);
    });

    it("immutable - each call returns new builder", () => {
      const f1 = form().text("a");
      const f2 = f1.text("b");
      expect(f1.fields).toHaveLength(1);
      expect(f2.fields).toHaveLength(2);
    });
  });

  describe("fieldMap", () => {
    it("provides lookup by name", () => {
      const f = form().text("firstName").text("lastName");
      expect(f.fieldMap.firstName).toBeDefined();
      expect(f.fieldMap.lastName).toBeDefined();
      expect(f.fieldMap.firstName.name).toBe("firstName");
    });
  });

  describe("toZod", () => {
    it("generates zod schema", () => {
      const f = form()
        .text("name", { schema: z.string().min(1) })
        .text("age", { schema: z.number().min(0) });

      const schema = f.toZod();
      expect(schema.safeParse({ name: "John", age: 25 }).success).toBe(true);
      expect(schema.safeParse({ name: "", age: 25 }).success).toBe(false);
      expect(schema.safeParse({ name: "John", age: -1 }).success).toBe(false);
    });

    it("generates schema for array fields", () => {
      const f = form().array("items", {
        fields: (row) => row.text("name", { schema: z.string().min(1) }),
      });

      const schema = f.toZod();
      expect(schema.safeParse({ items: [{ name: "Item 1" }] }).success).toBe(true);
      expect(schema.safeParse({ items: [{ name: "" }] }).success).toBe(false);
    });
  });

  describe("type inference", () => {
    it("infers correct types", () => {
      const f = form()
        .text("name", { schema: z.string() })
        .text("age", { schema: z.number() })
        .select("country", {
          schema: z.enum(["us", "uk"]),
          options: [
            { value: "us", label: "US" },
            { value: "uk", label: "UK" },
          ],
        });

      type Data = InferFormData<typeof f>;
      // Type check - this should compile
      const _data: Data = { name: "John", age: 25, country: "us" };
      expect(_data).toBeDefined();
    });
  });
});
