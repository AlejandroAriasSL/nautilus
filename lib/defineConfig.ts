export interface UserConfig{
    sourceGlob? : string;
}

export default function defineConfig(config: UserConfig) : UserConfig { 
    return config;
}