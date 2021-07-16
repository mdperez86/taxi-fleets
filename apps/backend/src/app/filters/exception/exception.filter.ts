import { InternalServerErrorException } from '@nestjs/common';
import {
  ArgumentsHost,
  Logger,
  Catch,
  ExceptionFilter as BaseExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { BusinessException } from '../../exceptions/business.exception';
import { RideNotFoundException } from '../../exceptions/ride-not-found.exception';

@Catch()
export class ExceptionFilter implements BaseExceptionFilter<Error> {
  private handleBusinessException(exception: BusinessException) {
    if (exception instanceof RideNotFoundException) {
      return new NotFoundException(exception);
    }
    return new InternalServerErrorException(exception);
  }

  private handleUnknownException(exception: Error) {
    return new InternalServerErrorException(exception);
  }

  public catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BusinessException) {
      exception = this.handleBusinessException(exception);
    }

    if (!(exception instanceof HttpException)) {
      exception = this.handleUnknownException(exception);
    }

    const status = (exception as HttpException).getStatus();

    Logger.error(exception.message, exception.stack, ExceptionFilter.name);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
