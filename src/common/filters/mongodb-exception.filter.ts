import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
interface ErrorDetails {
  [key: string]: any;
}
@Catch(mongoose.mongo.MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    switch (exception.code) {
      case 11000:
        return response.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          errorMessage: this.createMessage(exception.keyValue),
        });

      default:
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: 'Sorry something went wrong!',
        });
    }
  }

  createMessage(obj: ErrorDetails): string {
  let message = "User Details:\n ";
  const duplicateValues: { [key: string]: string[] } = {};

  // Iterate over the object properties
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check for duplicate values
      if (duplicateValues[value]) {
        duplicateValues[value].push(key);
      } else {
        duplicateValues[value] = [key];
      }

      message += `${key}: ${value}\n`;
    }
  }
  // Check for duplicate values and update the message
  for (const value in duplicateValues) {
    if (Object.hasOwnProperty.call(duplicateValues, value)) {
      const keys = duplicateValues[value];
      if (keys.length > 0) {
        message += `Warning: Duplicate value '${value}' found for fields: ${keys.join(", ")}\n`;
      }
    }
  }

  return message;
}
}
