import { Logger as TsLogger, ISettingsParam } from 'tslog';
import { v4 as uuid } from 'uuid';
import { isInAWSLambda, AWSLambdaEnvContext } from './lambda.utils';
import { Context } from 'aws-lambda';

export class TSLoggerService {
  private static _instance: TSLoggerService;
  private readonly _logger: TsLogger;
  private readonly processId: string;

  public constructor(loggerConfig?: ISettingsParam) {
    this.processId = uuid();
    this._logger = new TsLogger({
      type: isInAWSLambda() ? 'json' : 'pretty',
      ...loggerConfig,
      displayInstanceName: true,
      displayLoggerName: isInAWSLambda(),
      displayRequestId: true,
      displayTypes: true,
      name: isInAWSLambda()
        ? `${AWSLambdaEnvContext.functionName}-${AWSLambdaEnvContext.functionVersion}`
        : '',
      instanceName: this.processId,
    });
  }

  /**
   * Set AWS Request id to the logger
   * @TODO: insert another atts
   * @param context 
   */
  public setLambdaContext(context: Context): this {
      this._logger.setSettings({
          ...this._logger.settings,
          requestId: context.awsRequestId,
      })
      return this
  }

  public static getInstance(loggerConfig?: ISettingsParam): TSLoggerService {
    if (!this._instance) {
      this._instance = new TSLoggerService(loggerConfig);
    }
    return this._instance;
  }

  public get logger(): TsLogger {
    return this._logger;
  }
}
