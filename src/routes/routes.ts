import { Application, Request, Response } from 'express';
// Middlewares
import validateResource from '../middleware/validateResource';

// Controllers
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from '../controllers/session.controller';
import {
  createUserHandler,
  currentUserHandler,
} from '../controllers/user.controller';
// Schemas
import { createSessionSchema } from '../schema/session.shema';
import { createUserSchema } from '../schema/user.schema';
import requireUser from '../middleware/requireUser';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from '../controllers/product.controller';
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from '../schema/product.schema';

function routes(app: Application) {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: `Api is running...`,
    });
  });

  app.post('/api/users', validateResource(createUserSchema), createUserHandler);

  app.get('/api/me', requireUser, currentUserHandler);

  app.post(
    '/api/sessions',
    validateResource(createSessionSchema),
    createUserSessionHandler,
  );

  app.get('/api/sessions', requireUser, getUserSessionsHandler);

  app.delete('/api/sessions', requireUser, deleteSessionHandler);

  /**
   * Product Routes
   */

  app.post(
    '/api/products',
    [requireUser, validateResource(createProductSchema)],
    createProductHandler,
  );

  app.put(
    '/api/products/:productId',
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler,
  );

  app.get(
    '/api/products/:productId',
    validateResource(getProductSchema),
    getProductHandler,
  );

  app.delete(
    '/api/products/:productId',
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler,
  );
}

export default routes;
