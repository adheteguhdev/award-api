import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const key = `user:${userId}`;

    try {
      const cachedResult = await redisClient.get(key);

      if (!cachedResult) {
        const resultUser = await User.findOne({ _id: userId, isDeleted: false });

        if (!resultUser) {
          const message = 'Data Not Found';
          logger.error(message, { params: req.params });
          return next(createError(404, message));
        }

        const value = JSON.stringify(resultUser);

        try {
          await redisClient.set(key, value, { EX: 60, NX: true });
          logger.info(`Stored user in Redis with key ${key}`);
        } catch (error) {
          logger.error(`Error storing user in Redis: ${error}`);
        }
        logger.info('Get user by Id success', { params: req.params });
        return res.status(200).json(resultUser);
      }

      logger.info(`Retrieved user from Redis with key ${key}`);
      const resultUser = JSON.parse(cachedResult);
      return res.status(200).json(resultUser);
    } catch (error) {
      logger.error(`Error getting user from Redis: ${error}`);
    }

    const resultUser = await User.findOne({ _id: userId, isDeleted: false });

    if (!resultUser) {
      const message = 'Data Not Found';
      logger.error(message, { params: req.params });
      return next(createError(404, message));
    }

    const value = JSON.stringify(resultUser);

    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored user in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing user in Redis: ${error}`);
    }
    logger.info('Get user by Id success', { params: req.params });
    return res.status(200).json(resultUser);
  } catch (error) {
    const message = 'Get user by id error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default getUserById;
