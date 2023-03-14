import fs from 'fs-extra';
import path from 'path';

import hljs from 'highlight.js';
import Markdown from 'markdown-it';

import log from '../util/log.js';
import template from '../util/template.js';

import lodash from 'lodash';
const {range, chunk, chain, partition, indexOf, takeRight, take, reverse} = lodash;

export default async function toc({db, configuration:{pp, dest, theme, snippets}, site}){
  const filename = 'snippets.html';
  const content = await fs.readFile(snippets, 'utf8');
  const md = Markdown({
    highlight: (str, lang) => {

      const code = lang && hljs.getLanguage(lang)
        ? hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          }).value
        : md.utils.escapeHtml(str);
      return `<pre class="hljs p-3 shadow rounded" style="margin-bottom: 5rem;"><code>${code}</code></pre>`;
    },
  });
  const code = md.render(content);

  const data = Object.assign({code}, {filename},{posts:db}, site);
  const html = await template({ theme, file: path.join('snippets','index.ejs'), data, });
  await fs.writeFile(path.join(dest, filename), html)
}


/*
Add more snippets
  https://gist.github.com/fantasyui-com?page=2
  https://gist.github.com/catpea
*/
