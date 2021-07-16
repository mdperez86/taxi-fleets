import { HttpStatus, Logger } from '@nestjs/common';

import { BusinessException } from '../../exceptions/business.exception';
import { RideNotFoundException } from '../../exceptions/ride-not-found.exception';

import { ExceptionFilter } from './exception.filter';

describe('ExceptionFilter', () => {
  const filter = new ExceptionFilter();
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };
  const request = {
    url: 'https://www.mockurl.com',
  };
  const ctx = {
    getResponse: jest.fn(),
    getRequest: jest.fn(),
  };
  const host = {
    switchToHttp: jest.fn(),
  };
  let loggerStub: jest.SpyInstance;

  beforeEach(() => {
    host.switchToHttp.mockReturnValue(ctx);
    ctx.getResponse.mockReturnValue(response);
    ctx.getRequest.mockReturnValue(request);
    response.status.mockReturnValue(response);
    loggerStub = jest.spyOn(Logger, 'error');
  })

  afterEach(() => {
    host.switchToHttp.mockReset();
    ctx.getResponse.mockReset();
    ctx.getRequest.mockReset();
    response.status.mockReset();
    response.json.mockReset();
    loggerStub.mockReset();
  })

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle a UnknownException', () => {
    const exception = new Error('UnknownError');
    const loggerStub = jest.spyOn(Logger, 'error');

    filter.catch(exception, host as any);

    expect(host.switchToHttp).toHaveBeenCalledTimes(1);
    expect(ctx.getResponse).toHaveBeenCalledTimes(1);
    expect(ctx.getRequest).toHaveBeenCalledTimes(1);
    expect(loggerStub).toHaveBeenNthCalledWith(1, exception.message, expect.any(String), expect.any(String));
    expect(response.status).toHaveBeenNthCalledWith(1, HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenNthCalledWith(1, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: request.url,
    });
  });

  it('should handle a BusinessException', () => {
    const exception = new BusinessException(
      'BIZ_EXCEPTION',
      'Biz rule violation'
    );
    const loggerStub = jest.spyOn(Logger, 'error');

    filter.catch(exception, host as any);

    expect(host.switchToHttp).toHaveBeenCalledTimes(1);
    expect(ctx.getResponse).toHaveBeenCalledTimes(1);
    expect(ctx.getRequest).toHaveBeenCalledTimes(1);
    expect(loggerStub).toHaveBeenNthCalledWith(1, exception.message, expect.any(String), expect.any(String));
    expect(response.status).toHaveBeenNthCalledWith(1, HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenNthCalledWith(1, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: request.url,
    });
  });

  it('should handle a RideNotFoundException', () => {
    const exception = new RideNotFoundException(1);
    const loggerStub = jest.spyOn(Logger, 'error');

    filter.catch(exception, host as any);

    expect(host.switchToHttp).toHaveBeenCalledTimes(1);
    expect(ctx.getResponse).toHaveBeenCalledTimes(1);
    expect(ctx.getRequest).toHaveBeenCalledTimes(1);
    expect(loggerStub).toHaveBeenNthCalledWith(1, exception.message, expect.any(String), expect.any(String));
    expect(response.status).toHaveBeenNthCalledWith(1, HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenNthCalledWith(1, {
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: expect.any(String),
      path: request.url,
    });
  });
});
