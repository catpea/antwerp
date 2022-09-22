// generate the portfolio image
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

export default async function main({db, configuration:{pp, dest, theme}, site}){
  const selected = db
  .map(record=>record.attr.features.portfolioJpg?['-label', '#'+record.number , path.join(record.file.files.src,'lg-'+record.attr.image)]:false)
  .filter(i=>i)
  await createCover(selected, path.join(dest, 'portfolio.jpg'))
}

async function createCover(files,dest){

  if(!files.length) return;

  try {
    let tile = parseInt(Math.sqrt(files.length)); // we cut off whatever does not make a neat square. - Math.sqrt(25) = 5 it gives the x or x*x that returns 25. parse int is used to remove remainder and make a perfect quare.
    const command = 'montage';
    const commandArguments = [
      '-background', '#000000',
      '-fill', '#f96982',
      '-pointsize', '9',
      '$SOURCES',
      '-geometry', '700x700+10', // https://imagemagick.org/Usage/montage/ ... "Geometry - Tile Size and Image Resizing"
      '-tile', `$TILE`,
      '$DESTINATION'
    ]
    .map(i=>i==='$TILE'?`${tile}x`:i)
    .map(i=>i==='$DESTINATION'?dest:i);
    commandArguments.splice(commandArguments.indexOf('$SOURCES'), 1, ...takeRight(files, Math.pow(tile,2)).flat() ); // Math.pow(tile,2) just means tile*tile which give that perfect square.
    const { stdout } = await execFile(command, commandArguments);
    if(stdout) console.log(stdout);
  } catch (e){
    console.log(e);
  }

  try {
    const command = 'convert';
    const commandArguments = [
      dest,
      '-resize',
      '5000x5000>',
      '-size',
      '5000x5000',
      'xc:black',
      '+swap',
      '-gravity',
      'center',
      '-composite',
      dest
    ];
    const { stdout } = await execFile(command, commandArguments);
    if(stdout) console.log(stdout);
  } catch (e){
    console.log(e);
  }
}
