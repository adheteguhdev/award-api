import { NextFunction, Request, Response } from 'express';
import Award from '../../models/award';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const getAwardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const awardId = req.params.id;
    const key = `awards:${awardId}`;

    try {
      const cachedResult = await redisClient.get(key);

      if (!cachedResult) {
        const resultAward = await Award.findOne({ _id: awardId, isDeleted: false });

        if (!resultAward) {
          const message = 'Data Not Found';
          logger.error(message, { params: req.params });
          return next(createError(404, message));
        }

        const value = JSON.stringify(resultAward);

        try {
          await redisClient.set(key, value, { EX: 60, NX: true });
          logger.info(`Stored award in Redis with key ${key}`);
        } catch (error) {
          logger.error(`Error storing award in Redis: ${error}`);
        }
        logger.info('Get Award by Id success', { params: req.params });
        return res.status(200).json(resultAward);
      }

      logger.info(`Retrieved award from Redis with key ${key}`);
      const resultAward = JSON.parse(cachedResult);
      return res.status(200).json(resultAward);
    } catch (error) {
      logger.error(`Error getting award from Redis: ${error}`);
    }

    const resultAward = await Award.findOne({ _id: awardId, isDeleted: false });

    if (!resultAward) {
      const message = 'Data Not Found';
      logger.error(message, { params: req.params });
      return next(createError(404, message));
    }

    const value = JSON.stringify(resultAward);

    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored award in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing award in Redis: ${error}`);
    }
    logger.info('Get Award by Id success', { params: req.params });
    return res.status(200).json(resultAward);
  } catch (error) {
    const message = 'Get award by id error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default getAwardById;
