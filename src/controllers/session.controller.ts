import { Request, Response } from 'express';
import {
  createSession,
  findSessions,
  updateSession,
} from '../services/session.service';
import { validatePassword } from '../services/user.service';
import { signJwt } from '../utils/jwt.utils';
import config from 'config';

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the user's password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }
  // create new session
  const session = await createSession(user._id, req.get('user-agent') || '');

  // create an access token

  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: config.get('accessTokenTtl') }, // 15 minutes,
  );

  // create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    'refreshTokenPrivateKey',
    { expiresIn: config.get('refreshTokenTtl') }, // 1y
  );

  // return access & refresh tokens
  res.cookie('accessToken', accessToken, {
    maxAge: 900000, // 15min
    httpOnly: true,
    domain: 'localhost', // @todo - set to your domain in prod
    path: '/',
    sameSite: 'strict',
    secure: false, //@todo - set true in prod
  });
  res.cookie('refreshToken', accessToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
    domain: 'localhost', // @todo - set to your domain in prod
    path: '/',
    sameSite: 'strict',
    secure: false, //@todo - set true in prod
  });

  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  console.log({ sessionId });

  await updateSession({ _id: sessionId }, { valid: false });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
