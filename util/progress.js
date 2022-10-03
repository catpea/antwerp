import calculatePercent from 'calculate-percent';
import chalk from 'chalk';
import {debounce} from 'lodash-es';
import ProgressBar from 'progress';
import log from './log.js';

class SimpleProgressBar {

  counter = 0;

  constructor(name, line, options){
    this.name = name;
    this.line = line;
    this.options = options;
    this.max = options.total;
    this.last = new Date().getTime();
    this.debounced = debounce(this.bounced, 1000);
  }

  bounced(){
    log.info( chalk.cyan(this.name + ': ') + chalk.yellow(calculatePercent(this.counter, this.max) + '%') );
  }

  tick(){
    if (this.counter == 0) this.bounced();
    this.counter++;
    this.counter==this.max?this.debounced.flush():this.debounced();
  }

}


export default function bar(name, line, length, mode){
  if(mode == 'series'){
    return new ProgressBar(name +' ' + line, { complete: '=', incomplete: ' ', head:'>', clear: true, width: 55, total: length });
  } else if (mode == 'parallel'){
    return new SimpleProgressBar(name, line, { complete: '=', incomplete: ' ', head:'>', clear: true, width: 55, total: length });
  }
}
