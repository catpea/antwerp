import fs from 'fs-extra';
import path from 'path';
import {last, head, get, set} from 'lodash-es';
import log from '../util/log.js';

export default async function order({db}){

  // [Default] Sort and Number
  db.sort(function(a,b){ return new Date(b.attr.date) - new Date(a.attr.date) });
  for (let number = db.length, index = 0, size = db.length; index < size; number--, index++) { db[index].number = number; }

  // Chain Together (in a loop)
  let counter = 0;
  for (const post of db){
    post.order.first = counter==0;
    post.order.last = counter+1==db.length;
    let next = post.order.first?last(db):db[counter-1];
    let prev = post.order.last?head(db):db[counter+1];
    post.order.prev = prev.attr.guid;
    post.order.next = next.attr.guid;
    counter++;
  }

}
