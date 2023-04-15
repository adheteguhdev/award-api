import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const key = `user:${userId}`;

    const resultUser = await User.findOneAndUpdate({ _id: userId, isDeleted: false }, {
      $set: {
        isDeleted : true,
        updatedAt : new Date()
      }
    });

    if (!resultUser) {
      const message = 'Data Not Found';
      logger.error(message, { params: req.params });
      return next(createError(404, message));
    }

    try {
      await redisClient.del(key);
      logger.info(`Deleted user from Redis cache with key ${key}`);
    } catch (error) {
      logger.error(`Error deleting user from Redis cache: ${error}`);
    }

    logger.info('Delete user success', { params: req.params });
    return res.status(204).json();
  } catch (error) {
    const message = 'Delete user error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default deleteUserById;
