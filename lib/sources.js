import fs from 'fs-extra';
import path from 'path';
import camelCase from 'lodash/camelCase.js';

export default async function main(context){
  await describeFiles(context.db);
}

async function describeFiles(db){
  for(const record of db){
    await describeFile(record, 'index.md',);
    await describeDirectory(record, 'files');
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
