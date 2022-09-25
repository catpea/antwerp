import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import { truncate } from 'lodash-es';
import functions from '../util/functions.js';
import progress from '../util/progress.js';

export default async function htmlize({db}){
  const bar = progress(`parsing markdown [:bar] :rate/tps :percent :etas`, db.length)
  for (const record of db){
    record.html = marked(record.md);
    record.text = functions.plaintext(record.html).trim().replace(/ +/g, ' ');
    record.snip = truncate(record.text, {length: 256, separator: /\W/i, 'omission': ''})
    bar.tick()
  }
}
