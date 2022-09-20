import fs from 'fs-extra';
import path from 'path';
import util from 'util';
import chalk from 'chalk';
import ejsLint from 'ejs-lint';
import ejs from 'ejs';

import functions from './functions.js';

import lodash from 'lodash';
const {chunk, chain} = lodash;

let _ = lodash.runInContext();
_.mixin(functions);

const templates = {};

export default async function main({theme, file, data}){

  const options = {
    includer: (originalPath, parsedPath)=>({filename: path.join( path.resolve(theme), originalPath)}),
    delimiter: '?',
    openDelimiter: '<',
    closeDelimiter: '>',
  };

  try {
    const template = await cached(theme,file,options);
    const html = template(Object.assign(data, functions, {_}));
    return html;

  }catch(e){
    if(e instanceof ReferenceError){
      // console.trace(chalk.bgYellow.black(`Template File=${file}`));
    } else if(e instanceof SyntaxError){
      const text = await fs.readFile(path.join(theme, file), 'utf8');
      const se = ejsLint(text, options);
      console.error(chalk.bgRed.white(Array(81).join('•')))
      console.error('message', se.message);
      console.error('line', se.line);
      console.error('column', se.column);
      console.error(chalk.bgRed.white(Array(81).join('•')))
    }
    console.trace(chalk.bgYellow.black(`Template File=${file}`));
    throw e;
  }

}

async function cached(theme,file,options){
  const location = path.join(theme, file);
  if(!templates[location]){
    const text = await fs.readFile(location, 'utf8');
    templates[file] = ejs.compile(text, options);
  }
  return templates[file];
}
