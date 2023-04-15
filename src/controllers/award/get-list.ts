import { NextFunction, Request, Response } from 'express';
import Award from '../../models/award';
import createError from 'http-errors';
import logger from '../../utils/logger';
import { transformFilter } from '../../utils/transform-filter';
import redisClient from '../../config/redis';

const getListAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let allowedKeys = ['type', 'point'];
    let filters = {};

    if (req.query) {
      try {
        filters = transformFilter(req.query, allowedKeys);
      } catch (error) {
        const message = 'Invalid Query Parameters';
        logger.error(message, { params: req.params, error: `${error}` });
        return next(createError(400, message));
      }
    }

    filters = {
      ...filters,
      isDeleted: false,
    }

    const key = `awards:${JSON.stringify(filters)}`;

    try {
      const cachedResult = await redisClient.get(key);

      if (!cachedResult) {
        const resultAwards = await Award.find(filters);

        const value = JSON.stringify(resultAwards);

        try {
          await redisClient.set(key, value, { EX: 60, NX: true });
          logger.info(`Stored awards in Redis with key ${key}`);
        } catch (error) {
          logger.error(`Error storing awards in Redis: ${error}`);
        }

        logger.info('Get list Award success', { params: req.params });
        return res.status(200).json(resultAwards);
      }

      logger.info(`Retrieved awards from Redis with key ${key}`);
      const resultAwards = JSON.parse(cachedResult);
      return res.status(200).json(resultAwards);
    } catch (error) {
      logger.error(`Error getting awards from Redis: ${error}`);
    }

    const resultAwards = await Award.find(filters);

    const value = JSON.stringify(resultAwards);

    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored awards in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing awards in Redis: ${error}`);
    }

    logger.info('Get list Award success', { params: req.params });
    return res.status(200).json(resultAwards);
  } catch (error) {
    const message = 'Error when get list Award';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default getListAward;
