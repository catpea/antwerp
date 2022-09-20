import log from '../util/log.js';

export default async function main({db}){
  convertToDataObject(db);
}

function convertToDataObject(db){
  for (let index = 0, recordCount = db.length; index < recordCount; index++) {
    const src = db[index];
    db[index] = {src, file:{}, attr:{features:{}}, html:"", order:{}}
  }


}
