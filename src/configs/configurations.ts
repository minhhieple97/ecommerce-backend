import * as Joi from 'joi';
export interface IAppConfig {
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_SECRET: string;
}

export default (): IAppConfig => {
  const {
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET
  } = process.env;

  const envVariables = {
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET
  };
  const schema = Joi.object<IAppConfig, true>({
    NODE_ENV: Joi.string().required().valid('local', 'development', 'production'),
    MONGODB_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
    JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
    JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  });
  const { error, value } = schema.validate(envVariables, { abortEarly: false });
  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${error.message}`,
    );
  }
  return value;
}