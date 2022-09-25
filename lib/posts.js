import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';

import progress from '../util/progress.js';

export default async function posts({db, configuration:{theme}, site} ){
  const bar = progress(`generating posts [:bar] :rate/tpf :percent :etas`, db.length);

  log.info('Processing Posts');
  await Promise.all(db.map( record=>savePost({record,theme,site,done:()=>bar.tick()}) )); // parallel
  log.info('DONE Processing Posts');


  async function savePost({record,theme,site, done}){
    const data = Object.assign({},{posts:[], post: record}, site);
    const html = await template({ theme, file: path.join('post','index.ejs'), data, });
    done()
    return fs.writeFile(record.file.index.dest.target, html)
    // console.log(record.attr.title);
  }


}
/*
import progress from '../util/progress.js';
const bar = progress(`loading posts [:bar] :rate/tps :percent :etas`, db.length)
bar.tick()
*/
