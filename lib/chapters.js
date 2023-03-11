import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import sharp from 'sharp';
import {last, head, get, set, chunk, } from 'lodash-es';
import log from '../util/log.js';
import progress from '../util/progress.js';

import util from 'util';
import child_process from 'child_process';
const execFile = util.promisify(child_process.execFile);

export default async function chapters({db, configuration:{chapters} }, options){
  await fs.ensureDir( chapters );

  // console.log(db[0]);
  // database: 'furkies-purrkies',
  // file: {
  //   index: {
  //     name: 'index.md',
  //     src: '/home/meow/Universe/Development/catpea-project/database/furkies-purrkies/poem-1104/index.md',
  //     directory: undefined,
  //     size: 6785,
  //     atime: 2023-03-11T01:42:31.474Z,
  //     mtime: 2023-03-11T01:42:31.261Z,
  //     ctime: 2023-03-11T01:42:31.261Z,
  //     dest: [Object]
  //   },
  //   files: {
  //     name: 'files',
  //     src: '/home/meow/Universe/Development/catpea-project/database/furkies-purrkies/poem-1104/files',
  //     directory: true,
  //     size: 4096,
  //     atime: 2023-03-11T01:38:57.097Z,
  //     mtime: 2023-03-11T01:38:56.891Z,
  //     ctime: 2023-03-11T01:38:56.891Z,
  //     dest: [Object]
  //   }
  // },
  // attr: {
  //   features: { video: true },
  //   id: 'poem-1104',
  //   guid: '98264f36-95db-4d9e-a718-8859a0402ec9',
  //   title: 'The Meow Sea Shanties',
  //   description: null,
  //   tags: [ 'furkies-purrkies' ],
  //   date: '2023-03-11T00:01:18.480Z',
  //   lastmod: null,
  //   weight: 110400,
  //   audio: 'poem-1104.mp3',
  //   image: 'poem-1104-illustration.jpg',
  //   images: [],
  //   artwork: [ 'https://catpea.com' ],
  //   resources: null,
  //   raw: true,
  //   draft: false,
  //   links: []
  // },
  // html: '<pre>
  //
  const chapterSize = 250;
  const chapterDivisions = chunk(db.filter(o=>o.database==='furkies-purrkies'), chapterSize);
  let chapterNumber = 1;

  for (const chapter of chapterDivisions) {
    for (const record of chapter) {
      console.log(chapterNumber, record.attr.id);

    }
    chapterNumber++;
  }





  // const haveAudio = db.filter(o=>o.attr.audio);



  // const selected = [];
  //
  // for (const record of db){
  //   const dependencies = ( record.attr.audio );
  //
  //   const dest = path.join(chapters, record.attr.id + '.mp4');
  //   const exists = await fs.pathExists(dest);
  //
  //   if(dependencies&&!exists) selected.push(record)
  // }
  //
  // const bar = progress(`generating chapters`, `[:bar] :rate/tps :percent :etas`, selected.length, options.progress);
  // for (const record of selected){
  //   //await makeVideo(record, video);
  //   bar.tick()
  // }


}
