import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';

export default async function main(){
  for (const record of this.db){
    // do
    const text = await fs.readFile(record.file.index.src, 'utf8'); // read text
    const {attributes:attr, body:md} = frontMatter(text); // calculate front matter
    // set
    record.attr = attr;
    record.html = marked(md);
  }
}
