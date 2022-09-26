#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import npmConf from 'conf';
import chalk from 'chalk';
import conf from './util/conf.js';
import { padStart, kebabCase, startCase } from 'lodash-es';

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

  .showHelpAfterError()
  // .version('0.1.0')
  // .passThroughOptions()
  .command('register [project-name] [data-dir]', 'register a new project pointing it to a data/registry directory')
  .command('new [project-name] [creator-name]', 'create a new/blank record in the specified database')
  .command('build [project-name]', 'build a registered project')
  .command('read [project] [path]', 'read a configuration value with dotted notation, ex: configuration.src')

  .command('help', { isDefault: true })
  .description('clone a repository into a newly created directory')
  .action(async () => {

    const examples = [
      (project,creators,config)=>`${chalk.green('antwerp')} ${chalk.magenta('register')} ${chalk.yellow('my-project')} ${chalk.blue('/path/to/data')} \n${chalk.green('#points my-project to /path/to/data configuration directory')}\n`,
      (project,creators,config)=>creators.map(creator=>`${chalk.green('antwerp')} ${chalk.magenta('new')} ${chalk.yellow(project)} ${chalk.blue(creator)} ${chalk.cyan('--title')} ${chalk.blue('"My New '+startCase(creator)+' Title"')} \n${chalk.green('#builds a new record in '+path.join(config.configuration.src, creator))}\n`).join('\n'),
      (project,creators,config)=>`${chalk.green('antwerp')} ${chalk.magenta('build')} ${chalk.yellow(project)} \n${chalk.green('#builds website in '+config.configuration.dest)}\n`,
      (project,creators,config)=>`${chalk.green('antwerp')} ${chalk.magenta('read')} ${chalk.yellow(project)} ${chalk.blue('configuration.snippets')} \n${chalk.green('#prints '+config.configuration.snippets)}\n`,
    ];


    const c = new npmConf({projectName: 'antwerp'});
    for(const [name,location] of Object.entries(c.store)){
      const [project] = program.args;
      const configuration = path.join( location, 'conf.js' );
      if (!conf.length) { console.error('configuration file required'); process.exit(1); }
      const config = await conf(configuration);
      console.log();
      console.log(chalk.bgRed.white(`project: ${name}`));
      console.log();
      console.log( Object.entries(config.configuration) .filter(([k,v])=>(typeof v==='string')) .filter(([k,v])=>v.startsWith('/')) .map(([k,v])=>`${chalk.yellow(padStart(k, Object.keys(config.configuration) .reduce( (p,c)=>c.length>p.length?c:p).length+1, ' '))}: ${v}`).join('\n') );
      console.log();
      console.log('Examples:');
      console.log();
      for(const example of examples){
          console.log(example(name, Object.keys(config.creators).map(i=>kebabCase(i)), config));
      }
    }
    program.help()




  });

program.parse(process.argv);
