import fs from 'fs-extra';
import path from 'path';

export default async function main(context){
  for (const record of context.db){

    record.file.index.dest.target = path.join(context.configuration.dest, 'permalink', record.attr.guid, 'index.html');
    record.file.files.dest.target = path.join(context.configuration.dest, 'permalink', record.attr.guid, 'files');


  }
}
