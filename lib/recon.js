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
import cheerio from "cheerio";
import pretty from "pretty";

export default async function main({db, configuration:{pp, dest, theme}, site}){
  const bar = progress(`loading images+links [:bar] :rate/tpf :percent :etas`, db.length);
  for (const record of db){
    const li = await findLinks(record);
    Object.assign(record.attr, li);
    bar.tick();
  }
}

async function findLinks(record){
  const links = getLinks(record.html);
  const images = getImages(record.html);
  return {links, images}
}

function getLinks(html){
  let unique = new Set();
  const $ = cheerio.load(html);
  const list = $("a")
    .map(function (i, el) {

      const url = ($(this).attr("href") || "").trim();
      const presentation = $(this).attr("title") == 'Play Video';

      let title;

      if(presentation){
         title = $(this).text();
       }else{
         // not a video meant for presentation, a wild wild west here...
         title = ($(this).attr("title") || $(this).text() || "").trim().replace(/\s+/g, " ");
       }

      const id = title + url;

      if (title && url && !unique.has(id)) {
        unique.add(id);
        return { title, url, presentation };
      }
    })
    .get()
    .filter((i) => i);
  return list;
}

function getImages(html){
  const $ = cheerio.load(html);
  const list = $("img").map(function (i, el) {
      const title = $(this).attr("title") || $(this).attr("alt");
      const url = $(this).attr("src")
      // .replace(/^\/image\//, "").replace(/^(bl|ss|xs|sm|md|lg|xl)-/, ""); // TODO: v1 has some anaomalies this can be removed in v3
      return { title, url };
    }).get();

  return list;
}
