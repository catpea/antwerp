#!/usr/bin/env -S node --abort-on-uncaught-exception
import fs from 'fs-extra';
import path from 'path';
import { opendir } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { pipeline, finished,  } from 'node:stream/promises';
import invariant from 'invariant';
import util from 'util';
import lodash from 'lodash';
import {chain} from 'lodash-es';
import conf from './util/conf.js';
import log from './util/log.js';
import src from './lib/src.js';
import object from './lib/object.js';
import sources from './lib/sources.js';
import content from './lib/content.js';
import htmlize from './lib/htmlize.js';
import targets from './lib/targets.js';
import solutions from './lib/solutions.js';
import files from './lib/files.js';
import regen from './lib/regen.js';
import posts from './lib/posts.js';
import browser from './lib/browser.js';
import order from './lib/order.js';
import toc from './lib/toc.js';
import tiles from './lib/tiles.js';
import links from './lib/links.js';
import alerts from './lib/alerts.js';
import recon from './lib/recon.js';
import resize from './lib/resize.js';
import downloadYoutubeThumbnails from './features/download-youtube-thumbnails.js';
import injectYoutubeThumbnails   from './features/inject-youtube-thumbnails.js';
import { Command, Option } from 'commander/esm.mjs';

const program = new Command();
program.option('-v, --verbosity', 'increase verbosity', (value, previous)=>previous++, 0);
program.option('-f, --force', 'force installation');
program.option('--remove-unused-files', 'remove unused files');
program.parse(process.argv);

import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project] = program.args;
const configuration = path.join( c.get(project), 'conf.js' );

if (!conf.length) { console.error('configuration file required'); process.exit(1); }
const options = Object.fromEntries(['force', 'verbosity', 'removeUnusedFiles'].map(key=>([key, program.opts()[key]])))

const db = [];
const config = await conf(configuration, options);
const context = Object.assign({db}, config);

log.profile('build');
await compose(
  series(src, object, sources, content, order, htmlize, recon, downloadYoutubeThumbnails, injectYoutubeThumbnails, targets, solutions),
  //parallel(files, posts, browser, tiles, toc, links  )
)(context)
log.profile('build');

log.profile('resize');
await compose(resize)(context)
log.profile('resize');

log.profile('files');
await compose(files)(context)
log.profile('files');

log.profile('posts');
await compose(posts)(context)
log.profile('posts');

log.profile('browser');
await compose(browser)(context)
log.profile('browser');

log.profile('tiles');
await compose(tiles)(context)
log.profile('tiles');

log.profile('alerts');
await compose(alerts)(context)
log.profile('alerts');

log.profile('toc');
await compose(toc)(context)
log.profile('toc');

log.profile('links');
await compose(links)(context)
log.profile('links');


function compose(...stack){ return async (context) => { for(const instruction of stack) await instruction(context) } }
function series(...stack){ return async (context) => { for(const instruction of stack) await instruction(context) } }
function parallel(...stack){ return async (context) => Promise.all( stack.map(instruction=>instruction(context))) }
