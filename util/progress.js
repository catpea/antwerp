import ProgressBar from 'progress';
export default function bar(line, length){
  return new ProgressBar(line, {
    complete: '=',
    incomplete: ' ',
    head:'>',
    clear: true,
    width: 55,
    total: length
  });
}
