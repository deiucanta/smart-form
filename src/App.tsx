import { z } from "zod";
import { SmartForm } from "@/components/SmartForm";
import { form } from "@/lib/form-builder";

// SmartForm definition
const smartFormDef = form()
  .text("firstName", {
    schema: z.string().min(1),
  })
  .textarea("lastName", {
    schema: z.string().min(1),
    default: "Canta",
    rows: 3,
  })
  .text("city", { span: 8 })
  .text("zip", {
    schema: z.string().length(5),
    span: 4,
  })
  .select("country", {
    schema: z.enum(["us", "uk", "ca"]),
    placeholder: "Select a country...",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ],
  })
  .text("age", {
    schema: z.number().min(18),
    span: 6,
  })
  .array("hobbies", {
    sortable: true,
    default: [{ name: "Reading", score: 10 }],
    fields: (row) =>
      row
        .text("name", {
          schema: z.string().min(1),
          span: 8,
          default: "Fishing",
        })
        .text("score", {
          schema: z.number().min(1).max(10),
          span: 4,
          default: 10,
        }),
  })
  .custom((f) => (
    <div className="p-3 bg-muted rounded-md">
      Full name:{" "}
      <strong>
        {f.firstName} {f.lastName}
      </strong>{" "}
      ({f.hobbies.length} hobbies)
    </div>
  ));

function App() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">SmartForm</h1>
        <SmartForm
          form={smartFormDef}
          initialValues={{
            firstName: "Andrei",
          }}
          onSubmit={(data) => {
            console.log("SmartForm:", data.firstName, data.age);
          }}
        />
      </div>
    </div>
  );
}

export default App;
