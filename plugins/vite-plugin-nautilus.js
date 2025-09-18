import { spawn } from "child_process";
import { resolve } from "path";

export default function nautilus() {
  const virtualModuleId = "virtual:nautilus";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "nautilus",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {

        const scriptPath = resolve(process.cwd(), "scripts/load-config.ts")
        const configJson = await new Promise((resolve, reject) => {
          const child = spawn("npx", ["tsx", scriptPath], {
            stdio: ["ignore", "pipe", "pipe"],
            shell: true
          });

          let output = "";

          child.stdout.on("data", (data) => (output += data.toString()));
          child.stderr.on("data", (data) => console.error(data.toString()));

          child.on("exit", (code) => {
            if (code === 0) resolve(output.trim());
            else reject(new Error("script failed to launch"));
          });
        });

        const config = JSON.parse(configJson);
        return `export default ${JSON.stringify(config, null, 2)}`;
      }
    },
  };
}
