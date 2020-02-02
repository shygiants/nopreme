import dotenv from 'dotenv';
const result = dotenv.config();

if (result.error) 
  throw result.error

import path from 'path';

import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import jwtSign from 'jsonwebtoken';

import {schema} from './data/schema';

const jwtSecret = process.env.JWT_SECRET;

mongoose.connect(`mongodb://${process.env.DB_HOST}/nopreme?authSource=admin`, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('DB Connected!'));

const app = express();
app.use('/', express.static(path.resolve(__dirname, 'docs')));
app.use('/graphql', jwt({secret: jwtSecret}), graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.get('/jwt/refresh', (req, res) => res.json({token: jwtSign.sign({ id: process.env.DEFAULT_USER_ID }, jwtSecret)}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');