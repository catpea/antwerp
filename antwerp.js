#!/usr/bin/env node

import invariant from 'invariant';
import { Command } from 'commander/esm.mjs';

const program = new Command();
program.version('1.0.0');

// program
//   .command('build <name>')
//   .description('Performs a one off build of your site into ./dist')
//   .action(name=>{build({name})});
//
// program
//   .command('create <project> [template]')
//   .option('-n, --name <name>', 'Name of item to create')
//   .description('Creates a new record with default settings.')
//   .action((project, template, options)=>{create({project, template, options})});


program
  .name('antwerp')
  .version('0.1.0')
  .command('init [data] [template]', 'initialize new repository with data and template')
  .command('build [query]', 'search with optional query')
  .command('update', 'update installed packages', { executableFile: 'myUpdateSubCommand' })
  .command('help', 'list packages installed', { isDefault: true });

program.parse(process.argv);
