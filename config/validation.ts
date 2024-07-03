/* eslint-disable prettier/prettier */
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ),
  //   JWT_SECRET: Joi.string().required(),
  //   JWT_EXPIRES_IN: Joi.string().required(),
  PORT: Joi.number().default(3000),
 // DB_USER_NAME: Joi.string().required(),
//   JWT_SECRET: Joi.string().required(),
//   REFRESH_TOKEN_EXPIRY: Joi.string().required(),
//   JWT_VERIFICATION_TOKEN_SECRET: Joi.string().required(),
//   JWT_VERIFICATION_TOKEN_EXPIRATION_TIME: Joi.string().required(),
//   EMAIL_CONFIRMATION_URL: Joi.string().required(),

});