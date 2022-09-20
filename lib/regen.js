import fs from 'fs-extra';
import path from 'path';
import camelCase from 'lodash/camelCase.js';
import frontMatter from 'front-matter';
import { marked } from 'marked';

export default async function main(context){

  for (const post of posts){
    const root = path.join(configuration.dest, post.data.attributes.guid, post.data.attributes.title);
    //console.log(post.data);
  }

}

// async function setRoot(locations){
//   return await Promise.all(locations.map(root => fileLayout(root)))
// }
//
//
//
// async function readOne(...target){
//    return (await fs.readdir(path.join(...target), { withFileTypes: true }))
//      .filter(dirent => dirent.isDirectory())
//      .filter(dirent => !dirent.name.startsWith('_'))
//      .map(dirent => path.join(...target, dirent.name))
// }
//
// async function readAll(targets){
//    return (await Promise.all( targets.map(async target => await readOne(target)))).flat().filter(i=>i)
// }
//
//
//
//
// async function fileLayout(root){
//   const response = {};
//   Object.assign(response, await fileEntry(root, 'index.md'));
//   Object.assign(response, await fileEntry(root, 'files'));
//   return response;
// }
//
//
//
// async function fileEntry(root, name){
//   const file = {};
//   const key = camelCase(name)
//   file.src = path.join(root, name);
//   const {size, atime, mtime, ctime} = await fs.stat(file.src);
//   Object.assign(file, {size, atime, mtime, ctime});
//   return {[key]:file};
// }
