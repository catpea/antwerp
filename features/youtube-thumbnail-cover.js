import { spawn } from 'child_process';
import { pipeline } from 'node:stream/promises';
import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';
import fetch from 'node-fetch';
import lodash from 'lodash';
import chalk from 'chalk';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse, difference} = lodash;
import progress from '../util/progress.js';

import util from 'util';
import child_process from 'child_process';
const execFile = util.promisify(child_process.execFile);

export default async function youtubeThumbnailCover({db, covers, configuration:{pp, dest, theme}, site}, options){
  const selected = [];
  for (const record of db){
    const featureRequested = (record.attr.features.ytcover && record.attr.links)
    const dest = path.join(record.file.files.src, record.attr.image);
    const exists = await fs.pathExists(dest);
    if(featureRequested&&!exists) selected.push(record)
  }
  const bar = progress(`making covers`, `[:bar] :rate/tps :percent :etas`, selected.length, options.progress);
  for (const record of selected){
    await makeCover(record, {covers});
    bar.tick()
  }
}

function getVideoId(url){
  if(url.startsWith('/')){
    return 'local';
  }else{
    try{
      const myURL = new URL(url);
      return myURL.searchParams.get('v');
    }catch{
      return 'n/a'
    }
  }
}

async function makeCover(record, {covers}){

  const dest = path.join(record.file.files.src, record.attr.image);
  const files = record.attr.links
    .filter(link=>link.presentation==true)
    .map(link=>link.url)
    .filter(url=>url.startsWith('https://www.youtube.com/watch?v='))
    .map(url=>getVideoId(url))
    .map(o => path.join(record.file.files.src, `yid-${o}.jpg`))

  if(!files.length) return;

  const command = 'montage';
  const args = {
    '-background': '#000000',
    '_sources': files.slice(0,Math.pow(parseInt(Math.sqrt(files.length)),2)),
    '-trim': undefined,
    '-gravity': 'center',
    '-extent': '1:1',
    '-geometry': '222x222^',
    '-tile': `${parseInt(Math.sqrt(files.length))}x`,
    '_destination': dest,
  }

  try{
    const { stdout } = await execFile(command, Object.entries(args).map(([k,v])=>[k.startsWith('_')?undefined:k,v]).flat(2).filter(i=>i));
    // console.log(command, Object.entries(args).map(([k,v])=>[k.startsWith('_')?undefined:k,v]).flat(2).filter(i=>i).join(' '));
    if(stdout) console.log(stdout);
    for(const {prefix, width, height} of covers){
      const dest = path.join(record.file.files.src, prefix + '-' + record.attr.image);
      const exists = await fs.pathExists(dest);
      await fs.remove(dest)
    }
  }catch (e){
    console.log(e);
  }

}
