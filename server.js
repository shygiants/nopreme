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
import {addUser, getUserByKakaoId} from './data/database';
import {getKakaoUserInfo} from './src/utils';

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

app.use('/signin', express.static(path.resolve(__dirname, 'docs', 'signin')));

function kakaoAccessToken(req, res, next) {
  getKakaoUserInfo(req.body.accessToken).then(resp => {
    req.kakaoUser = resp;
    next();
  }).catch(err => {
    console.error(err);
    res.status(401).end();
  });
}

app.post('/auth/signin', express.json(), kakaoAccessToken, (req, res) => {
  getUserByKakaoId(req.kakaoUser.id).then(user => {
    if (user !== null) {
      res.json({
        token: jwtSign.sign({ 
          id: user._id,
        }, jwtSecret)})
      return
    } 

    res.json({exists: false});
  });
});

app.post('/auth/signup', express.json(), (req, res) => {
  const {nickname, openChatLink, accessToken} = req.body;

  addUser(nickname, openChatLink, accessToken).then(_id => {
    res.json({
      token: jwtSign.sign({ 
        id: _id,
      }, jwtSecret)})
  });
});

// TODO: CORS
app.post('/kakao/nickname', express.json(), kakaoAccessToken, (req, res) => {
  res.json({nickname: req.kakaoUser.kakao_account.profile.nickname});
});

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');