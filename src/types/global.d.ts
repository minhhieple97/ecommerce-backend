import { UserDocument } from 'src/users/schemas/user.schema';
export declare global {
  type AnyObject = Record<string, unknown>;
  namespace Express {
    interface Request {
      // customProps of pino-http
      user: UserDocument;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload { }
  }
}