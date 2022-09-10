#!/usr/bin/env -S node

/**

TODO:
- pager

- image tiles
- table of contents and  list of all links

**/


import path from 'path';


import invariant from 'invariant';
import sharp from 'sharp';
import fsExtra from 'fs-extra';
const {ensureDir, readJson, writeJson, readFile, writeFile, copy, pathExists, readdir} = fsExtra;
import { convert } from 'html-to-text';
import url from 'node:url';
import ejs from 'ejs';
ejs.delimiter = '?';
ejs.openDelimiter = '<';
ejs.closeDelimiter = '>';
import paginationNpm from 'pagination'; // https://www.npmjs.com/package/pagination#current-integer
import {globbyStream} from 'globby';
import { v4 as uuidv4 } from 'uuid';


import yaml from 'js-yaml';
import frontMatter from 'front-matter';
import { marked } from 'marked';
import moment from 'moment';

import lodash from 'lodash-es';
const { chain, startCase, padStart, uniq, omit, chunk, sortBy, last, head, find, set,get, cloneDeep }  = lodash;


lodash.mixin({ 'plaintext':  plaintext});



class Utils {
  async dir(...target){
       return (await readdir(path.join(...target), { withFileTypes: true }))
       .filter(dirent => dirent.isDirectory())
       .filter(dirent => !dirent.name.startsWith('_'))
       .map(dirent => dirent.name)
  }
  async read(...target){
        const buffer = await readFile(path.join(...target));
        return buffer.toString();
  }
  async write(content, ...target){
    const location = path.join(...target);
    await ensureDir(path.dirname(location))
    await writeFile(location, content)
  }
}

class Sugar extends Utils {
  constructor(){
    super();
  }

  linkCollection(collection, ...path){
    let counter = 0;
    for (const post of collection){
      set(post, path, {});
      const reference = get(post,path);
      reference.first = counter==0;
      reference.last = counter+1==collection.length;
      let next = reference.first?last(collection):collection[counter-1];
      let prev = reference.last?head(collection):collection[counter+1];
      reference.prev = prev.guid;
      reference.next = next.guid;
      counter++;
    }
  }

  computeTags(db){
    const tags = {};
      for( const post of db){
        for( const tag of post.tags){
          if(!tags[tag]) tags[tag] = [];
          tags[tag].push(post.guid);
        }
      }
      return tags;
  }

  async getPosts(){
    let response = [];
    const categories = await this.dir(this.src);

    for (const category of categories){
      const posts = await this.dir(this.src, category);
      for (const post of posts){
        const buffer = await readFile(path.join(this.src, category, post, 'index.md'))
        const {attributes:data, body:content} = frontMatter(buffer.toString());
        if(!data.guid) throw new Error(`ERROR: ${this.src}/${category}/${post} is missing a guid`);
        response.push({...data, content:marked(content), category, directory:post, file:'',});
      }
    }

    response = sortBy(response, 'date').reverse();

    this.linkCollection(response, 'movement', 'index', 'ascending', 'date');

    return response
  }

}

class Eternia extends Sugar {
  // Internal
  static version = "0.0.9";
  includer = (originalPath, parsedPath)=>({filename: path.join( path.resolve(this.layouts), originalPath)})

  // Configuration
  layouts = 'layouts';
  src = 'src'
  dest = 'dist';

  perPage = 24;

  //Runtime
  db = [];
  data = {};

  constructor(layouts, src, dest){
    super();
    this.layouts = layouts;
    this.src = src;
    this.dest = dest;
  }

  getDb(){
    return cloneDeep(this.master);
  }
  getDbSize(){
    return this.master.length;
  }

  async initialize(){
    this.master = await this.getPosts();
    this.tags = this.computeTags(this.getDb());
    const posts = chain(this.getDb());
    this.data = {
      website: {
        name: 'Cat Pea',
        title: 'The Cat Pea Community College',
      },
      alerts: [
        {type: 'warning',    html:`Testing new website, there maybe bugs.`},
        // {type: 'danger',  html:`TODO: list posts`},
        // {type: 'success', text:`New Backup Server Launched`, link:{title:`catpea.org`, url:'https://catpea.com'}, note:`The catpea.com server is smol, it can't handle all the mp3 files.`},
        // {type: 'success', text:`92 Hour (4GB mp3) Version Uploaded To The Internet Archive`, link:{title:`Download the 4GB mp3 at Archive.org`, url:'https://archive.org/details/912-poems'}, note:'Every once in a while I smush all the files and upload them to the Internet Archive as a kind of an Audio Book'},
      ],
      tags: this.tags,
      network: chain([

        {
          title: 'Home',
          url: '/',
          navigation: true,
        },
        {
          title: 'Tiles',
          url: '/tiles',
          //navigation: true,
        },
        {
          title: 'Backup Server at catpea.org',
          url: 'https://catpea.org',
          superImportant: true,
          mirror: true,
        },
        {
          title: 'Cat Pea Audio Book (4GB/92hrs)',
          url: 'https://archive.org/details/912-poems',
          veryImportant: true,
          mirror: true,
        },
        {
          title: "Vercel Mirror",
          url: "https://catpea.vercel.app/",
          mirror: true,
        },
        {
          title: "Render Archive Mirror",
          url: "https://catpea.onrender.com/",
          mirror: true,
        },
        {
          title: "Cloudflare Archive Mirror",
          url: "https://catpea.pages.dev/",
          mirror: true,
        },
        {
          title: "Poetry At YouTube",
          url: "https://www.youtube.com/playlist?list=PLOo-pqnffyOqsK6hf5tFwMqzvhogksrgW",
          mirror: true,
        },
        {
          title: "Bitbucket Mirror",
          url: "https://catpea.bitbucket.io/",
          mirror: true,
        },
        {
          title: "Github Source Code",
          url: "https://github.com/catpea/furkies-purrkies",
          mirror: true,
        },
        {
          title: "Furkies Purkies Bugs",
          url: "https://github.com/catpea/furkies-purrkies/issues",
          mirror: true,
        },

        {
          title: "Westland Warrior Source Code",
          url: "https://github.com/catpea/westland-warrior",
        },
        {
          title: "Westland Warrior Snapshot",
          url: "https://westland-valhalla.github.io/warrior/",
          mirror: true,
        },
        {
          title: "Westland Warrior Bugs",
          url: "https://github.com/catpea/westland-warrior/issues",
        },

        {
          title: 'portfolio.jpg',
          url: '/portfolio.jpg',
          //mirror: true,
          //navigation: true,
        },
        {
          title: 'Hacker News',
          url: 'https://news.ycombinator.com/user?id=catpea',
          social: true,
        },
        {
          title: 'YouTube',
          url: 'https://www.youtube.com/channel/UC6Og8hy_iEgZutvp0SQmNzQ',
          social: true,
        },
        {
          title: 'Cat Pea Reddit',
          url: 'https://www.reddit.com/user/catpea-com/',
          social: true,
        },
        {
          title: 'Internet Archive',
          url: 'https://archive.org/details/@catpea-com',
          social: true,
        },
        {
          title: 'Wayback Machine',
          url: 'https://web.archive.org/web/*/catpea.com',
          social: true,
        },
        {
          title: 'Dribbble',
          url: 'https://dribbble.com/catpea',
          social: true,
        },
        {
          title: 'GitLab',
          url: 'https://gitlab.com/catpea',
          social: true,
        },
        {
          title: 'NPM',
          url: 'https://www.npmjs.com/~catpea',
          social: true,
        },
        {
          title: 'GitHub',
          url: 'https://github.com/catpea',
          social: true,
        },
      ]),
      linkedPath: ['movement', 'index', 'ascending', 'date'],
      perPage: this.perPage,
      posts,
      chain,
      get,
      iff,
      plaintext,
      hostname,
      timestamp: (date) => moment(date).format('dddd • MMMM Do YYYY • h:mm:ss a'),
    }
  }

  async static(){
    await copy(path.join(this.layouts, 'static'), path.join(this.dest));
  }

  async index(){
    const template = ejs.compile(await this.read(this.layouts, 'index.ejs'), { includer: this.includer });
    const chunks = chunk(this.data.posts.value(), this.perPage)
    const paginator = paginationNpm.create('template', {
      current: 1,
      rowsPerPage: this.perPage,
      totalResult: this.getDbSize(),
      prelink:'/',
      pageParamName: 'browse',
      slashSeparator: true,
      baseUrl: '/',
      pageLinks: 5, // Number of links to create in page range, default to 5. This value will be ignored when using item pagination.
      template: paginationTemplate,
    });
     const pagination = {
       page:1,
       html:paginator.render({})
     };
    const data = Object.assign({pagination},this.data,{posts:chain(chunks[0])});
    //console.log(data.network.every('mirror').value());
    const html = template(data);
    await this.write(html, this.dest, 'index.html')

  }

  async browse(){
    const template = ejs.compile(await this.read(this.layouts, 'browse', 'index.ejs'), { includer: this.includer });
    let page = 1;
    const chunks = chunk(this.data.posts.value(), this.perPage);
    //console.log(`There are ${chunks.length} chunks.`);
    for(const posts of chunks){
      const paginator = paginationNpm.create('template', {
        current: page,
        rowsPerPage: this.perPage,
        totalResult: this.getDbSize(),
        prelink:'/',
        pageParamName: 'browse',
        slashSeparator: true,
        baseUrl: '/',
        pageLinks: 5, // Number of links to create in page range, default to 5. This value will be ignored when using item pagination.
        template: paginationTemplate,
      });
       const pagination = {
         page,
         html:paginator.render({})
       };
       const data = Object.assign({pagination},this.data,{posts:chain(posts)});
       const html = template(data);
       await this.write(html, this.dest, 'browse', String(page), 'index.html');
      page++
    }
  }

  async tagging(){
    const template = ejs.compile(await this.read(this.layouts, 'browse', 'index.ejs'), { includer: this.includer });

    const defaultOrder = `index-ascending-by-date.html`;

    for(const order of ['ascending', 'descending']){
      for(const field of ['title', 'date','weight']){
        for(const tag in this.tags){

          const file = `${tag}-${order}-by-${field}.html`
          const index = `index-${order}-by-${field}.html`

          const inflated = this.tags[tag].map(guid=>find(this.getDb(),{guid}));
          const database = sortBy(inflated, field);
          if(order == 'descending') database.reverse();

          const linkedPath = [ 'movement', tag, order, field ];
          this.saveAs(file, database, {linkedPath});
          this.linkCollection(database, ...linkedPath);

          const chunks = chunk(database, this.perPage);
          console.log(`There are ${chunks.length} chunks.`);
          let page = 1;
          for(const posts of chunks){

            const paginator = paginationNpm.create('template', {
              current: page,
              rowsPerPage: this.perPage,
              totalResult: this.getDbSize(),
              prelink:'/tag',
              pageParamName: tag,
              slashSeparator: true,
              baseUrl: '/',
              pageLinks: 5, // Number of links to create in page range, default to 5. This value will be ignored when using item pagination.
              template: paginationTemplate,
            });

             const pagination = {
               page,
               html:paginator.render({})
             };

             const data = Object.assign( {pagination}, this.data, {linkedPath}, {posts:chain(posts.map(o=>Object.assign(o, {file}) )) });

             const html = template(data);

             await this.write(html, this.dest, 'tag', tag, String(page), index);
             if(page==1) await this.write(html, this.dest, 'tag', tag, index);

             let isIndex = false;
             if(defaultOrder == index) isIndex = true;

             if(isIndex) await this.write(html, this.dest, 'tag', tag, String(page), 'index.html');
             if(isIndex) if(page==1) await this.write(html, this.dest, 'tag', tag, 'index.html');

            page++
          } // for all chunks

        } // tags
      } // field
    } // order
  }

  toc(){
    // this create a more strict index
  }

  tiles(){
    // this lets the user browse by clicking on images
  }

  async saveAs(file, collection, extra){
    const template = ejs.compile(await this.read(this.layouts, 'post', 'index.ejs'), {
      //root: path.resolve(this.layouts),
      includer: this.includer
    });
    for (const original of collection){
      const post = Object.assign(cloneDeep(original), {file})
      const data = Object.assign({post}, this.data, extra);
      const html = template(data);
      await this.write(html, this.dest, 'data', post.guid, file)
      // break;
    }
  }

  async posts(){
    await this.saveAs('index.html', this.getDb());

  }

  async files(){

    for (const post of this.getDb()){

      // await this.write(html, this.dest, 'data', post.guid, 'index.html')
      // await copy(path.join(this.layouts, 'static'), path.join(this.dest));
      //old_directory
      // const source = path.join(src, 'files');
      // const target = path.join(dest, database, name, 'files');
      // this.src, category, post
      const source = path.join(this.src, post.category, post.directory, 'files');
      const target = path.join(this.dest, 'data', post.guid, 'files');
      // //console.log('Copying: ', source, target);
      if(!(await (pathExists(target))))  await copy(source, target);


    }

  }





  async resize(){
    let number = 1;
    for (const post of this.getDb()){
      const sourceImage = path.join(this.src, post.category, post.directory, 'files', post.image);
      const smallImage = path.join(this.dest, 'data', post.guid, 'files', `sm-${post.image}`);
      const largeImage = path.join(this.dest, 'data', post.guid, 'files', `lg-${post.image}`);

      const missingLargeImage = !(await pathExists(largeImage));
      const missingSmallImage = !(await pathExists(smallImage));

      if(missingLargeImage||missingSmallImage){
        const msg = [];
        if(missingLargeImage) msg.push(`lg-${post.image}`)
        if(missingSmallImage) msg.push(`sm-${post.image}`)
      }

      if(missingLargeImage){
        await sharp(sourceImage).resize(722, 722).toFile(largeImage);
      }
      if(missingSmallImage){
        await sharp(sourceImage).resize(321, 321).toFile(smallImage);
      }

      number++;
    } //loop
  } // resize





}








const layouts = `layouts`;
const src = `dist/static-port`;
const dest = `dist/new-website`;

const api = new Eternia(layouts, src, dest);

await api.initialize();
await api.static(); // render post to /guid/index.html
await api.index(); // render main index
await api.browse(); // render browse
await api.posts(); // render post to /guid/index.html
// // api.toc(); // render main index
// // api.tiles(); // render main index
await api.files(); // COPY FILES
await api.resize(); // RESIZE FILES
//

///////await api.tagging(); // THIS IS SLOW


function iff(data, payload){
  const result = data.value();
  if(result) payload(result);
}
function plaintext(html){
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'hr', format: 'skip' },
      { selector: 'a',  format: 'skip'},
      { selector: 'img', format: 'skip' },
      { selector: 'h1', format: 'skip' },
      { selector: 'h2', format: 'skip' },
      { selector: 'h3', format: 'skip' },
      { selector: 'h4', format: 'skip' },
      { selector: 'h5', format: 'skip' },
      { selector: 'h6', format: 'skip' },
    ],
  })
}
function hostname(url){

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

function paginationTemplate(result) {
		var i, len, prelink;
		var html = '<div><ul class="pagination bg-text-dark">';
		if(result.pageCount < 2) {
			html += '</ul></div>';
			return html;
		}
		prelink = this.preparePreLink(result.prelink);
		if(result.previous) {
			html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + '">' + this.options.translator('PREVIOUS') + '</a></li>';
		}
		if(result.range.length) {
			for( i = 0, len = result.range.length; i < len; i++) {
				if(result.range[i] === result.current) {
					html += '<li class="active page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
				} else {
					html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
				}
			}
		}
		if(result.next) {
			html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + '" class="paginator-next">' + this.options.translator('NEXT') + '</a></li>';
		}
		html += '</ul></div>';
		return html;
	}
