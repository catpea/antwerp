#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { Command, Option } from 'commander/esm.mjs';
import conf from './util/conf.js';
import {camelCase, get} from 'lodash-es';
const program = new Command();
program.option('-f, --force', 'force installation');
program.option('-t, --title [name]', 'specify title');
program.parse(process.argv);

import npmConf from 'conf';
const c = new npmConf({projectName: 'antwerp'});
const [project, dotted] = program.args;
const configuration = c.get(project);

const opts = program.opts();
if (!conf.length) { console.error('configuration file required'); process.exit(1); }
const options = Object.fromEntries(['force'].map(key=>([key, opts[key]])))
const config = await conf(configuration, options);

console.log(get(config, dotted));
