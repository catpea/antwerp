import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import sharp from 'sharp';
import {last, head, get, set} from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';

export default async function resize({db, covers}, options){
    invariant(db[0].file.files.src, 'file.files.src is required for resize');
    invariant(db[0].attr.image, 'post.attr.image is required for resize');
    const bar = progress(`resizing images`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
    let counter = 0;
    for (const post of db){
      const src = path.join(post.file.files.src, post.attr.image);
      for(const {prefix, width, height} of covers){
        const dest = path.join(post.file.files.src, prefix + '-' + post.attr.image);
        const exists = await fs.pathExists(dest);
        if(!exists) await resizer({width, height, src, dest});
      }
      // await zzz();
      bar.tick()
      counter++;
    }
}

async function resizer({width, height, src, dest,}){
  return sharp(src).resize(width, height).jpeg({ quality: 100, chromaSubsampling: '4:4:4' }).toFile(dest); // https://sharp.pixelplumbing.com/
}

async function zzz(){
   return new Promise(resolve => setTimeout(resolve, 1));
}

// if something gets broken use these as replacment
// convert: ['-define', 'jpeg:size=640x480', 'SOURCE', '-thumbnail', '300x300^', '-gravity', 'center', '-extent', '300x300', '-quality', '90', 'DESTINATION']
// convert: ['-define', 'jpeg:size=800x600', 'SOURCE', '-thumbnail', '500x500^', '-gravity', 'center', '-extent', '500x500', '-quality', '90', 'DESTINATION']
// convert: ['-define', 'jpeg:size=1024x768', 'SOURCE', '-thumbnail', '700x700^', '-gravity', 'center', '-extent', '700x700', '-quality', '100', 'DESTINATION']
