import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students/:index', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.delete('/plans/:id', PlanController.delete);
routes.put('/plans/:id', PlanController.update);

export default routes;
