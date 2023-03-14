
import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import progress from '../util/progress.js';
import {difference, intersection, differenceBy, intersectionBy} from 'lodash-es';
import ago from 's-ago';
import ms from 'ms';

export default async function copy({db, configuration:{pp, dest, theme, removeUnusedFiles, noMp3}, site}, options){
  log.info('Copying record files')
  const bar = progress(`copying record files`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
  for (const record of db){
    await fs.ensureDir( dest);
    const blacklist = [];
    if(noMp3) blacklist.push(record.attr.audio);
    await copier(path.join(record.src, 'files'), path.join(record.dest, 'files'), { cleanup:removeUnusedFiles, blacklist });
    bar.tick();
  }
}



async function copier(src, dest, {filter, cleanup, blacklist} = {filter:function(filename, src, dest){return true;}, cleanup:false, blacklist:[]}){

  await fs.ensureDir( dest );

  const allFiles = await fs.readdir(src);
  const sourceFiles =  difference(allFiles, blacklist||[]);
  const destinationFiles = await fs.readdir(dest);
  const copiedFiles = intersection(destinationFiles, sourceFiles);
  const missingFiles = difference(sourceFiles, copiedFiles);
  const extraFiles = difference(destinationFiles, sourceFiles);

  // FOR OUTDATED FILES
  for(const filename of copiedFiles){
    if(await expired(path.join(src, filename), path.join(dest, filename))) {
      const srcStat = await fs.stat(path.join(src, filename));
      const destStat = await fs.stat(path.join(dest, filename));
      const sourceDate = new Date(srcStat.mtime);
      const destinationDate = new Date(destStat.mtime);
      console.log('\n');
      // log.info(`${path.join(src, filename)} updated ${ago(sourceDate)} but the last time destination was changed is ${ago(destinationDate)}, therefore file must be copied from source to destination.`);
      await fs.copyFile(path.join(src, filename), path.join(dest, filename));
    }
  }

  // FOR FILES THAT ARE MISSING
  for(const filename of missingFiles){
    if(filter){
      const verdict = filter(filename, src, dest);
      // console.log(`\nMissing file detected (filter is in use and file will be ${verdict?'copied':'not-copied'})!`, path.join(src, filename), path.join(dest, filename));
      if(verdict) {
        await fs.copyFile(path.join(src, filename), path.join(dest, filename));
      }
    }else{
      // console.log('\nMissing file detected (unfiltered copy)!', path.join(src, filename), path.join(dest, filename));
      await fs.copyFile(path.join(src, filename), path.join(dest, filename));
    }
  }

  // FOR FILES THAT ARE NO LONGER IN THE SOURCE
  if(cleanup){
    for(const filename of extraFiles){
      console.log('remove unused/blacklisted', path.join(dest, filename));
      // await fs.remove(path.join(dest, filename))
    }
  }else{
    if(extraFiles.length) log.info(`warning: file${extraFiles.length>1?'s':''} that are no longer needed detected in ${dest} use execute "antwerp build <project-name> --remove-unused-files" to remove them.`, extraFiles );
  }

}


async function expired(src, dest){
    const srcStat = await fs.stat(src);
    const destStat = await fs.stat(dest);
    const sourceDate = new Date(srcStat.mtime);
    const destinationDate = new Date(destStat.mtime);
    let difference = sourceDate - destinationDate;

    // if(difference>0) console.log(`\nSource file is older than the destination file by ${ms(difference, { long: true })} (${difference}), therefore destination is out-of-date, and needs to be updated.`);
    if(difference>0) return true;
}

//
// async function expired(src, dest){
//   try{
//     const srcStat = await fs.stat(src);
//     const destStat = await fs.stat(dest);
//
//     const sourceDate = new Date(srcStat.mtime);
//     const destinationDate = new Date(destStat.mtime);
//
//     let expired = false;
//     let difference = sourceDate - destinationDate;
//     // if(difference>0) console.log(`\nSource file is older than the destination file by ${ms(difference, { long: true })} (${difference}), therefore destination is out-of-date, and needs to be updated.`);
//
//     if (sourceDate > destinationDate){
//       if(difference < 1000){
//          expired = false;
//       }else{
//          expired =  true;
//       }
//     }else{
//        expired = false;
//     }
//     return expired;
//   }catch(e){
//     console.trace(e)
//     throw e
//   }
// }
