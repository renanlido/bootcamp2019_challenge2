import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import UnansweredsController from './app/controllers/UnansweredsController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.post('/students/:id/help_orders', HelpOrderController.store);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students/:index', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.get('/students/:id/help_orders', HelpOrderController.index);
routes.put('/students/help_orders/:id/answer', HelpOrderController.update);

routes.get('/students/help_orders/unanswereds', UnansweredsController.index);

export default routes;
