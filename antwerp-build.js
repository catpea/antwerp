#!/usr/bin/env -S node --abort-on-uncaught-exception
import fs from 'fs-extra';
import path from 'path';
import { opendir } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { pipeline, finished,  } from 'node:stream/promises';
import invariant from 'invariant';
import util from 'util';
import lodash from 'lodash';
import conf from './util/conf.js';
import log from './util/log.js';
import { Command, Option } from 'commander/esm.mjs';
import {compose} from './util/compose.js';

import attachments from './core/attachments.js';
import cache from './core/cache.js';
import chain from './core/chain.js';
import chapters from './core/chapters.js';
import checker from './core/checker.js';
import content from './core/content.js';
import copy from './core/copy.js';
import dest from './core/dest.js';
import html from './core/html.js';
import recon from './core/recon.js';
import resize from './core/resize.js';
import schema from './core/schema.js';
import src from './core/src.js';
import video from './core/video.js';

import alerts from './pages/alerts.js';
import audiolist from './pages/audiolist.js';
import browser from './pages/browser.js';
import lectures from './pages/lectures.js';
import links from './pages/links.js';
import posts from './pages/posts.js';
import snippets from './pages/snippets.js';
import summary from './pages/summary.js';
import tiles from './pages/tiles.js';
import toc from './pages/toc.js';
import portfolioJpg from './pages/portfolio-jpg.js';

import downloadYoutubeThumbnails from './plugins/ytcover/download-youtube-thumbnails.js';
import injectYoutubeThumbnails   from './plugins/ytcover/inject-youtube-thumbnails.js';
import youtubeThumbnailCover from './plugins/ytcover/youtube-thumbnail-cover.js';

const program = new Command();
program.option('-v, --verbosity', 'increase verbosity', (value, previous)=>previous++, 0);
program.option('-f, --force', 'force installation');
program.option('--remove-unused-files', 'remove unused files');
program.parse(process.argv);
import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project] = program.args;
const configuration = c.get(project);
if (!conf.length) { console.error('configuration file required'); process.exit(1); }
const options = Object.fromEntries(['force', 'verbosity', 'removeUnusedFiles'].map(key=>([key, program.opts()[key]])))
const db = []; // instance is initialized here, initial moduled inject records into it.
const config = await conf(configuration, options);
const context = Object.assign({db}, config);
await Promise.all(Object.entries(context.configuration).filter(([k,v])=>(typeof v==='string')).filter(([k,v])=>v.startsWith('/')) .filter(([k,v])=>!v.match(/\.[a-z0-9]{2,4}$/)) .map(([k,v])=>v).map(async v=>await fs.ensureDir(v)));

// console.log(project);
// console.log(context);
// process.exit();

await compose(

  src, // setup the initial objects
  content, // read markdown/front matter information
  dest, // set file destinations - datastructure probably needs work
  html, // markdown to html
  chain, // set default order
  schema,

  checker, // basic local link checker
  recon, // extract images and links, and store as metadata.

  downloadYoutubeThumbnails, // grab the thumbs
  youtubeThumbnailCover, // create cover
  injectYoutubeThumbnails, // inject downloaded video covers into HTML article

  attachments, // used by HTML templates to display if there are extra files in the artice
  resize, // resize images to multiple sizes in place where the record exists as these are an asset (this must come before "files" so that "files" can copy them all)

  copy, // copy ./files to ./dest/permalink.../files
  cache, // save db

  posts,
  summary,
  browser,
  tiles,
  alerts,
  toc,
  lectures,
  snippets,
  links,
  portfolioJpg,
  audiolist,
  video,
  chapters, // divide into audio chapters - detach media from website

)(context);
