import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';

export default async function main({db, configuration:{theme}, site} ){
  log.info('Processing Posts');
  await Promise.all(db.map( record=>savePost({record,theme,site}) )); // parallel



}

async function savePost({record,theme,site}){
  const data = Object.assign({},{posts:[], post: record}, site);
  const html = await template({ theme, file: path.join('post','index.ejs'), data, });
  await fs.writeFile(record.file.index.dest.target, html)
}
