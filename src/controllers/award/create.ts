import { NextFunction, Request, Response } from 'express';
import Award from '../../models/award';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const createAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataAward = req.body;

    const newAward = new Award(dataAward);

    const resultAward = await newAward.save();
    const key = `awards:${resultAward.id}`;
    const value = JSON.stringify(resultAward);
    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored award in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing award in Redis: ${error}`);
    }
    logger.info('Create Award success', { params: req.params });
    return res.status(201).json(resultAward);
  } catch (error) {
    const message = 'Create award error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default createAward;
