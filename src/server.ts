import createApp from './app';
import logger from './utils/logger';
import initData from './utils/init-data';
import config from './config';
(async () => {
  const app = await createApp();

  app.listen(config.port, async () => {
    await initData();
    logger.info(`Server running on port ${config.port}`);
  });
})();
