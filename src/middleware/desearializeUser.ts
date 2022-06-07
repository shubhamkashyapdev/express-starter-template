import { Request, Response, NextFunction } from 'express';
import get from 'lodash/get';
import { reissueAccessToken } from '../services/session.service';
import { verfiyJwt } from '../utils/jwt.utils';

export default async function desearializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    '',
  ); // remove the bearer word from token

  const refreshToken = get(req, 'headers.x-refresh-token', '').replace(
    /^Bearer\s/,
    '',
  ); // remove the bearer word from token

  if (!accessToken) {
    return next();
  }
  // verify access token
  const { decoded, expired } = verfiyJwt(accessToken);

  if (decoded) {
    const locals: any = {};
    locals.user = decoded;
    res.locals = { ...res?.locals, ...locals };
    return next();
  }

  if (expired && refreshToken) {
    // reissue the token
    const newAccessToken = await reissueAccessToken(refreshToken);
    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      const result = verfiyJwt(newAccessToken);
      const locals: any = {};
      locals.user = decoded;
      res.locals = { ...res?.locals, ...locals };

      return next();
    }
  }

  return next();
}
