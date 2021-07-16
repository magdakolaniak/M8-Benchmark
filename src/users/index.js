import express from 'express';

import UserModel from './schema.js';
import createError from 'http-errors';

import passport from 'passport';

import { JWTAuthMiddleware } from '../auth/middlewares.js';
import { checkHostRole } from '../auth/host.js';
import { refreshTokens, JWTAuthenticate } from '../auth/tools.js';

const usersRouter = express.Router();

usersRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(user);
      res.send({ accessToken, refreshToken });
    } else {
      next(createError(401));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);

    const { role, name, surname, email } = await newUser.save();

    res.status(201).send({ name, surname, role, email });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/refreshToken', async (req, res, next) => {
  try {
    if (!req.body.refreshToken)
      next(createError(400, 'Refresh Token not provided'));
    else {
      const { newAccessToken, newRefreshToken } = await refreshTokens(
        req.body.refreshToken
      );
      res.send({ newAccessToken, newRefreshToken });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { name, surname, email } = req.user;
    res.send({ name, surname, email });
  } catch (error) {
    next(error);
  }
});
usersRouter.get(
  '/me/accomodations',
  JWTAuthMiddleware,
  checkHostRole,
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id).populate(
        'accommodations'
      );
      res.send(user.accommodations);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete('/me', JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.status(200).send('Sucesfully deleted');
  } catch (error) {
    next(error);
  }
});
usersRouter.get('/', async (req, res, next) => {
  try {
    const list = await UserModel.find(
      {},
      { _id: 0, accommodations: 0, createdAt: 0, updatedAt: 0 }
    );
    if (list) {
      res.status(200).send(list);
    } else console.log(error);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
