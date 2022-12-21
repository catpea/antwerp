import fs from 'fs-extra';
import path from 'path';
import log from '../util/log.js';
import template from '../util/template.js';
import functions from '../util/functions.js';
import progress from '../util/progress.js';

export default async function summary({db, configuration:{theme}, site}, options ){
  const bar = progress(`generating summaries`, `[:bar] :rate/tpf :percent :etas`, db.length, options.progress);
  log.info('Processing Summaries');
  await Promise.all(db.map( record=>saveSummary({record,theme,site,done:()=>bar.tick()}) )); // parallel
}

async function saveSummary({record, theme, site, done}){
    const head = `Audio and full text version is available advertisement free at: https://catpea.com or visit https://github.com/catpea/ for source-code`;
    const title = record.attr.title;
    const date = functions.timestamp(record.attr.date);
    //const content = record.text;
    const content = record.md;
    const separator = '-'.repeat(80)+'\n';
    const header = [ head, separator, title, date, '\n' ].join('\n');
    const limit = 5000-header.length;
    const body = limiter(content, limit);
    const text = header+body;
    await fs.writeFile(path.join(record.src, 'summary.txt'), text);
    done();
}

function limiter(content, max){
  if(content.length <= max) return content;
  const middle = `\n----- snip ----- (Sorry, 5,000 letter limit in summaries see catpea.com or visit https://github.com/catpea/ for source-code) ----- snip -----\n`;
  const newlines = 3;
  const elipsis = 3;
  const limit = max - middle.length - (elipsis*2) - newlines;
  const halfLimit = limit/2;
  const half = content.length/2;
  const size = Math.min(halfLimit, half);
  const tail = (half)+(half-size);
  const before = content.substr(0,size) + '...';
  const after = '...' +content.substr(tail);
  return content = [before, middle, after].join('\n');
}
