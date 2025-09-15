export interface UserConfig {
  sourceGlob?: string;
  outputDir?: string
  test?: {
    testSourceGlob?: string;
    outputDir?: string;
  };
}

export default function defineConfig(config: UserConfig): UserConfig {
  return config;
}
