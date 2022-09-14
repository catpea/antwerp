import fs from 'fs-extra';
import path from 'path';
import ms from 'ms';
import {difference, intersection} from 'lodash-es';


export default async function main(){
  for (const record of this.db){
    for (const name in record.file){
      record.file[name].dest.missing = false;
      record.file[name].dest.expired = false;
      await missing(record.file[name]);
      await stat(record.file[name]);
      await expired(record.file[name]);
      record.file[name].dest.update = (record.file[name].dest.missing || record.file[name].dest.expired);

    }
  }
}

async function missing(file){ // .dest.target
  const exists = await fs.pathExists(file.dest.target);
  file.dest.missing = !exists;
  if(exists){
    const sourceFiles = await fs.readdir(file.src);
    const destinationFiles = await fs.readdir(file.dest.target);
    const copiedFiles = intersection(destinationFiles, sourceFiles);
    const missingFiles = difference(sourceFiles, copiedFiles);
    if(missingFiles.length) file.dest.missing = true;
  }
}

async function stat(file){
  if(!file.dest.missing){
    const sourceDate = new Date(file.mtime);
    const {size, atime, mtime, ctime} = await fs.stat(file.dest.target);
    Object.assign(file.dest, {size, atime, mtime, ctime})
   }
}

async function expired(file){
  if(!file.dest.missing){
    const sourceDate = new Date(file.mtime);
    const destinationDate = new Date(file.dest.mtime);
    file.dest.expired = false;
    if (sourceDate > destinationDate){
      // destination is expired, sources are newer, have been edited, and thus a recompilation is needed
      const difference = sourceDate - destinationDate;
      if(difference<1000){
        file.dest.expired = false;
      }else{
        // console.log(`source ${file.src} newer than generated ${file.dest.target} by ${difference} - regeneration required`)
        file.dest.expired =  true;
      }
    }else{
      // destination is not expired, sources are older
      file.dest.expired =  false;
    }
  }
}
