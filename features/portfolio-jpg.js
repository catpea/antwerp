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

export default async function portfolioJpg({db, configuration:{pp, dest, theme}, site}){

  const targetLocation = path.join(dest, 'portfolio.jpg');
  const prefix = 'sm-';
  const selected = db
  .filter(record=>record.attr.features.portfolioJpg)
  .filter(record=>record.attr.image)
  .map(record=>path.join(record.file.files.src,prefix+record.attr.image)).filter(i=>i)
  if(selected.length>1) await createCover(selected, targetLocation);

}

async function createCover(selected, dest, square = false){
  const command = 'montage';
  const args = {
    '-background': '#f96982',
    '_sources': square?takeRight(selected, Math.pow(tile,2)):selected,
    '-tile': (square?parseInt(Math.sqrt(selected.length)):Math.ceil(Math.sqrt(selected.length))) + 'x',
    '-geometry': '+0+0',
    '_destination': dest,
  }

  try {
    const { stdout } = await execFile(command, Object.entries(args).map(([k,v])=>[k.startsWith('_')?undefined:k,v]).flat(2).filter(i=>i));
    if(stdout) console.log(stdout);
  } catch (e){
    console.log(e);
  }

}
