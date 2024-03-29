import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import sharp from 'sharp';
import {last, head, get, set, chunk, padStart} from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';
import { marked } from 'marked';

import util from 'util';
import child_process from 'child_process';
const execFile = util.promisify(child_process.execFile);

export default async function chapters({db,   configuration:{chapters}, site}, options){


  if(!chapters) return;

  await fs.ensureDir( chapters );

  // Select all compatible records
  const selected = [];
  for (const record of db){
    const featureRequested = ( record.attr.audio );
    if(featureRequested){
      const {dest, dir, name, src} = getDestinatonDirectory(chapters, record);
      const exists = await fs.pathExists(dest);

      if(exists){
        const outdated = await expired(src, dest);
        if(outdated){
          console.log(`chapters: file ${dest} expired, it will be updated.`);
          selected.push(record)

          /*

          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1170.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1168.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1146.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1145.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1142.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1141.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1140.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1139.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1123.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1115.mp3 was expired!!!!!!!!!!!!
          file /home/meow/Universe/Development/catpea-project/dist/chapters/chapter-06/docs/poem-1113.mp3 was expired!!!!!!!!!!!!


          */
        }

      }else{
        // did not exist, add it
        selected.push(record)
      }

    }
  }

  // Copy files into chapters.
  const bar = progress(`copying media into chapter`, `[:bar] :rate/tps :percent :etas`, selected.length, options.progress);
  for (const record of selected){
    const {src, dest, dir, name} = getDestinatonDirectory(chapters, record);
    await fs.ensureDir( dir );
    await fs.copyFile(src, dest);
    bar.tick()
  }

  // Create Index Files - link to all mp3 in the set
  // Initialize Chapter Metadata
  const chapterDb = {};
  for (const record of db){
    const featureRequested = ( record.attr.audio && record.attr.chapter );
    if(!featureRequested) continue;

    if(!chapterDb[record.attr.chapter]){
      const {src, dest, dir, name, root} = getDestinatonDirectory(chapters, record);
      chapterDb[record.attr.chapter] = {
        name: `Chapter ${padStart(record.attr.chapter, 2, '0')}`,
        readme: path.join(root, 'README.md'),
        index: path.join(dir, 'index.html'),
        // path: {src, dest, dir, name, root},
        files:[],
      };
      // console.log('added', chapterDb[record.attr.chapter]);
    }
  }



  // Add Files
  for (const record of db){
    const featureRequested = ( record.attr.audio && record.attr.chapter );
    if(!featureRequested) continue;
    chapterDb[record.attr.chapter].files.push(record);
  }
  // console.log(   chapterDb);
  for (const chapterKey in chapterDb) {
    const chapter = chapterDb[chapterKey];
     await fs.writeFile(chapter.readme, readmeText(chapter, site.website))
     await fs.writeFile(chapter.index, indexText(chapter, site.website))
  }




} // main






function getDestinatonDirectory(base, record){
  const name = `chapter-${padStart(record.attr.chapter, 2, '0')}`;
  const root = path.join(base, name);
  const dir = path.join(base, name, 'docs' );
  const src = path.join(record.src, 'files' , record.attr.audio);
  const dest = path.join(dir, record.attr.audio);
  return {dest, dir, name, src, root};
}


function text(){
  return `Welcome to the audiobook bug-fixing project! We are dedicated to providing an excellent listening experience for our users. Our goal is to make sure that all the content is error-free and of the highest quality.

This open source project provides an opportunity for you to help us improve the mighty audiobook experience. As a listener, you can use your knowledge and expertise to examine the audio and identify any issues that might be preventing the audiobook from reaching highest quality. Once identified, you can submit bug-fixes to ensure that the audiobook will be enjoyable for all.

We appreciate your help in making the audiobook experience better for all the listeners. Thank you for joining this project and helping us make the open school experience a great one!

As always you can download the latest version at https://archive.org/details/@catpea-com`;

}

function readmeText(chapter, website){
  const files = chapter.files.map(o=>`- [${o.attr.title}](docs/${o.attr.audio})`).join('\n');
  return `${website.title}
---

${text()}

${files}

`;
}

function indexText(chapter, website){
  const files = chapter.files.map(o=>`<a href="${o.attr.audio}" class="list-group-item list-group-item-action">${o.attr.title}</a>`).join('\n')
return `
<!doctype html>
<html lang="en" data-bs-theme="dark">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${website.title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
  </head>
  <body>

  <main class="container">
    <div class="row">
      <div class="col pt-5">
        <h3>${website.title}</h3>
        ${marked.parse(text())}

        <ul class="list-group list-group-flush mt-5">
        ${files}
        </ul>
      </div>
    </div>
  </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
  </body>
</html>

`;
}


async function expired(src, dest){
    const srcStat = await fs.stat(src);
    const destStat = await fs.stat(dest);
    const sourceDate = new Date(srcStat.mtime).getTime();
    const destinationDate = new Date(destStat.mtime).getTime();
    let difference = sourceDate - destinationDate;

    // if(src.includes('poem-1170')){
    //   console.log('\n\n');
    // console.log({src});
    // console.log({dest});
    //   console.log({srcStat});
    //   console.log({destStat});
    //   console.log({sourceDate});
    //   console.log({destinationDate});
    //   console.log({difference});
    //   console.log(`\nSource file is older than the destination file by   (${difference}), therefore destination is out-of-date, and needs to be updated.`);
    // }

    // console.log(src, dest, difference);

    if(difference>0) return true;
}
