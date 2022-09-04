import { Router } from 'express';
import auth from './routes/auth.js';
import users from './routes/users.js';

export default () => {
  const app = Router();
  auth(app);
  users(app);

  return app;
}
