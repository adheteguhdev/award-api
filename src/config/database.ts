import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';
import logger from '../utils/logger';

const connectDatabase = async () => {
  try {
    await mongoose.connect(`${config.database.url}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.database.name,
    } as ConnectOptions);
    logger.info('Database connected!');
  } catch (error) {
    logger.error('Database connection failed!', { error: `${error}` });
  }
};

const closeDatabase = async () => {
  try {
    await Promise.all([mongoose.connection.close()]);
    logger.info('Database closed');
  } catch (error) {
    logger.error('Close connection database failed!', { error: `${error}` });
  }
};

export { connectDatabase, closeDatabase };
