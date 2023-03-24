import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
export default async function cache({db, configuration}){
    log.info('Updating Database Cache')
  await fs.writeJson(path.join(configuration.cache, 'db.json'), db);
}
