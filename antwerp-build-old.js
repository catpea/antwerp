#!/usr/bin/env node

import fs from 'fs-extra';
import { opendir } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { compose } from 'node:stream';
import { pipeline, finished,  } from 'node:stream/promises';

import lodash from 'lodash';

import { Command, Option } from 'commander/esm.mjs';

import mixins from './mixins.js';

const program = new Command();
program.option('-f, --force', 'force installation');
program.parse(process.argv);

let api = lodash.runInContext();
mixins(api);


// const pkgs = program.args;
// if (!pkgs.length) { console.error('packages required'); process.exit(1); }
// if (program.opts().force) console.log('  force: install');
// pkgs.forEach(function(pkg) { console.log('  install : %s', pkg); });

const [dest] = program.args;
// console.log(`building dest: ${dest}`);

// ['.antwerp', 'configuration.json'];

const configuration = {
  src: '/home/meow/Universe/Development/db/dist/static-port',
  dest: '/home/meow/Universe/Development/archive',
};
//
// const postDatabase = api.chain(configuration).getPostDirectories().all()
// .parsePosts().all().sortBy('date').reverse().linkCollection();
//
// console.log(postDatabase.value());








// try {
//   const dir = await opendir('./');
//   for await (const dirent of dir)
//     console.log(dirent.name);
// } catch (err) {
//   console.error(err);
// }




// async function * agDir() {
//   const dirs = await opendir(configuration.src);
//   for await (const dirent of dirs){
//     yield dirent.name ;
//   }
// }
// const dirStream = Readable.from(agDir());
//

const categoryStream = compose(async function * () {
  const dirs = await opendir(configuration.src);
  for await (const dirent of dirs){
    yield dirent.name;
  }
}());

const postStream = compose(async function * (source) {
  source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
  for await (const chunk of source) {

    const dirs = await opendir(configuration.src,  chunk );
    for await (const dirent of dirs){
      yield String(dirent.name);
    }
  }
});

let res = '';

// Convert AsyncFunction into writable Duplex.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(  compose(categoryStream, postStream, s3)  );
console.log(res); // prints 'HELLOWORLD'


// const myTransform = new Transform({
//   decodeStrings: false, // Accept string input rather than Buffers
//   transform(chunk, encoding, callback) {
//
//     console.log('CHUNK-b!', chunk);
//     callback(null, chunk)
//   }
// });
//
// const myTransform = new Transform({
//   decodeStrings: false, // Accept string input rather than Buffers
//   transform(chunk, encoding, callback) {
//
//     console.log('CHUNK-b!', chunk);
//     callback(null, chunk)
//   }
// });
//
// try{
//   const data = await pipeline(categoryStream, postStream, myTransform);
//   console.log('DATA:::', data);
// } catch(err){
//   console.error(err);
//   ac.abort();
// };

// for await (const chunk of dirStream) {
//   console.log(chunk);
// }

// for await (const chunk of pipeline(dirStream, myTransform)) {
//   console.log(chunk);
// }



//
// readable.on('close', () => {
//   ac.abort();
// });
//
// readable.on('data', (chunk) => {
//   console.log(chunk);
// });



// pipeline(
// dirStream, myTransform,
//   (err) => {
//     if (err) {
//       console.error('Pipeline failed.', err);
//     } else {
//       console.log('Pipeline succeeded.');
//     }
//   }
// );


class MyReadable extends Readable {
 constructor(filename) {
   super(options);
   this.filename = filename;
 }
}

const xpi = {
  createCategoryListing (src)=>new MyTransform(src)
}


async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setTimeout(() => ac.abort(), 1);
  await pipeline(
    xpi.createCategoryListing(configuration.src),
    // fs.createReadStream('archive.tar'),
    // zlib.createGzip(),
    // fs.createWriteStream('archive.tar.gz'),
    // { signal },
  );
}

run().catch(console.error); // AbortError
