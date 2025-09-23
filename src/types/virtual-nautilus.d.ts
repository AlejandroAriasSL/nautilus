declare module "virtual:nautilus" {
  interface UserConfig {
    sourceGlob?: string;
    outputDir?: string;
    basePath?: string;
    test?: {
      testSourceGlob?: string;
      outputDir?: string;
    };
  }

  const config: UserConfig;
  export default config;
}

