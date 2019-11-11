import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';

const routes = new Router();

routes.get('/students/:index/checkin', CheckinController.index);
routes.post('/students/:index/checkin', CheckinController.store);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:index', StudentController.update);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.delete('/plans/:index', PlanController.delete);
routes.put('/plans/:index', PlanController.update);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:index', RegistrationController.update);
routes.delete('/registrations/:index', RegistrationController.delete);

export default routes;
