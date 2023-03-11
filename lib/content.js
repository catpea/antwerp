import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import { truncate } from 'lodash-es';
import functions from '../util/functions.js';
import progress from '../util/progress.js';

export default async function content({db}, options){

  const bar = progress(`loading posts`, `[:bar] :rate/tps :percent :etas`, db.length, options.progress)

  // Read Metadata
  for (const record of db){
    const text = await fs.readFile(record.file.index.src, 'utf8'); // read text
    const {attributes:attr, body:md} = frontMatter(text); // calculate front matter
    Object.assign(record.attr, attr);
    record.md = md;
    bar.tick()
  }


}
