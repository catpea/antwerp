import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import sharp from 'sharp';
import {last, head, get, set} from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';

export default async function resize({db, covers}, options){

    const bar = progress(`resizing images`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
    let counter = 0;
    for (const post of db){
      const src = path.join(post.src, 'files', post.attr.image);
      for(const {prefix, width, height} of covers){
        const dest = path.join(post.src, 'files', prefix + '-' + post.attr.image);

        // TODO: add expired file checks!!!!!!!!!!!!!!!!1
        const exists = await fs.pathExists(dest);
        if(!exists) await resizer({width, height, src, dest});

      }

      bar.tick()
      counter++;
    }
}

async function resizer({width, height, src, dest,}){
  return sharp(src).resize(width, height).jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).toFile(dest); // https://sharp.pixelplumbing.com/
}
