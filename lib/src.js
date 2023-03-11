import fs from 'fs-extra';
import path from 'path';
import util from 'util';

import log from '../util/log.js';

export default async function src({db, configuration:{src}}){
  const databases = await getDatabases(src);
  const paths = await getPaths(databases);
  const records = getRecords(paths);

  db.splice(0, ...records  ); // injecting data into the array
  log.info(`Working with ${db.length} records.`)
}

async function getDatabases(src){
  return getDirectories(src)
}

async function getPaths(databases){
  const records = [];
  for(const database of databases){
    let entries = await getDirectories(database);
    records.push(...entries);
  }
  return records;
}

async function getDirectories(src){
  return (await fs.readdir(path.join(src), { withFileTypes: true }))
  .filter(dirent => dirent.isDirectory())
  .filter(dirent => !dirent.name.startsWith('_')) // not disabled
  .map(({name}) => path.join(src, name))
}

function getRecords(paths){
  const objects = [];
  for(const src of paths){
    const database = path.basename(path.dirname(src))
    const object = {
      src,
      database,

      file:{},
      attr:{features:{}},
      html:"",
      order:{},
      attachments:[],
    }
    objects.push(object);
  }
  return objects;
}
