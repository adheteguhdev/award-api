import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import redisClient from '../../config/redis';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataUser = req.body;

    if (dataUser.email) {
      let checkEmailExist = await User.findOne({ email: dataUser.email, isDeleted: false });
      if (checkEmailExist) {
        const message = 'Email already exist';
        logger.error(message, { params: checkEmailExist });
        return next(createError(400, message));
      }
    }
    const newUser = new User(dataUser);

    const resultUser = await newUser.save();

    const key = `user:${resultUser.id}`;
    const value = JSON.stringify(resultUser);

    try {
      await redisClient.set(key, value, { EX: 60, NX: true });
      logger.info(`Stored user in Redis with key ${key}`);
    } catch (error) {
      logger.error(`Error storing user in Redis: ${error}`);
    }

    logger.info('Create User success', { params: newUser });
    return res.status(201).json(resultUser);
  } catch (error) {
    const message = 'Create user error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default createUser;
