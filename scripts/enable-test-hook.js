import { execSync } from "child_process";

try {
  console.log("⚡ Generando metadata antes de los tests...");
  execSync("npx nautilus build", {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, TEST: "test" },
  });
} catch (err) {
  console.error("Error generando metadata:", err);
  process.exit(1);
}
