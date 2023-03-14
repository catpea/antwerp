import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';

import lodash from 'lodash';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse} = lodash;

export default async function toc({db, configuration:{pp, dest, theme}, site}){
  const filename = 'toc.html';
  const data = Object.assign({filename},{posts:db}, site);
  const html = await template({ theme, file: path.join('toc','index.ejs'), data, });
  await fs.writeFile(path.join(dest, filename), html)
}
