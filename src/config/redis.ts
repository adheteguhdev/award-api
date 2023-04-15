import * as redis from 'redis';
import config from '.';
import logger from '../utils/logger';

const redisClient = redis.createClient({
  url: config.redisUrl,
});

redisClient.connect();

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
  redisClient.quit(); // disconnect the Redis client
});
redisClient.on("connect", () => { logger.info("Redis connected!") });


export default redisClient

