import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import { filter, concat } from 'lodash-es';
import functions from '../util/functions.js';
import progress from '../util/progress.js';
import cheerio from "cheerio";
import chalk from "chalk";

export default async function attachments({db}, options){
  const bar = progress(`counting attachments`, `[:bar] :rate/tps :percent :etas`, db.length, options.progress)

  for (const record of db){
    await countAttachments(record);
    bar.tick()
  }

}

async function countAttachments(record){

  // console.log(record.attachments);
  record.attachments = concat(record.attr.links, record.attr.images).filter(i=>i)
    .map( ({title,url}) =>({title,url}))
    .filter(link=>!(link.url.startsWith('http://')||link.url.startsWith('https://')||link.url.startsWith('mailto:')));
}
