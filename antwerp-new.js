#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { Command, Option } from 'commander/esm.mjs';
import conf from './util/conf.js';
import {camelCase} from 'lodash-es';
import frontMatter from 'front-matter';
const program = new Command();
program.option('-f, --force', 'force installation');
// program.requiredOption('-s, --source [name]', 'specify source database');
program.option('-t, --title [name]', 'specify title');
program.option('-a, --after [name]', 'specify position');
program.option('-d, --debug', 'debug or dry run where nothing is changed.');
program.parse(process.argv);

import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project, book] = program.args;
const configuration = c.get(project);

const opts = program.opts();
if (!conf.length) { console.error('project name required'); process.exit(1); }
const options = Object.fromEntries(['force'].map(key=>([key, opts[key]])))
const config = await conf(configuration, options);
const sources = await readSources(config.configuration.src);
const source = selectSource(sources, book);

const kind = source.name;
const dest = source.path;
const title = opts.title;
const after = opts.after;
const debug = opts.debug;

const entries = (await fs.readdir(dest, { withFileTypes: true })) .filter(dirent => dirent.isDirectory()) .filter(dirent => !dirent.name.startsWith('_')) .map(({name}) => path.join(dest, name));
const db = (await Promise.all( entries.map(src=>fs.readFile(path.join(src,'index.md'), 'utf8')))).map(text=>frontMatter(text).attributes);

const samples = config.configuration.samples;
config.creators[camelCase(source.name)]({db, dest, kind, title, after, samples, debug})

function selectSource(list, key){
  const found = list.filter(o=>o.name==key)[0];
  if(!found) throw new Error('Specifed source not found');
  return found;
}

async function readSources(...target){
   return (await fs.readdir(path.join(...target), { withFileTypes: true }))
     .filter(dirent => dirent.isDirectory())
     .filter(dirent => !dirent.name.startsWith('_'))
     .map(({name}) => ({name, path: path.join(...target, name)}))
 }
