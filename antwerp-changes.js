#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';

import invariant from 'invariant';
import { Command, Option } from 'commander/esm.mjs';
import { camelCase, merge } from 'lodash-es';

import rsend from 'rsend';
import conf from './util/conf.js';
import log from './util/log.js';

const program = new Command();
program.option('-t, --title [name]', 'specify title');
program.option('-a, --after [name]', 'specify position');
program.option('-d, --debug', 'debug or dry run where nothing is changed.');
program.parse(process.argv);

import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project] = program.args;
invariant(project, 'project name is required execute antwerp without any arguments to see help.')
const configuration = c.get(project);

const opts = program.opts();
if (!conf.length) { console.error('project name required'); process.exit(1); }
const options = Object.fromEntries(['debug'].map(key=>([key, opts[key]])))
const config = await conf(configuration, options);

const locations = [];
for (const profile of config.publish.profiles) {
  const prescription = await rsend(merge({}, profile, { src: { dir: config.configuration.dest }}), config.configuration);
  const location = path.join(config.configuration.home, [profile.name, profile.batchfile].join('-') );
  let contents = prescription.script.trim();
  await fs.writeFile(location, contents.length ? contents + '\n':'');
  locations.push(location);
  if (opts.debug) log.info([location + ` (${contents.length} bytes)`, contents.length ? contents + '\n' : '(empty)'].join('\n'))
  // if ( opts.debug ) console.log( prescription.normal.filter(i=>i.includes('check')) );
}

console.log(locations.map(i=>i).join(' '));
