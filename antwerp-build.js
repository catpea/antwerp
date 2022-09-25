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
import summary from './lib/summary.js';
import audiolist from './lib/audiolist.js';
import video from './lib/video.js';
import checker from './lib/checker.js';
import attachments from './lib/attachments.js';
import downloadYoutubeThumbnails from './features/download-youtube-thumbnails.js';
import injectYoutubeThumbnails   from './features/inject-youtube-thumbnails.js';
import youtubeThumbnailCover from './features/youtube-thumbnail-cover.js';
import portfolioJpg from './features/portfolio-jpg.js';
import { Command, Option } from 'commander/esm.mjs';

import {compose, cache, series, parallel, ask} from './util/whoopdedo.js';

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

await Promise.all(Object.entries(context.configuration).filter(([k,v])=>(typeof v==='string')).filter(([k,v])=>v.startsWith('/')).map(([k,v])=>v).map(async v=>await fs.ensureDir(v)));

log.profile('build');

async function tryCache(context){
  const changed = false;


  //
  if(changed){
    return;
  }else{
    // context.db = await fs.readJson(path.join(context.configuration.cache, 'db.json'));
    // return true;
  }
}

async function saveCache({db}){
  await fs.writeJson(path.join(context.configuration.cache, 'db.json'), db);
}
async function hasPortfolioSelectionChanged({db}){
  //await fs.writeJson(path.join(context.configuration.cache, 'db.json'), db);
}
async function ifImagesChanged({db}){
  //await fs.writeJson(path.join(context.configuration.cache, 'db.json'), db);
}


async function newRecord(){}
async function ifNewWarriorAdded(){}


// PROGRAM FLOW

// 1 series and parallel are important concepts that must be clear and never avoided,
// 2 cache is important, but should be kept away from the program flow, as it will complicate it.

await compose(

  cache(
    tryCache,
    series(
      src,
      object,
      sources,
      content,
      order,
      htmlize,
      checker,
      recon,
      cache(
        ifNewWarriorAdded,
        downloadYoutubeThumbnails
      ),
      youtubeThumbnailCover,
      injectYoutubeThumbnails,
      targets,
      attachments,
      solutions,
      saveCache,
    ),
  ),

  resize,
  files,

  series(
    posts,
    summary,
    browser,
    tiles,
    alerts,
    toc,
    links,
      cache(hasPortfolioSelectionChanged, portfolioJpg),
    audiolist,
    video,
  )

)(context);
