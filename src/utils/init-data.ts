import User from '../models/user';
import Award from '../models/award';
import logger from './logger';
import { initUserData } from '../test/data/user';
import { initAwardData } from '../test/data/award';

const initData = async () => {
  const totalAward = await Award.countDocuments();
  const totalUser = await User.countDocuments();

  if (totalAward === 0 || totalUser === 0) {
    try {
      logger.info('Initializing data...');
      await User.create(initUserData);
      await Award.create(initAwardData);
      logger.info('Data initialization complete');
    } catch (error) {
      logger.error('Error when initialize data', { error: `${error}` });
    }
  }
};

export default initData;
