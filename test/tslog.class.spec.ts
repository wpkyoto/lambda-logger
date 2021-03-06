import { Logger as TsLogger, ISettingsParam } from 'tslog';
import { TSLoggerService } from '../src/tslog.class';
import { Context } from 'aws-lambda';

const getLogger = (conf?: ISettingsParam) => {
  const stdOut: string[] = [];
  const stdErr: string[] = [];
  const { logger } = new TSLoggerService({
    type: 'json',
    exposeStack: true,
    stdErr: {
      write: (print: string) => {
        stdErr.push(print);
      },
    },
    stdOut: {
      write: (print: string) => {
        stdOut.push(print);
      },
    },
    ...conf,
  });
  return {
    stdOut,
    stdErr,
    logger,
  };
};

describe('TsLogger', () => {
  describe('method test', () => {
    let stdOut: string[] = [];
    let stdErr: string[] = [];
    let logger: TsLogger;
    beforeEach(() => {
      const helper = getLogger();
      logger = helper.logger;
      stdErr = helper.stdErr;
      stdOut = helper.stdOut;
    });
    it.each(['silly', 'info', 'debug', 'trace'])(
      '[General] Should record item as a %p level',
      type => {
        (logger as any)[type]('test');
        const logData = JSON.parse(stdOut[0]);
        expect(logData.argumentsArray).toEqual(['test']);
        expect(logData.logLevel).toEqual(type);
        expect(logData.stack.length).not.toEqual(0);
      }
    );
    it.each(['error', 'fatal'])(
      '[Error] Should record item as a %p level',
      type => {
        (logger as any)[type]('test');
        const logData = JSON.parse(stdErr[0]);
        expect(logData.argumentsArray).toEqual(['test']);
        expect(logData.logLevel).toEqual(type);
        expect(logData.stack.length).not.toEqual(0);
      }
    );
    describe('setLambdaContext', () => {
      it('[StdOut] should no value by default', () => {
        logger.info('test');
        const logData = JSON.parse(stdOut[0]);
        expect(logData.requestId).toEqual(undefined);
      });
      it('[StdOut] should set requestId', () => {
        const context = {
          awsRequestId: 'aws.request.id',
        } as Context;
        const stdOut: string[] = [];
        const { logger } = new TSLoggerService({
          type: 'json',
          exposeStack: true,
          stdOut: {
            write: (print: string) => {
              stdOut.push(print);
            },
          },
        }).setLambdaContext(context);
        logger.info('test');
        const logData = JSON.parse(stdOut[0]);
        expect(logData.requestId).toEqual('aws.request.id');
      });
      it('[StdErr] should no value by default', () => {
        logger.error('test');
        const logData = JSON.parse(stdErr[0]);
        expect(logData.requestId).toEqual(undefined);
      });
      it('[StdErr] should set requestId', () => {
        const context = {
          awsRequestId: 'aws.request.id',
        } as Context;
        const stdErr: string[] = [];
        const { logger } = new TSLoggerService({
          type: 'json',
          exposeStack: true,
          stdErr: {
            write: (print: string) => {
              stdErr.push(print);
            },
          },
        }).setLambdaContext(context);
        logger.error('test');
        const logData = JSON.parse(stdErr[0]);
        expect(logData.requestId).toEqual('aws.request.id');
      });
    });
  });
  describe('e2e test', () => {
    let stdOut: string[] = [];
    let stdErr: string[] = [];
    const logger = TSLoggerService.getInstance({
      type: 'json',
      stdErr: {
        write: (print: string) => {
          stdErr.push(print);
        },
      },
      stdOut: {
        write: (print: string) => {
          stdOut.push(print);
        },
      },
    }).logger;
    beforeEach(() => {
      stdOut = [];
      stdErr = [];
    });
    it.each(['silly', 'info', 'debug', 'trace'])(
      '[General] Should record item as a %p level',
      type => {
        (logger as any)[type]('test');
        const logData = JSON.parse(stdOut[0]);
        expect(logData.argumentsArray).toEqual(['test']);
        expect(logData.logLevel).toEqual(type);
        if (type !== 'trace') {
          expect(logData.stack).toEqual(undefined);
        } else {
          expect(logData.stack.length).not.toEqual(0);
        }
      }
    );
    it.each(['error', 'fatal'])(
      '[Error] Should record item as a %p level',
      type => {
        (logger as any)[type]('test');
        const logData = JSON.parse(stdErr[0]);
        expect(logData.argumentsArray).toEqual(['test']);
        expect(logData.logLevel).toEqual(type);
        expect(logData.stack).toEqual(undefined);
      }
    );
  });
});
