import { Controller, Get, Post, Body } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private readonly logger: LoggerService) {}

  @Get('test')
  testAllLevels() {
    let a:number[] = [];
    for (let i = 0; i < 100; i++) {
      a.push(i);
    }
    this.logger.logMessage('This is a LOG message', 'LoggerController'+a.join(','));
    this.logger.errorMessage('This is an ERROR message', undefined, 'LoggerController');
    this.logger.warnMessage('This is a WARN message', 'LoggerController');
    this.logger.debugMessage('This is a DEBUG message', 'LoggerController');
    this.logger.verboseMessage('This is a VERBOSE message', 'LoggerController');
    console.log('Logger test completed.');
    return {
      success: true,
      message: 'All log levels tested. Check console output.',
      levels: ['log', 'error', 'warn', 'debug', 'verbose'],
    };
  }

  @Post('custom')
  customLog(@Body() body: { level: string; message: string; context?: string }) {
    const { level, message, context } = body;
    const ctx = context || 'LoggerController';

    switch (level) {
      case 'log':
        this.logger.logMessage(message, ctx);
        break;
      case 'error':
        this.logger.errorMessage(message, undefined, ctx);
        break;
      case 'warn':
        this.logger.warnMessage(message, ctx);
        break;
      case 'debug':
        this.logger.debugMessage(message, ctx);
        break;
      case 'verbose':
        this.logger.verboseMessage(message, ctx);
        break;
      default:
        this.logger.logMessage(message, ctx);
    }

    return {
      success: true,
      logged: { level, message, context: ctx },
    };
  }
}
