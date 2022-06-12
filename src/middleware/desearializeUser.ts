import { Request, Response, NextFunction } from 'express';
import get from 'lodash/get';
import { reissueAccessToken } from '../services/session.service';
import { verfiyJwt } from '../utils/jwt.utils';

export default async function desearializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, ''); // remove the bearer word from token

  const refreshToken =
    get(req, 'cookies.refreshToken') ||
    get(req, 'headers.x-refresh-token', '').replace(/^Bearer\s/, ''); // remove the bearer word from token
  if (!accessToken && !refreshToken) {
    return next();
  }

  // verify access token
  const { decoded, expired } = verfiyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired || refreshToken) {
    // reissue the token
    const newAccessToken = await reissueAccessToken(refreshToken);

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
      const { decoded } = await verfiyJwt(newAccessToken);
      console.log({ decoded });
      res.locals.user = decoded;
      res.cookie('accessToken', newAccessToken, {
        maxAge: 900000, // 15min
        httpOnly: true,
        domain: 'localhost', // @todo - set to your domain in prod
        path: '/',
        sameSite: 'strict',
        secure: false, //@todo - set true in prod
      });
      return next();
    }
  }

  return next();
}
