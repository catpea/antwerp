#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import npmConf from 'conf';
import { Command, Option } from 'commander/esm.mjs';
import conf from './util/conf.js';
import {camelCase, set} from 'lodash-es';
const program = new Command();

program.option('-f, --force', 'force installation');
program.option('-t, --title [name]', 'specify title');
program.parse(process.argv);

const [key, val] = program.args;
const opts = program.opts();
if (!conf.length) { console.error('key val required'); process.exit(1); }
const options = Object.fromEntries(['force'].map(key=>([key, opts[key]])))

const c = new npmConf({projectName: 'antwerp'});

c.set(key, val);
console.log(c.get(key));
