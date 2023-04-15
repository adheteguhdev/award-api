import jwt from "jsonwebtoken";
import config from "../config";
import logger from "../utils/logger";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let message = 'Unauthorized';
  if (authHeader !== undefined) {
    const [type, token] = authHeader.split(' ');

    if (String(type).toLocaleLowerCase() == 'bearer') {
      try {
        const payload = jwt.verify(token, config.publicKey);
        req.auth = payload;
        logger.info('Authorized')
        return next();
      } catch (error) {
        logger.error('Forbidden', { params: error })
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else {
      message = `unsupported authorization method ${type}`
    }
  } else {
    message = `missing authorization headers`;
  }
  logger.error(message, { params: message })
  return res.status(401).json({ message: message });
};

export { authenticateToken }