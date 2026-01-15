import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { z } from "zod";
import { form, type ComponentRegistry } from "@smart-form/core";
import { SmartForm } from "./SmartForm";

// Mock component registry for testing
const mockComponents: ComponentRegistry = {
  TextField: ({ name, value, label, error, onChange, onBlur }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        data-testid={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {error && <span data-testid={`${name}-error`}>{error}</span>}
    </div>
  ),
  TextareaField: ({ name, value, label, error, onChange, onBlur, rows }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        data-testid={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
      />
      {error && <span data-testid={`${name}-error`}>{error}</span>}
    </div>
  ),
  SelectField: ({ name, value, label, options, placeholder, error, onChange, onBlur }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        data-testid={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span data-testid={`${name}-error`}>{error}</span>}
    </div>
  ),
  ArrayField: ({ label, value, renderItem, onAdd, onRemove }) => (
    <div>
      <div>
        <span>{label}</span>
        <button type="button" onClick={onAdd} data-testid="add-item">
          Add
        </button>
      </div>
      {(value as unknown[]).map((_, index) => (
        <div key={index} data-testid={`array-item-${index}`}>
          {renderItem(index)}
          <button
            type="button"
            onClick={() => onRemove(index)}
            data-testid={`remove-item-${index}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  ),
  FormWrapper: ({ children, onSubmit }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  ),
  SubmitButton: ({ isSubmitting }) => (
    <button type="submit" disabled={isSubmitting} data-testid="submit">
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  ),
  FieldWrapper: ({ children }) => <div>{children}</div>,
};

describe("SmartForm", () => {
  describe("rendering", () => {
    it("renders text fields", () => {
      const testForm = form().text("name", { label: "Name" });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      expect(screen.getByTestId("name")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders textarea fields", () => {
      const testForm = form().textarea("bio", { label: "Biography", rows: 5 });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      expect(screen.getByTestId("bio")).toBeInTheDocument();
    });

    it("renders select fields", () => {
      const testForm = form().select("country", {
        schema: z.enum(["us", "uk"]),
        options: [
          { value: "us", label: "USA" },
          { value: "uk", label: "UK" },
        ],
        label: "Country",
      });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      expect(screen.getByTestId("country")).toBeInTheDocument();
      expect(screen.getByText("USA")).toBeInTheDocument();
    });

    it("renders array fields", () => {
      const testForm = form().array("items", {
        fields: (row) => row.text("name"),
        label: "Items",
      });
      render(
        <SmartForm
          form={testForm}
          components={mockComponents}
          initialValues={{ items: [{ name: "Item 1" }] }}
          onSubmit={() => {}}
        />
      );
      expect(screen.getByTestId("add-item")).toBeInTheDocument();
      expect(screen.getByTestId("array-item-0")).toBeInTheDocument();
    });
  });

  describe("field changes", () => {
    it("updates text field value", () => {
      const testForm = form().text("name");
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      const input = screen.getByTestId("name");
      fireEvent.change(input, { target: { value: "John" } });
      expect(input).toHaveValue("John");
    });

    it("updates select field value", () => {
      const testForm = form().select("country", {
        schema: z.enum(["us", "uk"]),
        options: [
          { value: "us", label: "USA" },
          { value: "uk", label: "UK" },
        ],
      });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      const select = screen.getByTestId("country");
      fireEvent.change(select, { target: { value: "uk" } });
      expect(select).toHaveValue("uk");
    });
  });

  describe("array operations", () => {
    it("adds array item", () => {
      const testForm = form().array("items", {
        fields: (row) => row.text("name"),
      });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      const addButton = screen.getByTestId("add-item");
      fireEvent.click(addButton);
      expect(screen.getByTestId("array-item-0")).toBeInTheDocument();
    });

    it("removes array item", () => {
      const testForm = form().array("items", {
        fields: (row) => row.text("name"),
      });
      render(
        <SmartForm
          form={testForm}
          components={mockComponents}
          initialValues={{ items: [{ name: "Item 1" }, { name: "Item 2" }] }}
          onSubmit={() => {}}
        />
      );
      expect(screen.getByTestId("array-item-1")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("remove-item-0"));
      expect(screen.queryByTestId("array-item-1")).not.toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows validation errors on submit", async () => {
      const testForm = form().text("name", {
        schema: z.string().min(1, "Name is required"),
      });
      const onSubmit = vi.fn();
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={onSubmit} />
      );
      fireEvent.click(screen.getByTestId("submit"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("clears error when field changes", async () => {
      const testForm = form().text("name", {
        schema: z.string().min(1, "Name is required"),
      });
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={() => {}} />
      );
      fireEvent.click(screen.getByTestId("submit"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toBeInTheDocument();
      });
      fireEvent.change(screen.getByTestId("name"), { target: { value: "John" } });
      expect(screen.queryByTestId("name-error")).not.toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("calls onSubmit with valid data", async () => {
      const testForm = form()
        .text("name", { schema: z.string().min(1) })
        .text("age", { schema: z.coerce.number().min(0) });
      const onSubmit = vi.fn();
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={onSubmit} />
      );
      fireEvent.change(screen.getByTestId("name"), { target: { value: "John" } });
      fireEvent.change(screen.getByTestId("age"), { target: { value: "25" } });
      fireEvent.click(screen.getByTestId("submit"));
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({ name: "John", age: 25 });
      });
    });

    it("sets submitting state during async submit", async () => {
      const testForm = form().text("name", { schema: z.string().min(1) });
      let resolveSubmit: () => void;
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      );
      render(
        <SmartForm form={testForm} components={mockComponents} onSubmit={onSubmit} />
      );
      fireEvent.change(screen.getByTestId("name"), { target: { value: "John" } });
      fireEvent.click(screen.getByTestId("submit"));
      await waitFor(() => {
        expect(screen.getByTestId("submit")).toHaveTextContent("Submitting...");
      });
      resolveSubmit!();
      await waitFor(() => {
        expect(screen.getByTestId("submit")).toHaveTextContent("Submit");
      });
    });
  });
});
