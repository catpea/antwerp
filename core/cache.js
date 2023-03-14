import fs from 'fs-extra';
import path from 'path';
export default async function cache({db, configuration}){
  await fs.writeJson(path.join(configuration.cache, 'db.json'), db);
}
