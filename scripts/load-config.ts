import { UserConfig } from "@lib/defineConfig";
import { existsSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";

export async function loadConfig(): Promise<UserConfig> {
  const projectRoot = process.cwd();
  const configFiles = ["nautilus.config.ts", "nautilus.config.js"];

  for (const file of configFiles) {
    const configPath = resolve(projectRoot, file);
    if (existsSync(configPath)) {
      const configUrl = pathToFileURL(configPath).href
      const configModule = await import(configUrl);
      return typeof configModule.default === "function"
        ? configModule.default()
        : configModule.default;
    }
  }

  return { sourceGlob: "src/**/*.ts" };
}