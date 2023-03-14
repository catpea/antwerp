import fs from 'fs-extra';
import path from 'path';
import schema from '../schema/conf.js';

import Ajv from 'ajv';

export default async function main(location, options){
  const config = await (await import( path.resolve(location) )).default()
  Object.assign(config.configuration, options)
  const ajv = new Ajv({strictTuples:false}) // options can be passed, e.g. {allErrors: true}
  const validate = ajv.compile(schema)
  const valid = validate(config)
  if (!valid){
    console.log(validate.errors)
    throw new Error('Configuration file failed schema test.')
  }
  return config;
}
