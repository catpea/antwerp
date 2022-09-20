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

export default async function main({db, configuration:{pp, dest, theme}, site}){

  for (const record of db){
    if(record.attr.features.youtubeThumbnails && record.attr.links) await downloadThumbnails(record);
  }

}

async function downloadThumbnails(record){

    if(!record.attr.links) return;

    
    const requiredFiles = record.attr.links
      .map(link=>link.url)
      .map(url=>getVideoId(url));

    const existingFiles = (await fs.readdir(record.file.files.src, { withFileTypes: true }))
      .filter(o => o.isFile())
      .map(o => o.name)
      .map(s => s.match(/^yid-(.+)\.jpg$/))
      .filter(i=>i)
      .map(a=>a[1])

    const missingFiles = difference(requiredFiles, existingFiles);
    const bar = progress(`downloading thumbnails [:bar] :rate/tps :percent :etas`, missingFiles.length)
    for(const v of missingFiles){
      await downloadThumbnail(v, record.file.files.src);
      bar.tick()
    }
}

function hostname(url){
  if(url.startsWith('/')){
    return 'local';
  }else{
    try{
      const myURL = new URL(url);
      return myURL.hostname;
    }catch{
      return 'n/a'
    }
  }
}

function getVideoId(url){
    console.log('url>', url);
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

async function downloadThumbnail(v,dest){
  const downloadUrl = `https://img.youtube.com/vi/${v}/0.jpg`;
  const destinationFile = path.join(dest, `yid-${v}.jpg`);
  const response = await fetch(downloadUrl);
  // spawn('curl', [downloadUrl, '--output', destinationFile]);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await pipeline(response.body, fs.createWriteStream(destinationFile));
}

async function downloadSimulation(v,dest){
   return new Promise(resolve => setTimeout(resolve, 111));
}
