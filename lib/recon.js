import { spawn } from 'child_process';
import { pipeline } from 'node:stream/promises';
import fs from 'fs-extra';
import util from 'util';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';
import fetch from 'node-fetch';
import lodash from 'lodash';
import chalk from 'chalk';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse, difference, last, nth} = lodash;
import progress from '../util/progress.js';
import {remark} from 'remark'
import {visit} from 'unist-util-visit'
// import {visitParents, EXIT, SKIP, CONTINUE,} from 'unist-util-visit-parents'

export default async function main({db, configuration:{pp, dest, theme}, site}){
  log.info('Injecting thumbnails')

  const bar = progress(`injecting thumbnails [:bar] :rate/tpf :percent :etas`, db.length);

  console.log('USE CHEERIO FOR EXTRACTING IMAGES AND LINKS!!!!!!!!!!');
  for (const record of db){
    if( 1 ){
    //  HTML BASED

      //const li = await findLinks(record);
      //Object.assign(record.attr, li);
    }
    bar.tick();
  }
}




async function findLinks(record){

  const links = [];
  const images = [];

  function bork() {
    return (tree) => {
      // console.log(util.inspect(tree, true, 4, true));
      visit(tree, (node, index, parent) => {

        if ( parent && typeof index === 'number' && ( node.type === 'image' || node.type === 'imageReference' || node.type === 'definition' ) ) {
          // console.log('IMAGE', node);
          if(node.url) images.push({src:node.url})
        }

        if ( parent && typeof index === 'number' && ( node.type === 'link' || node.type === 'link' || node.type === 'linkReference' || node.type === 'definition' ) ) {
          console.log('LINK', node);
          if(node.url) links.push({url:node.url})
        }

      })
    }
  }


  log.info(`Injecting thumbnails into ${record.attr.id}`);
  const updatedMarkdownBuffer = await remark()
  .data('settings', {rule: '-'})
  .use(bork)
  .process(record.md);


  return {links, images}



}
