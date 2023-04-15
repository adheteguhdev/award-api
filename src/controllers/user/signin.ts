import { NextFunction, Request, Response } from 'express';
import User from '../../models/user';
import createError from 'http-errors';
import logger from '../../utils/logger';
import jwt from "jsonwebtoken";
import config from '../../config';

const signin = async (req: Request, res: Response, next: NextFunction) => {
  const cert = config.privateKey;

  try {
    const { email } = req.body;

    const resultUser = await User.findOne({ email: email, isDeleted: false });

    if (!resultUser) {
      const message = 'Email Address is not exists';
      logger.error(message, { params: req.params });
      return next(createError(400, message));
    }

    const token = jwt.sign({email}, cert, { algorithm: "RS256" });

    logger.info('Signin success', { params: req.params });
    return res.status(200).json({token});
  } catch (error) {
    const message = 'Sign in error';
    logger.error(message, { params: req.params, error: `${error}` });
    return next(createError(500, message + `${error}`));
  }
};

export default signin;
