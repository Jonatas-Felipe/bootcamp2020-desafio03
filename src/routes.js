import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import SignatureController from './app/controllers/SignatureController';
import DeliverymanController from './app/controllers/DeliverymanController';
import EntregaController from './app/controllers/EntregaController';
import RetiradaController from './app/controllers/RetiradaController';
import FinalizarController from './app/controllers/FinalizarController';
import DeliverymanEntregaController from './app/controllers/DeliverymanEntregaController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemsController';
import NotificationController from './app/controllers/NotificationController';

import authMiddlewares from './app/middleware/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.get(
  '/deliveryman/:id_delivery/deliveries',
  DeliverymanEntregaController.index
);

routes.get(
  '/deliveryman/:id_delivery/delivered',
  DeliverymanEntregaController.index
);

routes.get('/deliveryman/:id', DeliverymanController.show);
routes.post('/retirada/:id_entrega', RetiradaController.store);
routes.post('/finalizar/:id_entrega', FinalizarController.store);

routes.post('/delivery/:id_entrega/problems', DeliveryProblemsController.store);
routes.get('/delivery/:id_entrega/problems', DeliveryProblemsController.show);

routes.get('/notifications/:user_id', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.get('/entregas/:deliveryman_id', DeliverymanEntregaController.show);
routes.get('/entrega/:id', EntregaController.show);

routes.post('/signature', SignatureController.store);

routes.use(authMiddlewares);

routes.get('/recipients', RecipientController.index);
routes.post('/recipient', RecipientController.store);
routes.get('/recipient/:id', RecipientController.show);
routes.put('/recipient/:id', RecipientController.update);
routes.delete('/recipient/:id', RecipientController.delete);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/entregas', EntregaController.index);
routes.post('/entrega', EntregaController.store);
routes.put('/entrega/:id', EntregaController.update);
routes.delete('/entrega/:id', EntregaController.delete);

routes.get('/problems', DeliveryProblemsController.index);
routes.delete(
  '/problem/:id_problem/cancel-delivery',
  DeliveryProblemsController.delete
);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
