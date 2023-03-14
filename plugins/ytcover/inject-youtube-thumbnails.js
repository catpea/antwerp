import { spawn } from 'child_process';
import { pipeline } from 'node:stream/promises';
import fs from 'fs-extra';
import util from 'util';
import path from 'path';
import log from '../../util/log.js';
import template from '../../util/template.js';
import fetch from 'node-fetch';
import lodash from 'lodash';
import chalk from 'chalk';
const {kebabCase, range, chunk, chain, partition, indexOf, takeRight, take, reverse, difference, last, nth} = lodash;
import progress from '../../util/progress.js';
import * as cheerio from 'cheerio';
import pretty from "pretty";

export default async function injectYoutubeThumbnails({db, configuration:{pp, dest, theme}, site}, options){
  log.info('Injecting YouTube Thumbnails');
  const bar = progress(`rewriting HTML`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
  for (const record of db){
    if (record.attr.features.ytcover ){
      await rewriteLinks(record);
    }
    bar.tick();
  }
}

async function rewriteLinks(record){
  const $ = cheerio.load(record.html, null, false);

  const list = $("p > a")
    .filter((i,el)=>$(el).attr("href").startsWith('https://www.youtube.com/watch?v='))
    .filter((i,el)=>$(el).attr("title")=='Play Video')
    .map((i,el) => {
      const title =  $(el).text();
      const url = $(el).attr("href");
      const v = getVideoId(url);
      $(el)
        .empty()
        .append(`<div class="p-md-5 m-xl-5 border-rounded"><img class="w-100 rounded shadow" src="files/yid-${v}.jpg"></div>`)
        // .wrap(`<p>`)
        .parent()
        .before(`<h4 id="${kebabCase(title)}">${title}</h4>`);

      return el;
    });
  record.html = $.html();
}

function getVideoId(url){
  const myURL = new URL(url);
  return myURL.searchParams.get('v');
}
