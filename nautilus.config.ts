import { Nautilus } from "@lib/defineConfig";
import path from "path";

export default Nautilus.defineConfig({
  sourceGlob: "lib/**/*.ts",
  basePath: "/",
  test: {
    testSourceGlob: "test/**/*.ts",
    outputDir: path.join("build", "generated"),
  },
});
