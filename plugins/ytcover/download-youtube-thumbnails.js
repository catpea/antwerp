import { spawn } from 'child_process';
import { pipeline } from 'node:stream/promises';
import fs from 'fs-extra';
import path from 'path';
import log from '../../util/log.js';
import template from '../../util/template.js';
import fetch from 'node-fetch';
import lodash from 'lodash';
import chalk from 'chalk';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse, difference} = lodash;
import progress from '../../util/progress.js';







import http from 'node:http';
import https from 'node:https';

const httpAgent = new http.Agent({
	keepAlive: true,
  family: 4,
});
const httpsAgent = new https.Agent({
	keepAlive: true,
  family: 4,
});








export default async function downloadYoutubeThumbnails({db, configuration:{pp, dest, theme}, site}, options){

  for (const record of db){
    if (record.attr.features.ytcover && record.attr.links) await downloadThumbnails(record, options);
  }

}

async function downloadThumbnails(record, options){

    if(!record.attr.links) return;


    const requiredFiles = record.attr.links
      .filter(link=>link.presentation==true)
      .map(link=>link.url)
      .filter(url=>url.startsWith('https://www.youtube.com/watch?v='))
      .map(url=>getVideoId(url));

    const existingFiles = (await fs.readdir(path.join(record.src, 'files'), { withFileTypes: true }))
      .filter(o => o.isFile())
      .map(o => o.name)
      .map(s => s.match(/^yid-(.+)\.jpg$/))
      .filter(i=>i)
      .map(a=>a[1])

    const testing = false;

    const missingFiles = difference(requiredFiles, existingFiles);
    const bar = progress(`downloading thumbnails`, `[:bar] :rate/tps :percent :etas`, missingFiles.length, options.progress);

    for(const v of missingFiles){
      if(testing){
        console.log(`record title: ${record.attr.title}`);
        console.log(`YOUTUBE DOWNLOAD DISABLED: ${v}`);
      }else{
        await downloadThumbnail(v, path.join(record.src, 'files'));
        bar.tick()
      }
      await slowDown();
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
  if(url.startsWith('/')){
    return 'local';
  }else{
    try{
      const myURL = new URL(url);
      const response = myURL.searchParams.get('v');
      // console.log(response);
      return response;
    }catch{
      return 'n/a'
    }
  }
}

async function downloadThumbnail(v,dest){
  const downloadUrl = `https://img.youtube.com/vi/${v}/0.jpg`;
  const destinationFile = path.join(dest, `yid-${v}.jpg`);
  // console.log(downloadUrl, destinationFile);
  // return


  const options = {

  	headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0'
    },            // Request headers. format is the identical to that accepted by the Headers constructor (see below)

    agent: function(_parsedURL) {
   		if (_parsedURL.protocol == 'http:') {
   			return httpAgent;
   		} else {
   			return httpsAgent;
   		}
   	}
}


  const response = await fetch(downloadUrl, options);
  // spawn('curl', [downloadUrl, '--output', destinationFile]);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await pipeline(response.body, fs.createWriteStream(destinationFile));
}

async function slowDown(){
   return new Promise(resolve => setTimeout(resolve, 100));
}
async function downloadSimulation(v,dest){
   return new Promise(resolve => setTimeout(resolve, 111));
}
