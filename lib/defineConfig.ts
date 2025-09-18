export namespace Nautilus {
  export interface UserConfig {
    sourceGlob?: string;
    outputDir?: string;
    basePath?: string;
    test?: {
      testSourceGlob?: string;
      outputDir?: string;
    };
  }

  export function defineConfig(config: UserConfig): UserConfig {
    return config;
  }
}
