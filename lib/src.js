import fs from 'fs-extra';
import path from 'path';

export default async function main(){
  this.db.splice(0, ...(await readAll(await readOne(this.configuration.src))) );

  // let xxx = await readAll(await readOne(this.configuration.src))
  // this.db.push(xxx[29]);
  // console.log(this.db);
}

async function readOne(...target){
   return (await fs.readdir(path.join(...target), { withFileTypes: true }))
     .filter(dirent => dirent.isDirectory())
     .filter(dirent => !dirent.name.startsWith('_'))
     .map(({name}) => path.join(...target, name))
 }

async function readAll(categories){
  const response = [];
  for(const category of categories) response.push(...await readOne(category))
  return response;
}
