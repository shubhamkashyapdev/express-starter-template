import * as userService from '../services/user.service';
import * as sessionService from '../services/session.service';

import createServer from '../utils/server';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { createUserSessionHandler } from '../controllers/session.controller';
const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();
const userPayload = {
  _id: userId,
  email: 'jane@gmail.com',
  name: 'Jane Doe',
};
const userInput = {
  email: 'test@example.com',
  name: 'jane doe',
  password: 'password@123',
  confirmPassword: 'password@123',
};
const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: 'PostmanRuntime/7.29.0',
  createdAt: '2022-06-05T15:33:00.810+00:00',
  updatedAt: '  2022-06-05T15:33:00.810+00:00',
};

describe('user', () => {
  describe('user registration', () => {
    // username and password validated
    describe('given the username and password are valid', () => {
      it('should return the user payload and 200 status', async () => {
        const createUserServiceMock = jest
          .spyOn(userService, 'createUser')
          //@ts-ignore
          .mockReturnValueOnce(userPayload);
        const { statusCode, body } = await supertest(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(200);
        expect(body).toEqual(userPayload);
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    // vertify that the password must match
    describe('given the password do not match', () => {
      it('should return the 400 status', async () => {
        const createUserServiceMock = jest
          .spyOn(userService, 'createUser')
          //@ts-ignore
          .mockReturnValueOnce(userPayload);
        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send({ ...userInput, confirmPassword: 'doesnotmatch' });
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    // verify that the handler handles any errors
    describe('given the user service throws an error', () => {
      it('should return a 409 status', async () => {
        const createUserServiceMock = jest
          .spyOn(userService, 'createUser')
          //@ts-ignore
          .mockRejectedValue('oh no :(');
        const { statusCode } = await supertest(app)
          .post('/api/users')
          .send(userInput);
        expect(statusCode).toBe(409);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });
  // - creating a user session
  describe('create user session', () => {
    // a user can only login with a valid email & password
    describe('given the user login with a valid email & password', () => {
      it('should return a signed access token & refresh token', async () => {
        jest
          .spyOn(userService, 'validatePassword')
          // @ts-ignore
          .mockReturnValue(userPayload);
        jest
          .spyOn(sessionService, 'createSession')
          // @ts-ignore
          .mockReturnValue(sessionPayload);
        const req = {
          get: () => {
            return 'a user agent';
          },
          body: {
            email: 'test@example.com',
            password: 'password@123',
          },
        };
        const send = jest.fn();
        const res = {
          send,
        };
        // @ts-ignore
        await createUserSessionHandler(req, res);
        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
});
