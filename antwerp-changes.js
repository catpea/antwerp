#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import invariant from 'invariant';
import rsend from 'rsend';
import { Command, Option } from 'commander/esm.mjs';
import conf from './util/conf.js';
import {camelCase, merge} from 'lodash-es';
import frontMatter from 'front-matter';
const program = new Command();
program.option('-t, --title [name]', 'specify title');
program.option('-a, --after [name]', 'specify position');
program.option('-d, --debug', 'debug or dry run where nothing is changed.');
program.parse(process.argv);

import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project] = program.args;
invariant(project, 'project name is required execute antwerp without any arguments to see help.')
const configuration = path.join( c.get(project), 'conf.js' );

const opts = program.opts();
if (!conf.length) { console.error('project name required'); process.exit(1); }
const options = Object.fromEntries(['debug'].map(key=>([key, opts[key]])))
const config = await conf(configuration, options);

const locations = [];
for (const profile of config.publish.profiles) {
  const prescription = await rsend(merge({}, profile, { src: { dir: config.configuration.dest }}), config.configuration);
  const location = path.resolve([profile.name, profile.batchfile].join('-'));
  await fs.writeFile(location, prescription.script.trim() + '\n');
  locations.push(location);
}
console.log(locations.map(i=>JSON.stringify(i)).join(' '));

 