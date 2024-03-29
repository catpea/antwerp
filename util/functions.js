import { convert } from 'html-to-text';
import cheerio from 'cheerio';
import moment from 'moment';
import numeral from 'numeral';
import classes from 'classnames';

export default {iff, classes, plaintext, hostname, timestamp, numeral};

export function iff(data, payload){
  const result = data.value();
  if(result) payload(result);
}
// export function plaintext(html){
//   return convert(html, {
//     wordwrap: false,
//     selectors: [
//       { selector: 'hr', format: 'skip' },
//       // { selector: 'a',  format: 'skip'},
//       { selector: 'img', format: 'skip' },
//       { selector: 'h1', format: 'skip' },
//       { selector: 'h2', format: 'skip' },
//       { selector: 'h3', format: 'skip' },
//       { selector: 'h4', format: 'skip' },
//       { selector: 'h5', format: 'skip' },
//       { selector: 'h6', format: 'skip' },
//     ],
//   })
// }

export function plaintext(html){
  let response = "";

  if(html){
    const $ = cheerio.load(html);
    response = $.text();
  }

  return response;
}

export function hostname(url){

  if(url.startsWith('/')){
    return 'local';
  }else{
    try{
    const myURL = new URL(url);
    return myURL.hostname;
    }catch{
      return 'n/a'
    }
  }
}

export function timestamp(date) {
  return moment(date).format('dddd • MMMM Do YYYY • h:mm:ss a')
}
