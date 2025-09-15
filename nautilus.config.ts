import defineConfig from "@lib/defineConfig";
import path from "path";

export default defineConfig({
  sourceGlob: "lib/**/*.ts",
  test: {
    testSourceGlob: "test/**/*.ts",
    outputDir: path.join("build", "generated"),
  },
});
