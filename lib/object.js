export default async function main(){
  convertToDataObject(this.db);
}

function convertToDataObject(db){
  for (var i = 0; i < db.length; i++) {
    const src = db[i];
    db[i] = {src,file:{},attr:{},html:""}
  }
}
