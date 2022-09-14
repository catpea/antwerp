import fs from 'fs-extra';
import path from 'path';
import camelCase from 'lodash/camelCase.js';

export default async function main(){
  await describeFiles(this.db);
}

async function describeFiles(db){
  for(const record of db){
    await describeFile(record, 'index.md',);
    await describeFile(record, 'files');
  }
}

async function describeFile(record, name){
  const keys = {'index.md':'index'};
  const src = path.join(record.src, name);
  const {size, atime, mtime, ctime} = await fs.stat(src);
  record.file[keys[name]||name] = {
    name,
    src,
    size,
    atime, mtime, ctime,
    dest:{}
  };
}
