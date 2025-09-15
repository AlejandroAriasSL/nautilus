#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

function runWithNpx(tool, scriptPath) {
  const child = spawn("npx", [tool, scriptPath], { stdio: "inherit", shell: true });
  child.on("exit", code => process.exit(code ?? 0));
}

switch (command) {
  case "build": {
    const script = resolve(__dirname, "../scripts/generate-autowired.ts");
    runWithNpx("tsx", script);
    break;
  }
  case "dev":
    console.log("Modo desarrollo activado...");
    break;
  default:
    console.log(`Comando desconocido: ${command}`);
    process.exit(1);
}