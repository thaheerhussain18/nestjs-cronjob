import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logMessage(message: string, context?: string) {
    this.log(message, context);
  }

  errorMessage(message: string, trace?: string, context?: string) {
    this.error(message, trace, context);
  }

  warnMessage(message: string, context?: string) {
    this.warn(message, context);
  }

  debugMessage(message: string, context?: string) {
    this.debug(message, context);
  }

  verboseMessage(message: string, context?: string) {
    this.verbose(message, context);
  }
}
