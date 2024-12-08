import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
export default async function cache({db, configuration}){
  log.info('Updating Database Cache')
  await fs.writeJson(path.join(configuration.cache, 'db.json'), db, {spaces: 2});
  await fs.writeJson(path.join(configuration.cache, 'db.meta.json'), JSON.parse(JSON.stringify(db)).map(r=>Object.assign(r,{html:null, md:null, text:null}) ), {spaces: 2});

  // await fs.writeJson(path.join(configuration.cache, 'db.32.json'), db.slice(0,32), {spaces: 2});
  // await fs.writeJson(path.join(configuration.cache, 'db.128.json'), db.slice(0,128), {spaces: 2});
  // await fs.writeJson(path.join(configuration.cache, 'db.meta.512.json'), JSON.parse(JSON.stringify(db.slice(0,500))).map(r=>Object.assign(r,{html:null, md:null, text:null}) ), {spaces: 2});

  await fs.writeJson(path.join(configuration.cache, 'db.md.32.json'), JSON.parse(JSON.stringify(db.slice(0,32))).map(r=>Object.assign(r,{html:null, text:null}) ), {spaces: 2});

}
