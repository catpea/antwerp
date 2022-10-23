import fs from 'fs-extra';
import path from 'path';
import lo from 'lodash';
import log from '../util/log.js';
import template from '../util/template.js';

import lodash from 'lodash';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse} = lodash;

export default async function toc({db, configuration:{pp, dest, theme}, site}){

  const posts = db.filter(i=>i.database==='westland-warrior')

  {
    const filename = 'lectures.html';
    const data = Object.assign({ordered:false},{filename},{posts}, site);
    const html = await template({ theme, file: path.join('lectures','index.ejs'), data, });
    await fs.writeFile(path.join(dest, filename), html)
  }

  {
    const filename = 'lectures-ordered.html';
    const data = Object.assign({ordered:true},{filename},{posts: lo.orderBy( posts, ['attr.weight'], ['asc'] )}, site);
    const html = await template({ theme, file: path.join('lectures','index.ejs'), data, });
    await fs.writeFile(path.join(dest, filename), html)
  }


}
