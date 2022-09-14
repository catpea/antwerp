#!/usr/bin/env node

import fs from 'fs-extra';
import { opendir } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';

import { pipeline, finished,  } from 'node:stream/promises';

import util from 'util';
import winston from 'winston';
import lodash from 'lodash';

import src from './lib/src.js';
import object from './lib/object.js';
import sources from './lib/sources.js';
import content from './lib/content.js';
import targets from './lib/targets.js';
import solutions from './lib/solutions.js';
import files from './lib/files.js';
import regen from './lib/regen.js';

import { Command, Option } from 'commander/esm.mjs';

let api = lodash.runInContext();
// api.mixin({ ex });

const program = new Command();
program.option('-f, --force', 'force installation');
program.option('--remove-unused', 'remove unused files');
program.parse(process.argv);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({ format: winston.format.simple(), })
  ],
});

// const pkgs = program.args;
// if (!pkgs.length) { console.error('packages required'); process.exit(1); }
// if (program.opts().force) console.log('  force: install');
// pkgs.forEach(function(pkg) { console.log('  install : %s', pkg); });

const [dest] = program.args;

// console.log(`building dest: ${dest}`);
// ['.antwerp', 'configuration.json'];

const db = [];
const configuration = {
  src: '/home/meow/Universe/Development/db/dist/static-port',
  dest: '/home/meow/Universe/Development/archive/dist/catpea-com',
  removeUnused: program.opts().removeUnused,
};
const context = {configuration, db};

logger.profile('db');
//await compose(context, src, object, sources, content, targets, solutions);
logger.profile('db');

logger.profile('build');
// await compose(context, files);
// await compose(files, posts, index, browser, tiles, toc);
logger.profile('build');

// console.log(util.inspect(db[666], false, 42, true));
// console.log(db.map(o=>o.attr.title));



// DISK SECTION (async)
// const regenerate = await regen(allContent, configuration); ///).slice(0,3);
// logger.profile('Metadata Loader');

// logger.profile('Missing File Identification');
// const missingFiles = await missing(configuration); ///).slice(0,3);
// logger.profile('Missing File Identification');

// console.log(allContent);

// const content = await data(configuration);
// console.log(locations);
// // DATA SECTION (sync)
// logger.profile('Data Sorting');
// const sorted = api.chain(content).sortBy('date').reverse().value();
// logger.profile('Data Sorting');
//
// // console.log(sorted.map(o=>o.title));


async function compose(context, ...stack){
  for(const instruction of stack) await instruction.bind(context)()
}
