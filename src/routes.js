import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import UnansweredHelpOrderController from './app/controllers/UnansweredHelpOrderController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.get('/students/:index/help_orders', HelpOrderController.index);
routes.post('/students/:index/help_orders', HelpOrderController.store);

routes.post('/students/:index/checkins', CheckinController.store);
routes.get('/students/:index/checkins', CheckinController.index);

routes.use(authMiddleware);

routes.put('/students/help_orders/:index/answer', HelpOrderController.update);
routes.get(
  '/students/help_orders/unanswereds',
  UnansweredHelpOrderController.index
);

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
