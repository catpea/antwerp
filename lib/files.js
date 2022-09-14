import fs from 'fs-extra';
import path from 'path';
import {difference, intersection, differenceBy, intersectionBy} from 'lodash-es';

export default async function main(){
  for (const record of this.db){
    if(record.file.files.dest.missing) await transferMissing(record, {ensureDir:true})
    if(record.file.files.dest.expired) await transferExpired(record)
    await unneededFiles(record, this.configuration.removeUnused)
  }
}

async function transferMissing(record, {ensureDir}={ensureDir:false}){
  if(ensureDir) await fs.ensureDir( record.file.files.dest.target);
  missingCopy(record.file.files.src, record.file.files.dest.target);
}
async function transferExpired(record, {ensureDir}={ensureDir:false}){
  if(ensureDir) await fs.ensureDir( record.file.files.dest.target);
  updateCopy(record.file.files.src, record.file.files.dest.target);
}
async function unneededFiles(record, remove){
  fileCleanup(record.file.files.src, record.file.files.dest.target, remove);
}

async function missingCopy(src, dest){
  const sourceFiles = await fs.readdir(src);
  const destinationFiles = await fs.readdir(dest);
  const copiedFiles = intersection(destinationFiles, sourceFiles);
  const missingFiles = difference(sourceFiles, copiedFiles);
  const extraFiles = difference(destinationFiles, sourceFiles);
  for(const name of missingFiles) await fs.copy(path.join(src,name), path.join(dest,name));
  if(extraFiles.length) console.log(`warning: file${extraFiles.length>1?'s':''} that are no longer needed detected in ${dest}`, extraFiles );
}

async function fileCleanup(src, dest, remove){
  const sourceFiles = await fs.readdir(src);
  const destinationFiles = await fs.readdir(dest);
  const extraFiles = difference(destinationFiles, sourceFiles);
  for(const name of extraFiles){
    if(!remove) console.log('unneded files detected', path.join(dest, name));
    if(remove) await fs.remove(path.join(dest, name))
  }
  if(extraFiles.length && !remove) console.log('enable removal with --remove-unused');
}

async function updateCopy(from, to){
  const sourceFiles = await fs.readdir(from);
  for(const name of sourceFiles){
    let src = path.join(from, name);
    let dest = path.join(to, name);
    if(expired(src, dest)) await fs.copy(src, dest);
  }
}

async function expired(src, dest){
    const srcStat = await fs.stat(src);
    const destStat = await fs.stat(dest);
    const sourceDate = new Date(srcStat.mtime);
    const destinationDate = new Date(destStat.mtime);
    let expired = false;
    let difference = 0;
    if (sourceDate > destinationDate){
      difference = sourceDate - destinationDate;
      if(difference < 1000){
         expired = false;
      }else{
         expired =  true;
      }
    }else{
       expired = false;
    }
    return expired;
}
