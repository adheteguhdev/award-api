import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const key = `user:${userId}`;

    let dataUser = {
      ...req.body,
      updatedAt: new Date()
    }

    const resultUser = await User.findOne({ _id: userId, isDeleted: false });
    if (!resultUser) {
      const message = 'Data Not Found';
      logger.error(message, { params: req.params });
      return next(createError(404, message));
    }

    if (resultUser.email !== dataUser.email) {
      const checkEmailExist = await User.findOne({ email: dataUser.email, isDeleted: false });
      if (checkEmailExist) {
        const message = 'Email Already Exist';
        logger.error(message, { params: checkEmailExist });
        return next(createError(400, message));
      }
    }

    let resultUpdateUser = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: dataUser },
      { new: true }
    );

    try {
      await redisClient.del(key);
      logger.info(`Deleted user from Redis cache with key ${key}`);
    } catch (error) {
      logger.error(`Error deleting user from Redis cache: ${error}`);
    }

    logger.info('Update User by Id success', { params: req.params });
    return res.status(200).json(resultUpdateUser);
  } catch (error) {
    const message = 'Update user by Id error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default updateUserById;
