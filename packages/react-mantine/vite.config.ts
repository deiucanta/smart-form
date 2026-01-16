import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      include: ["src/**/*.ts", "src/**/*.tsx"],
      outDir: "dist",
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "@mantine/core",
        "@mantine/hooks",
        "@tabler/icons-react",
        "@smart-form/react",
        "@smart-form/core",
      ],
      output: {
        globals: {
          react: "React",
          "@mantine/core": "MantineCore",
          "@mantine/hooks": "MantineHooks",
        },
      },
    },
  },
});
