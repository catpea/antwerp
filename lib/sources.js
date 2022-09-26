import fs from 'fs-extra';
import path from 'path';
import camelCase from 'lodash/camelCase.js';
import progress from '../util/progress.js';

export default async function sources(context, options){
  await describeFiles(context.db, options);
}

async function describeFiles(db, options){
  const bar = progress(`describing files`, `[:bar] :rate/tps :percent :etas`, db.length, options.progress)
  for(const record of db){
    await describeFile(record, 'index.md',);
    await describeDirectory(record, 'files');
    bar.tick()
  }
}

async function describeDirectory(record, name){
  return describeFile(record, name, true);
}
async function describeFile(record, name, directory){
  const keys = {'index.md':'index'};
  const dir = record.src;
  const src = path.join(dir, name);
  const {size, atime, mtime, ctime} = await fs.stat(src);
  record.file[keys[name]||name] = {
    name,
    src,
    directory,
    size,
    atime, mtime, ctime,
    dest:{}
  };
}
