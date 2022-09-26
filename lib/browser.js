import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';
import progress from '../util/progress.js';

import lodash from 'lodash';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse} = lodash;

export default async function browser({db, configuration:{pp, dest, theme}, site}, options){
  log.info('Processing Browser');
  await fs.copy(path.join(theme, 'static'), dest);
  const layout = doLayout(db,pp);
  const bar = progress(`processing index`, `[:bar] :rate/tpf :percent :etas`, layout.length, options.progress);
  for(const {browse, posts} of layout){
    const data = Object.assign({filename:browse.name}, {browse, posts}, site)
    const html = await template({ theme, file: 'index.ejs', data, });
    await fs.writeFile(path.join(dest, browse.name), html);
    if(browse.name=='index.html') await fs.writeFile(path.join(dest, '404.html'), html); // <-- creates the 404 page
    bar.tick()
  }
}

function doLayout(db,pp){
  const layout = [];
  const pages = chunk(db, pp)
  let counter = 0;
  for(const posts of pages){
    const home = counter==0;
    const name = counter==0?'index.html':`index-${counter}.html`;
    const next = (counter+1>(pages.length-1)?0:counter+1);
    const prev = (counter-1<0?(pages.length-1):counter-1);
    const first = !counter;
    const last = counter==pages.length-1
    const total = pages.length;
    const browse = {home, name,total,counter,next,prev,first,last};
    layout.push({browse,posts});
    counter++;
  }
  let cursor = 0;
  const [leftSize, rightSize] = [5,6];
  const simulation = range(layout.length);
   for(const page of simulation ){
     const [left,right] = partition(simulation.filter(i=>i!=cursor), o=>(indexOf(simulation,o)<cursor))


     let back = takeRight(left,leftSize)
     let forw = take(right,rightSize)
     if(back.length<leftSize) forw = take(right, rightSize + (leftSize-back.length ) );
     if(forw.length<rightSize) back =     takeRight(left,  leftSize  + (rightSize-forw.length) );

     Object.assign(layout[cursor].browse, {back, forw})
     cursor++
   }
  return layout;
}

async function slowDown(){
   return new Promise(resolve => setTimeout(resolve, 100));
}
