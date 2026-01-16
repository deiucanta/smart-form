<script setup lang="ts">
import { z } from "zod";
import { form, SmartForm, type InferFormData } from "@smart-form/vue";
import { vuetifyComponents } from "./registry/vuetify-components";

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

const initialValues = {
  firstName: "Andrei",
};

function handleSubmit(data: unknown) {
  const formData = data as FormData;
  console.log("Form submitted:", formData);
  alert(`Submitted! Name: ${formData.firstName}, Country: ${formData.country}`);
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <h1 class="text-h4 font-weight-bold mb-2">Smart Form Demo</h1>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Framework-agnostic form library with Vue 3 + Vuetify
            </p>
            <SmartForm
              :form="myForm"
              :components="vuetifyComponents"
              :initial-values="initialValues"
              :on-submit="handleSubmit"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
