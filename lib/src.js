import fs from 'fs-extra';
import path from 'path';

import log from '../util/log.js';

export default async function main({db, configuration:{src}}){
  const directories = await readDirectories(await readDirectory(src));
  db.splice(0, ...directories  ); // .slice(10,13)
  log.info(`Working with ${db.length} post directories.`)
}

async function readDirectory(...target){
   return (await fs.readdir(path.join(...target), { withFileTypes: true }))
     .filter(dirent => dirent.isDirectory())
     .filter(dirent => !dirent.name.startsWith('_'))
     .map(({name}) => path.join(...target, name))
 }

async function readDirectories(categories){
  const response = [];
  for(const category of categories) response.push(...await readDirectory(category))
  return response;
}
