import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    this.logger.error({
      message: exception.message,
      trace: exception.stack,
      context: JSON.stringify({
        service: HttpExceptionFilter.name,
        additionalInfo: {
          status,
          method: request.method,
          url: request.url,
          body: request.body,
        },
      }),
    });

    const internalServiceError = {
      error: 'internal server error',
      message: 'Server issue',
      statusCode: 500,
    };

    const error = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { message: exceptionResponse }),
    };

    response
      .status(status || internalServiceError.statusCode)
      .json(error || internalServiceError);
  }
}
