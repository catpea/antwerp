import log from '../util/log.js';
import path from 'path';
export default async function object({db}){
  convertToDataObject(db);
}

function convertToDataObject(db){
  for (let index = 0, recordCount = db.length; index < recordCount; index++) {
    const src = db[index];
    const database = path.basename(path.dirname(src))

    db[index] = {
      src,
      database,

      file:{},
      attr:{features:{}},
      html:"",
      order:{},
      attachments:[],
    }
  }


}
