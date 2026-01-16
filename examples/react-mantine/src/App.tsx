import { z } from "zod";
import { Container, Title, Text } from "@mantine/core";
import { form, SmartForm, type InferFormData } from "@smart-form/react-mantine";

const myForm = form()
  .text("firstName", {
    schema: z.string().min(1, "First name is required"),
    label: "First Name",
  })
  .textarea("bio", {
    schema: z.string(),
    label: "Biography",
    rows: 3,
  })
  .text("city", { label: "City", span: 8 })
  .text("zip", {
    schema: z.string().length(5, "ZIP must be 5 characters"),
    label: "ZIP Code",
    span: 4,
  })
  .select("country", {
    schema: z.enum(["us", "uk", "ca"]),
    label: "Country",
    placeholder: "Select a country...",
    options: [
      { value: "us", label: "United States" },
      { value: "uk", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
    ],
  })
  .array("hobbies", {
    label: "Hobbies",
    sortable: true,
    default: [{ name: "Reading", score: 10 }],
    fields: (row) =>
      row
        .text("name", {
          schema: z.string().min(1, "Hobby name required"),
          label: "Name",
          span: 8,
        })
        .text("score", {
          schema: z.coerce.number().min(1).max(10),
          label: "Score (1-10)",
          span: 4,
        }),
  });

type FormData = InferFormData<typeof myForm>;

function App() {
  const handleSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    alert(`Submitted! Name: ${data.firstName}, Country: ${data.country}`);
  };

  return (
    <Container size="sm" py="xl">
      <Title order={1} mb="md">
        Smart Form Demo
      </Title>
      <Text c="dimmed" mb="lg">
        Framework-agnostic form library with React + Mantine UI
      </Text>
      <SmartForm
        form={myForm}
        initialValues={{
          firstName: "Andrei",
        }}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}

export default App;
