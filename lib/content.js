import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import { truncate } from 'lodash-es';
import functions from '../util/functions.js';
import progress from '../util/progress.js';

export default async function content({db}){

  const bar = progress(`loading posts [:bar] :rate/tps :percent :etas`, db.length)
  for (const record of db){
    const text = await fs.readFile(record.file.index.src, 'utf8'); // read text
    const {attributes:attr, body:md} = frontMatter(text); // calculate front matter
    Object.assign(record.attr, attr);
    record.md = md;
    bar.tick()
  }

  db.sort(function(a,b){
    return new Date(b.attr.date) - new Date(a.attr.date);
  });

  // for (let number = db.length, index = db.length-1; number > 0; number--, index--) {
  for (let number = db.length, index = 0, size = db.length; index < size; number--, index++) {
  // for (let number = 11, index = 0, size = db.length; index < size; number++, index++) {
    db[index].number = number;
  }

  //db.reverse(); // http://127.0.0.1:8081/permalink/36cac2c7-3bf4-4fb3-8fe0-24a8dba48c88/
}
