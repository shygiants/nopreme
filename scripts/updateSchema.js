#!/usr/bin/env babel-node

import fs from 'fs';
import path from 'path';
import {schema} from '../lib/data/schema';
import {printSchema} from 'graphql';

const schemaPath = path.resolve(__dirname, '../lib/data/schema.graphql');

fs.writeFileSync(schemaPath, printSchema(schema));

console.log('Wrote ' + schemaPath);
