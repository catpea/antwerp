import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ProgressBar from 'progress';
import percent from 'calculate-percent';
import {difference, intersection, differenceBy, intersectionBy} from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';

export default async function main(context){
  log.info(`Record file transfer (working with ${context.db.length} records)`)
  // const bar = new ProgressBar(':bar', { total: context.db.length });

  const bar = progress(`copying records [:bar] :rate/fps :percent :etas`, context.db.length)
  let counter = 0;
  for (const record of context.db){
    //console.log(`[${counter}/${context.db.length}] ${percent(counter, context.db.length)}%`);
    // BUG: NOT RELIABLE if(record.file.files.dest.missing)
     await transferMissing(record, {ensureDir:true})
    if(record.file.files.dest.expired) await transferExpired(record); // must run after transferMissing
    await unneededFiles(record, context.configuration.removeUnusedFiles)
    counter++;
    bar.tick();
  }
}

async function transferMissing(record, {ensureDir}={ensureDir:false}){
  if(ensureDir) await fs.ensureDir( record.file.files.dest.target);
  await missingCopy(record.file.files.src, record.file.files.dest.target);
}
async function transferExpired(record, {ensureDir}={ensureDir:false}){
  if(ensureDir) await fs.ensureDir( record.file.files.dest.target);
  await updateCopy(record.file.files.src, record.file.files.dest.target);
}
async function unneededFiles(record, remove){
  await fileCleanup(record.file.files.src, record.file.files.dest.target, remove);
}

async function missingCopy(src, dest){
  try{
    const sourceFiles = await fs.readdir(src);
    const destinationFiles = await fs.readdir(dest);
    const copiedFiles = intersection(destinationFiles, sourceFiles);
    const missingFiles = difference(sourceFiles, copiedFiles);
    const extraFiles = difference(destinationFiles, sourceFiles);
    // console.log(`Missing FIles: ${missingFiles}`);
    for(const name of missingFiles){
      await fs.copyFile(path.join(src,name), path.join(dest,name));
    }
    if(extraFiles.length) console.log(`warning: file${extraFiles.length>1?'s':''} that are no longer needed detected in ${dest}`, extraFiles );
  }catch(e){
    console.trace(e)
    throw e
  }
}

async function fileCleanup(src, dest, remove){

  const sourceFiles = await fs.readdir(src);
  const destinationFiles = await fs.readdir(dest);
  const extraFiles = difference(destinationFiles, sourceFiles);
  if(!remove&&extraFiles.length) console.log(`Warning ${extraFiles.length} unneded files detected in ${dest}.`);
  for(const name of extraFiles){
    if(remove) await fs.remove(path.join(dest, name))
  }
  if(extraFiles.length && !remove) console.log('enable removal with --remove-unused-files');

}

async function updateCopy(from, to){
  const sourceFiles = await fs.readdir(from);
  for(const name of sourceFiles){
    let src = path.join(from, name);
    let dest = path.join(to, name);
    if(await expired(src, dest)){
      //console.log(src, dest);
      await fs.copyFile(src, dest);
    }

  }
}

async function expired(src, dest){
  try{
    const srcStat = await fs.stat(src);
    const destStat = await fs.stat(dest);

    const sourceDate = new Date(srcStat.mtime);
    const destinationDate = new Date(destStat.mtime);

    let expired = false;
    let difference = 0;

    if (sourceDate > destinationDate){
      difference = sourceDate - destinationDate;
      //console.log(difference);
      if(difference < 1000){
         expired = false;
      }else{
         expired =  true;
      }
    }else{
       expired = false;
    }
    return expired;

  }catch(e){
    console.trace(e)
    throw e
  }
}
