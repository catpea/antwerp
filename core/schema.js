import Ajv from 'ajv';
import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import progress from '../util/progress.js';

import recordSchema from '../schema/record.js';

export default async function schema({db, configuration:{pp, dest, theme}, site}, options){
  log.info('Validating Record Schema')
  const bar = progress(`testing record schema`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
  const ajv = new Ajv({strictTuples:false}) // options can be passed, e.g. {allErrors: true}
  const validate = ajv.compile(recordSchema);
  for (const record of db){
    const valid = validate(record)
    if (!valid){
      console.dir(record, {depth: 10});
      console.log(validate.errors)
      throw new Error(`Record failed schema test: ${record.src}`)
    }
    bar.tick();
  }

}
