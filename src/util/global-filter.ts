import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.message;

    response.status(status).json({
      message: message,
      statusCode: status,
    });
  }
}


