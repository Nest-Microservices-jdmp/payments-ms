import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET: string;
  NATS_SERVERS: string[];
  STRIPE_ENDPOINT_SECRET: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string().required()),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  STRIPE_SECRET: process.env.STRIPE_SECRET,
  STRIPE_STRIPE_ENDPOINT_SECRET: process.env.STRIPE_STRIPE_ENDPOINT_SECRET,
  SUCCESS_URL: process.env.SUCCESS_URL,
  CANCEL_URL: process.env.CANCEL_URL,
});

if (error) {
  throw new Error(`Config validation error : ${error.message}`);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  NATS_SERVERS: envVars.NATS_SERVERS,
  STRIPE_SECRET: envVars.STRIPE_SECRET,
  STRIPE_ENDPOINT_SECRET: envVars.STRIPE_ENDPOINT_SECRET,
  SUCCESS_URL: envVars.SUCCESS_URL,
  CANCEL_URL: envVars.CANCEL_URL,
};
