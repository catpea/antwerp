import fs from 'fs-extra';
import path from 'path';

export default async function dest(context){
  for (const record of context.db){
    record.dest = path.join(context.configuration.dest, 'permalink', record.attr.guid,);
  }
}
