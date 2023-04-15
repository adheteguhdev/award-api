import { NextFunction, Request, Response } from 'express';
import Award from '../../models/award';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const deleteAwardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const awardId = req.params.id;
    const key = `awards:${awardId}`;

    const resultAward = await Award.findOneAndUpdate({ _id: awardId, isDeleted: false }, {
      $set: {
        isDeleted : true,
        updatedAt : new Date()
      }
    });

    if (!resultAward) {
      const message = 'Data Not Found';
      logger.error(message, { params: req.params });
      return next(createError(404, message));
    }

    try {
      await redisClient.del(key);
      logger.info(`Deleted award from Redis cache with key ${key}`);
    } catch (error) {
      logger.error(`Error deleting award from Redis cache: ${error}`);
    }

    logger.info('Delete Award success', { params: req.params });
    return res.status(204).json();
  } catch (error) {
    const message = 'Delete award error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default deleteAwardById;
