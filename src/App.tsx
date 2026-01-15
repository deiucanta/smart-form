import { z } from "zod";
import { useWrappedAppForm } from "@/hooks/form";
import { SmartForm } from "@/components/SmartForm";
import { form } from "@/lib/form-builder";

// TanStack Form schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  city: z.string(),
  zip: z.string().length(5, "ZIP must be 5 characters"),
  country: z.enum(["us", "uk", "ca"]),
  age: z.number().min(18, "Must be at least 18"),
  hobbies: z.array(
    z.object({
      name: z.string().min(1, "Name required"),
      score: z.number().min(1).max(10),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  city: "",
  zip: "",
  country: "us",
  age: 18,
  hobbies: [],
};

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
  const tanstackForm = useWrappedAppForm({
    defaultValues,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("TanStack Form:", value);
    },
  });

  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* TanStack Form */}
        <div>
          <h1 className="text-2xl font-bold mb-6">TanStack Form</h1>
          <tanstackForm.AppForm>
            <tanstackForm.Wrapper>
              <tanstackForm.AppField
                name="firstName"
                children={(field) => (
                  <field.TextField className="col-span-12" />
                )}
              />

              <tanstackForm.AppField
                name="lastName"
                children={(field) => (
                  <field.TextareaField className="col-span-12" rows={3} />
                )}
              />

              <tanstackForm.AppField
                name="city"
                children={(field) => <field.TextField className="col-span-8" />}
              />

              <tanstackForm.AppField
                name="zip"
                children={(field) => (
                  <field.TextField className="col-span-4" label="ZIP Code" />
                )}
              />

              <tanstackForm.AppField
                name="country"
                children={(field) => (
                  <field.SelectField
                    className="col-span-12"
                    placeholder="Select a country..."
                    options={[
                      { value: "us", label: "United States" },
                      { value: "uk", label: "United Kingdom" },
                      { value: "ca", label: "Canada" },
                    ]}
                  />
                )}
              />

              <tanstackForm.AppField
                name="age"
                children={(field) => (
                  <field.NumberField className="col-span-6" min={18} />
                )}
              />

              <tanstackForm.AppField
                name="hobbies"
                mode="array"
                children={(field) => (
                  <field.ArrayField
                    className="col-span-12"
                    sortable
                    defaultItem={{ name: "", score: 1 }}
                    renderItem={(index) => (
                      <>
                        <tanstackForm.AppField
                          name={`hobbies[${index}].name`}
                          children={(subField) => (
                            <subField.TextField className="col-span-8" />
                          )}
                        />
                        <tanstackForm.AppField
                          name={`hobbies[${index}].score`}
                          children={(subField) => (
                            <subField.NumberField
                              className="col-span-4"
                              min={1}
                              max={10}
                            />
                          )}
                        />
                      </>
                    )}
                  />
                )}
              />

              <tanstackForm.SubmitButton className="col-span-12" />
            </tanstackForm.Wrapper>
          </tanstackForm.AppForm>
        </div>

        {/* SmartForm */}
        <div>
          <h1 className="text-2xl font-bold mb-6">SmartForm</h1>
          <SmartForm
            form={smartFormDef}
            initialValues={{
              firstName: "Andrei",
            }}
            onSubmit={(data) => {
              // data is now typed: { firstName, lastName, city, zip, country, age, hobbies }
              console.log("SmartForm:", data.firstName, data.age);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
