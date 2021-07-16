import express from 'express';
import AccomodationsModel from '../accomodations/schema.js';
import UserModel from '../users/schema.js';

import { JWTAuthMiddleware } from '../auth/middlewares.js';
import { checkHostRole } from '../auth/host.js';

const accommodationsRouter = express.Router();

accommodationsRouter.post(
  '/',
  JWTAuthMiddleware,
  checkHostRole,
  async (req, res, next) => {
    try {
      const newOne = new AccomodationsModel(req.body);
      await newOne.save();
      if (newOne) {
        let updateUser = await UserModel.findByIdAndUpdate(
          newOne.host,
          { $push: { accommodations: newOne._id } },
          { runValidators: true, new: true }
        );
        if (updateUser) {
          console.log(updateUser);
        }
        res.status(201).send('Sucessfully added!');
      } else res.send(error.message);
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.get('/', JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find();
    if (accomodations) {
      res.status(200).send(accomodations);
    } else {
      console.log(error);
    }
  } catch (error) {
    next(error);
  }
});

accommodationsRouter.get(
  '/:id',
  JWTAuthMiddleware,
  async (req, res, next) => {}
);

accommodationsRouter.delete(
  '/:id',
  JWTAuthMiddleware,
  async (req, res, next) => {}
);

accommodationsRouter.put(
  '/:id',
  JWTAuthMiddleware,
  async (req, res, next) => {}
);

export default accommodationsRouter;
