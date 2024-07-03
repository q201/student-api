/* eslint-disable prettier/prettier */
import { z } from 'zod';

const envConfigSchema = z
  .object({
    ENVIRONMENT: z.string(),
    DB_HOST: z.string(),
    DB_PORT: z.string(),
    DB_USER_NAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
  })
  .partial();
export let envConfig: z.infer<typeof envConfigSchema>;

export async function loadEnvConfig() {
  envConfig = await envConfigSchema.parseAsync(process.env);
}

// export {envConfig}
