"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type {
  ComponentRegistry,
  TextFieldProps,
  TextareaFieldProps,
  SelectFieldProps,
  ArrayFieldProps,
  FormWrapperProps,
  SubmitButtonProps,
  FieldWrapperProps,
  SpanValue,
} from "@smart-form/core";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getSpanClass(span?: SpanValue): string {
  const spanClasses: Record<SpanValue, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };
  return spanClasses[span ?? 12];
}

export const shadcnComponents: ComponentRegistry = {
  TextField: ({
    name,
    value,
    error,
    label,
    inputType = "text",
    min,
    max,
    step,
    placeholder,
    onChange,
    onBlur,
  }: TextFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type={inputType}
        value={value as string}
        onChange={(e) => {
          const val =
            inputType === "number" && e.target.value !== ""
              ? Number(e.target.value)
              : e.target.value;
          onChange(val);
        }}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  TextareaField: ({
    name,
    value,
    error,
    label,
    rows = 3,
    placeholder,
    onChange,
    onBlur,
  }: TextareaFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea
        id={name}
        name={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  SelectField: ({
    name,
    value,
    error,
    label,
    options,
    placeholder,
    onChange,
    onBlur,
  }: SelectFieldProps) => (
    <div className="space-y-2">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Select
        value={value as string}
        onValueChange={onChange}
      >
        <SelectTrigger
          id={name}
          className="w-full"
          aria-invalid={!!error}
          onBlur={onBlur}
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  ),

  ArrayField: ({
    name,
    value,
    error,
    label,
    sortable,
    renderItem,
    onAdd,
    onRemove,
    onMove,
  }: ArrayFieldProps) => {
    const items = value as unknown[];
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {label && <Label>{label}</Label>}
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {items.map((_, index) => (
          <div
            key={index}
            className="flex gap-2 items-start p-3 border rounded-md"
          >
            {sortable && (
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMove(index, index - 1)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMove(index, index + 1)}
                  disabled={index === items.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="flex-1 grid grid-cols-12 gap-2">
              {renderItem(index) as React.ReactNode}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },

  FormWrapper: ({ children, onSubmit }: FormWrapperProps) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-12 gap-4">{children as React.ReactNode}</div>
    </form>
  ),

  SubmitButton: ({ isSubmitting, children }: SubmitButtonProps) => (
    <div className="col-span-12">
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : (children as React.ReactNode) ?? "Submit"}
      </Button>
    </div>
  ),

  FieldWrapper: ({ span, children }: FieldWrapperProps) => (
    <div className={getSpanClass(span)}>{children as React.ReactNode}</div>
  ),
};
