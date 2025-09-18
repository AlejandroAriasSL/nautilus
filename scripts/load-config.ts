import { Nautilus } from "@lib/defineConfig";
import { existsSync, writeFileSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

export async function loadConfig(): Promise<Nautilus.UserConfig> {
  const projectRoot = process.cwd();
  const configFiles = ["nautilus.config.ts", "nautilus.config.js"];
  let config : Nautilus.UserConfig = { sourceGlob: "src/**/*.ts" };

  for (const file of configFiles) {
    const configPath = resolve(projectRoot, file);
    if (existsSync(configPath)) {
      const configUrl = pathToFileURL(configPath).href
      const configModule = await import(configUrl);
      config =  typeof configModule.default === "function"
        ? configModule.default()
        : configModule.default;
        break;
      }
  }

  return config;
}

const config = await loadConfig();
console.log(JSON.stringify(config));