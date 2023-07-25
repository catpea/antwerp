import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import sharp from 'sharp';
import {last, head, get, set} from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';

import util from 'util';
import child_process from 'child_process';
const execFile = util.promisify(child_process.execFile);

export default async function audio({db, configuration:{audio} }, options){
  log.info('Exporting Audio Files');
  await fs.ensureDir( audio );
  const selected = [];

  for (const record of db){
    const featureRequested = ( record.attr.audio )
    if(featureRequested){
      const src = path.join(record.src, 'files', record.attr.audio);
      const dest = path.join(audio, record.attr.id + '.mp3');
      const missing = !(await fs.pathExists(dest));
      const expired = await isExpired(src, dest);

      if(missing||expired) selected.push({src, dest});
    }
  }

  const bar = progress(`copying audio`, `[:bar] :rate/tps :percent :etas`, selected.length, options.progress);
  for (const {src, dest} of selected){
    await fs.copyFile(src, dest);
    bar.tick()
  }

}

async function isExpired(src, dest){
  if( !(await fs.pathExists(src)) || !(await fs.pathExists(dest))) return null;
  const srcStat = await fs.stat(src);
  const destStat = await fs.stat(dest);
  const sourceDate = new Date(srcStat.mtime).getTime();
  const destinationDate = new Date(destStat.mtime).getTime();
  let difference = sourceDate - destinationDate;
  if(difference>0) return true;
}
