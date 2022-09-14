import fs from 'fs-extra';
import path from 'path';

export default async function main(){
  for (const record of this.db){

    record.file.index.dest.target = path.join(this.configuration.dest, 'permalink', record.attr.guid, 'index.html');
    record.file.index.dest.update = false;

    record.file.files.dest.target = path.join(this.configuration.dest, 'permalink', record.attr.guid, 'files');
    record.file.files.dest.update = false;


  }
}
