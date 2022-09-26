#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import npmConf from 'conf';
import { Command, Option } from 'commander/esm.mjs';
import conf from './util/conf.js';

const program = new Command();
program.option('-V, --serbosity', 'increase verbosity', (value, previous)=>previous++, 0);
program.option('-v, --verbosity', 'increase verbosity', (value, previous)=>previous++, 0);
program.parse(process.argv);

const c = new npmConf({projectName: 'antwerp'});

for(const [name,location] of Object.entries(c.store)){
  const [project] = program.args;
  const configuration = path.join( location, 'conf.js' );
  if (!conf.length) { console.error('configuration file required'); process.exit(1); }
  const config = await conf(configuration);
  console.log(`project: ${name}`);
  console.log( Object.entries(config.configuration) .filter(([k,v])=>(typeof v==='string')) .filter(([k,v])=>v.startsWith('/')) .map(([k,v])=>`${k}: ${v}`).join('\n') );
  program.help()
}
