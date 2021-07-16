import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import usersRouter from './users/index.js';
import cookieParser from 'cookie-parser';

import accommodationsRouter from './accomodations/index.js';

const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cookieParser());

server.use(cors());

server.use('/users', usersRouter);
server.use('/accomodations', accommodationsRouter);
console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(
    server.listen(port, () => {
      console.log('Running on port', port);
    })
  )
  .catch((err) => console.log(err));
