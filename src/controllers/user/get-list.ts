import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import { transformFilter } from '../../utils/transform-filter';
import redisClient from '../../config/redis';

const getListUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let allowedKeys = ['email'];
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

    const key = `users:${JSON.stringify(filters)}`;

    try {
      const cachedResult = await redisClient.get(key);

      if (!cachedResult) {
        const resultUsers = await User.find(filters);

        const value = JSON.stringify(resultUsers);

        try {
          await redisClient.set(key, value, { EX: 60, NX: true });
          logger.info(`Stored users in Redis with key ${key}`);
        } catch (error) {
          logger.error(`Error storing users in Redis: ${error}`);
        }

        logger.info('Get list User success', { params: req.params });
        return res.status(200).json(resultUsers);
      }

      logger.info(`Retrieved users from Redis with key ${key}`);
      const resultUsers = JSON.parse(cachedResult);
      return res.status(200).json(resultUsers);
    } catch (error) {
      logger.error(`Error getting users from Redis: ${error}`);
    }

    const resultUsers = await User.find(filters);

    const value = JSON.stringify(resultUsers);

    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored users in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing users in Redis: ${error}`);
    }

    logger.info('Get list User success', { params: req.params });
    return res.status(200).json(resultUsers);
  } catch (error) {
    const message = 'Error when get list User';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default getListUser;
