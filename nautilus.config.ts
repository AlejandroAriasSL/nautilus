import { defineConfig } from "@lib/defineConfig";
import path from "path";

export default defineConfig({
  sourceGlob: "src/lib/**/*.ts",
  basePath: "/",
  test: {
    testSourceGlob: "test/**/*.ts",
    outputDir: path.join("build", "generated"),
  },
});
