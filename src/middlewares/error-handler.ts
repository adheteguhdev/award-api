import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import config from '../config';

const errorHandler = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (config.appEnv === 'production') delete err.stack;

    if (res.headersSent) {
      return next(err);
    }

    if (err.status) {
      return res.status(err.status || 500).json({
        code: err.code
          ? err.code
          : err.status == 500
          ? 'INTERNAL_SERVER_ERROR'
          : undefined,
        message: err.message,
        stack: err.stack,
      });
    } else {
      if (err.code && err.code === 'SCHEMA_VALIDATION_FAILED') {
        logger.error('Error schema validation', {
          error: `${JSON.stringify(err.results.errors)}`,
        });
        return res.status(400).json({
          code: 'SCHEMA_VALIDATION_FAILED',
          message: `Validation error ${JSON.stringify(err.results.errors)}`,
        });
      } else if (err.code && err.code === 'REQUIRED') {
        logger.error('Error required', { error: `${err.toString()}` });
        return res.status(400).json({
          code: 'REQUIRED',
          message: err.toString(),
        });
      } else if (err.code && err.code === 'INVALID_TYPE') {
        logger.error('Error invalid type', { error: `${err.toString()}` });
        return res.status(400).json({
          code: 'INVALID_TYPE',
          message: err.toString(),
        });
      }
    }

    logger.error('Unexpected error', { error: err.stack });
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'Sorry, an unexpected error has occurred.',
      stack: err.stack,
    });
  };
};

const error404 = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.error('Resource Not found', { params: req.originalUrl });
    const err: any = new Error('Resource Not Found');
    err.status = 404;
    next(err);
  };
};

export { errorHandler, error404 };
