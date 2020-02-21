import dotenv from 'dotenv';
const result = dotenv.config({ path: path.join(__dirname, '..', `.env.${process.env.NODE_ENV}`) });

if (result.error) 
  throw result.error

import path from 'path';

import express from 'express';
import graphqlHTTP from 'express-graphql';
import mongoose from 'mongoose';
import jwt from 'express-jwt';
import jwtSign from 'jsonwebtoken';
import Multer from 'multer';
import {Storage} from '@google-cloud/storage';
import bodyParser from 'body-parser';
import uuidv4 from 'uuid/v4';
import { graphqlBatchHTTPWrapper } from 'react-relay-network-modern';

import {schema} from './data/schema';
import {addUser, getUserByKakaoId, isAdmin} from './data/database';
import {getKakaoUserInfo, generateNewNickname} from './utils';

const jwtSecret = process.env.JWT_SECRET;


/////////////
// MONGODB //
/////////////
let uri;
uri = `mongodb+srv://${process.env.DB_HOST}/nopreme?retryWrites=true&w=majority`;
const starbucks = true;
if (starbucks) {
  const replica = [
    'nopreme-shard-00-00-hezsg.gcp.mongodb.net:27017',
    'nopreme-shard-00-01-hezsg.gcp.mongodb.net:27017',
    'nopreme-shard-00-02-hezsg.gcp.mongodb.net:27017'
  ];
  uri = `mongodb://${replica.join(',')}/nopreme?ssl=true&replicaSet=nopreme-shard-0&authSource=admin&retryWrites=true&w=majority`;
}

mongoose.connect(uri, {
    useNewUrlParser: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('DB Connected!'));

/////////////
// EXPRESS //
/////////////
const app = express();
app.use(bodyParser.json());

/////////////
// WEB APP //
/////////////
app.use('/', express.static(path.resolve(__dirname, '..', 'docs')));

/////////////
// GRAPHQL //
/////////////
const graphqlServer = graphqlHTTP({
  schema: schema,
  graphiql: process.env.NODE_ENV === 'development',
});
app.use('/graphql', jwt({secret: jwtSecret}), graphqlServer);


////////////////
// MIDDLEWARE //
////////////////
function kakaoAccessToken(req, res, next) {
  const {accessToken} = req.body;
  getKakaoUserInfo(accessToken).then(resp => {
    req.kakaoUser = resp;
    next();
  }).catch(err => {
    console.error(err);
    res.status(401).end();
  });
}

function onlyAdmin(req, res, next) {
  const {user: {id}} = req;

  isAdmin(id).then(admin => {
    if (admin)
      return next();

    res.status(401).end();
  }).catch(err => {
    console.error(err);
    res.status(401).end();
  });
}

//////////
// AUTH //
//////////

app.post('/auth/signin', kakaoAccessToken, (req, res) => {
  getUserByKakaoId(req.kakaoUser.id).then(user => {
    if (user !== null) {
      // SIGN IN
      res.json({
        token: jwtSign.sign({ 
          id: user._id,
        }, jwtSecret, {expiresIn: '7d'})});
    } else {
      // SIGN UP
      // TODO: random
      generateNewNickname().then(nickname => {
        addUser(nickname, req.body.accessToken).then(_id => {
          res.json({
            token: jwtSign.sign({ 
              id: _id,
            }, jwtSecret)}, );
        });
      });
    }
  });
});

/////////////
// STORAGE //
/////////////

// Instantiate a storage client
const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', jwt({secret: jwtSecret}), onlyAdmin, multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const filename = uuidv4() + path.extname(req.file.originalname);
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', err => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.json({publicUrl});
  });

  blobStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
console.log('Running a GraphQL API server at /graphql');