- audiobook generator
- portfolio image generator
- cache
  - ADD EXPIRED LOGIC TO REBUILD WHEN TIMESTAMPS CHANGE, and not just when files are missing
  - FIXBUG (BUG: NOT RELIABLE) /home/meow/Universe/Development/antwerp/lib/files.js
- publish.sh to put push and etc
- AFTER TAKE-OVER: fix /home/meow/Universe/Development/eternia/src/transformers/process-yaml/to-markdown.js youytube template was broken on purpose

## Then
- IPFS UPLOAD
- upload the whole website to INTERNET ARCHIVE as a zip?


























## example of an expired function that compares a number of images against source
const destinationFile = path.join(filesDirectory, record.image);
const sourceFiles = (await ydbImages(database)).filter(i=>i.endsWith('.jpg')).map(i=>path.join(filesDirectory,i));
// const sourceFiles = (await ydbImages(database)).map(i=>path.join(filesDirectory,i));
if(sourceFiles.length === 0) return;
const latestFile = sourceFiles.map(file=>({file, date: new Date(statSync(file).mtime)})).sort((a, b) => b.date - a.date).shift().file;
if(await expired(destinationFile, [latestFile, yamlContentFile])){
