import fs from 'fs-extra';
import path from 'path';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import { filter } from 'lodash-es';
import functions from '../util/functions.js';
import progress from '../util/progress.js';
import cheerio from "cheerio";
import chalk from "chalk";

export default async function checker({db}){
  const bar = progress(`checking links [:bar] :rate/tps :percent :etas`, db.length)
  for (const record of db){
    await checkLinks(record);
    bar.tick()
  }
}

async function checkLinks(record){
  const $ = cheerio.load(record.html);
  const links = [ ['a', 'href'], ['img', 'src'], ['script', 'src'], ['style', 'href'] ]
  .map(([tag, attr])=>$(tag).map((i, el)=>({url:$(el).attr(attr).trim(), tag, attr, record})).get())
  .flat()
  .map((link) => {
    const kind = {};
    if(link.url.startsWith('http://')||link.url.startsWith('https://')||link.url.startsWith('mailto:')) Object.assign(kind, {remote: true})
    if(link.url.match(/^https?:\/\/\w+\.catpea.\w{3}/)) Object.assign(kind, {network: true})
    if(link.url.match(/^https?:\/\/catpea.\w{3}/)) Object.assign(kind, {network: true})
    if(link.url.startsWith('/permalink/')) Object.assign(kind, {permalink: true})
    if(!kind.remote&&!kind.permalink) kind.local = true;
    return Object.assign(link, kind);
  })

  // REPORTS
  for(const link of filter( links, {local:true})){
      const target = path.join(record.src, link.url);
      const exists = await fs.pathExists(target);
      if(!exists) console.log('MISSING LINK: ', chalk.red(target));
  }

  for(const link of filter( links, {network:true})){
    if(!link.url.startsWith('/permalink/')){
      console.log('\nNOT A PERMALINK: ', chalk.red(link.url), link.record.attr.id, link.tag+':'+link.attr);
    }
  }

}

async function slowDown(){
   return new Promise(resolve => setTimeout(resolve, 5));
}