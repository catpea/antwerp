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

  for (const record of db){
    if( record.attr.features.youtubeThumbnails ){
      await rewriteLinks(record);
    }
    bar.tick();
  }
}

async function rewriteLinks(record){
   // return new Promise(resolve => setTimeout(resolve, 11));
  // const text = await fs.readFile(record.file.index.src, 'utf8'); // read text
  // let markdownData = (await readFile(markdownFile)).toString();
  log.info(`Injecting thumbnails into ${record.attr.id}`)
  const updatedMarkdownBuffer = await remark()
  .data('settings', {rule: '-'})
  .use(injectThumbnails)
  .process(record.md);
  const result = (updatedMarkdownBuffer).toString();
  record.md = result;

}


function injectThumbnails() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (parent && typeof index === 'number' && ( node.type === 'paragraph' ) && (node.children[0]?.type === 'link') ) {
        const target = node.children[0];
          if(target.url.startsWith('https://www.youtube.com/watch?v=') ){
            let label = null;
            if(target.children && target.children[0].type === 'text'){
              label = target.children[0].value;
              const video = getVideoId(target.url);
              target.children[0] = {
                type: 'image',
                title: label,
                url: `files/yid-${video}.jpg`,
                alt: label,
              }
            }
            if(label){
              let injectionSite = index;
              parent.children.splice(injectionSite, 0,
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'heading',
                      depth: 2,
                      children: [
                        {
                          type: 'text', value: label},
                      ]
                    }
                  ]
                }
            );

            }
          } // if node url


      }
    })
  }
}




function getVideoId(url){

  if(url.startsWith('/')){
    return 'local';
  }else{
    try{
      const myURL = new URL(url);
      return myURL.searchParams.get('v');
    }catch{
      return 'n/a'
    }
  }
}
