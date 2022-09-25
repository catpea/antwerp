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

export default async function youtubeThumbnailCover({db, covers, configuration:{pp, dest, theme}, site}){
  // const list = db.filter(record=>(record.attr.features.youtubeThumbnails && record.attr.links));
  // // filter this list further with const exists = await fs.pathExists(dest); calvulation
  //
  // for (const record of list){
  //   const dest = path.join(record.file.files.src, record.attr.image, {covers});
  //   // const exists = await fs.pathExists(dest);
  //   //if(!exists)
  //   // await makeCover(record, dest);
  //   bar.tick()
  // }


  const selected = [];

  for (const record of db){
    const featureRequested = (record.attr.features.youtubeThumbnails && record.attr.links)
    const dest = path.join(record.file.files.src, record.attr.image);
    const exists = await fs.pathExists(dest);
    if(featureRequested&&!exists) selected.push(record)
  }

  const bar = progress(`making covers [:bar] :rate/tps :percent :etas`, selected.length);
  for (const record of selected){
    await makeCover(record, {covers});
    bar.tick()
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

      let tile = parseInt(Math.sqrt(files.length)); // we cut off whatever does not make a neat square.
      // Math.sqrt(25) = 5 it gives the x or x*x that returns 25. parse int is used to remove remainder and make a perfect quare.

      const command = 'montage';
      const commandArguments = [
        '-background',
        '#000000',
        'SOURCES',
        '-geometry',
        '222x222', // https://imagemagick.org/Usage/montage/ ... "Geometry - Tile Size and Image Resizing"
        '-tile',
        `TILE`,
        'DESTINATION'
       ]
      .map(i=>i==='TILE'?`${tile}x`:i)
      .map(i=>i==='DESTINATION'?dest:i);

      commandArguments.splice(commandArguments.indexOf('SOURCES'), 1, ...files.slice(0,Math.pow(tile,2)));
      /// Math.pow(tile,2) just means tile*tile which give that perfect square.

      try{
        const { stdout } = await execFile(command, commandArguments);
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
