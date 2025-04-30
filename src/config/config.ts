import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenvConfig({ path: path.resolve(process.cwd(), envFile) });

// Schema validation
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  API_URL: z.string().url(),
  ACCESS_TOKEN: z.string().min(1),
});

type EnvVars = z.infer<typeof EnvSchema>;

class Config {
  private static instance: Config;
  public readonly env: EnvVars;

  private constructor() {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
      process.exit(1);
    }

    this.env = parsed.data;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const config = Config.getInstance().env;
