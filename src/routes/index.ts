import award from './award';
import user from './user';

export = (app) => {
  app.use('/award', award);
  app.use('/user', user);
}