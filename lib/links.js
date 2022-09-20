import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';

import lodash from 'lodash';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse} = lodash;

export default async function main({db, configuration:{pp, dest, theme}, site}){
  const data = Object.assign({},{posts:db}, site);
  const html = await template({ theme, file: path.join('links','index.ejs'), data, });
  await fs.writeFile(path.join(dest, 'links.html'), html)
}
