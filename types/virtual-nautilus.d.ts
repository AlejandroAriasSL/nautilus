declare module "virtual:nautilus" {
  import type { Nautilus } from "@lib/defineConfig";
  const config: Nautilus.UserConfig;
  export default config;
}