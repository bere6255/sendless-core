import * as dotenv from "dotenv";
dotenv.config()

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import routes from './routes/';
import cors from "cors";
import Knex from 'knex';
import path from "path";
import { Model } from 'objection';
import environments from './knexfile';
import errorHandler from './middleware/errorHandler';
// import rateLimit from "./middleware/rateLimit";

const app: Express = express();

// Initialize knex
const knex = Knex(environments[process.env.NODE_ENV]);
Model.knex(knex);

// Middleware
app.use(cors({ origin: '*' }));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' })); // <<== Correctly use express.json

// app.use(rateLimit);

// Serve uploaded images statically (MOUNT before routes)
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// API routes
app.use(routes);
app.use(errorHandler); // must come after all routes
export default app;
