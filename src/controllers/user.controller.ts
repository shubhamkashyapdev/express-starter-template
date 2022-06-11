import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../services/user.service';
import logger from '../utils/logger';
import omit from 'lodash/omit';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response,
) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user, 'password'));
  } catch (err: any) {
    logger.error(err);
    res.status(409).send(err.message);
  }
}
