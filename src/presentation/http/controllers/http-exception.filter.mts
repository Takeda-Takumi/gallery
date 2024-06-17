import { BadRequestException, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../domain/shared/domain-exception..mjs';

@Catch(DomainException)
export class DomainExceptionFilter {
  catch(exception: DomainException, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = HttpStatus.BAD_REQUEST

    response
      .status(status)
      .json({
        statusCode: status,
        error: exception.message,
        path: request.url,
      });
  }
}
