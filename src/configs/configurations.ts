import * as Joi from 'joi';
export interface IAppConfig {
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
}

export default (): IAppConfig => {
  const values = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
  };
  const schema = Joi.object<IAppConfig, true>({
    NODE_ENV: Joi.string().required().valid('local', 'development', 'production'),
    MONGODB_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().required()
  });
  const { error } = schema.validate(values, { abortEarly: false });
  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing?
        ${error.message}`,
    );
  }
  return values;
}