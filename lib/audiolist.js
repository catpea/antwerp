import fs from 'fs-extra';
import path from 'path';
import {last, head, get, set} from 'lodash-es';
import log from '../util/log.js';

export default async function main({db, configuration:{src, dest, theme}, site}){

    const content = db
    .map(record=>record.attr.audio?"file '"+path.join('permalink',record.attr.guid, 'files', record.attr.audio)+"'":false)
    .filter(i=>i)
    .join('\n');

    await fs.writeFile(path.join(src, 'audiolist'), content);
    await fs.writeFile(path.join(dest, 'audiolist'), content);

}
