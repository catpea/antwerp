# antwerp
Antwerp The Static Archive Site Generator

## Usage

- ```antwerp register catpea /home/usr/my-project/``` to register the project.
- ```antwerp new catpea westland-warrior --title "The Great Being"``` to create a new post.
- ```antwerp build catpea``` to (re)generate the website

## Images

Only main Post/Article Image is resized to sm, md, lg.
images other than cover are not resized.

The original post image is copied to the website without any prefix,
and without resizing, it is intended to be used as the zoom image.

## Front Matter

```yaml

id: furkies-purrkies-poetry-0931
guid: 10ad7005-85ca-4141-8490-69b54d440550
title: What The Doodle Is A Tutorial Anyway?
description: null
tags:
  - furkies-purrkies
date: '2022-09-18T02:34:49.821Z'
lastmod: null
weight: 93100
audio: poetry-0931.mp3
image: poetry-0931-illustration.jpg
images: null
artwork:
  - https://unsplash.com/photos/o15lOC7SJKs
resources: null
features: {}
draft: false

```

## Processed Record

```JSON

{
  "src": "/home/meow/Universe/Development/db/dist/new-database/furkies-purrkies/poem-0934",
  "file": {
    "index": {
      "name": "index.md",
      "src": "/home/meow/Universe/Development/db/dist/new-database/furkies-purrkies/poem-0934/index.md",
      "size": 2424,
      "atime": "2022-09-21T19:01:55.325Z",
      "mtime": "2022-09-21T19:01:55.345Z",
      "ctime": "2022-09-21T19:01:55.345Z",
      "dest": {
        "target": "/home/meow/Universe/Development/db/dist/new-website/permalink/3a6f4d53-50a6-4f33-8579-872ac5b026ac/index.html",
        "missing": true,
        "expired": false,
        "update": true
      }
    },
    "files": {
      "name": "files",
      "src": "/home/meow/Universe/Development/db/dist/new-database/furkies-purrkies/poem-0934/files",
      "directory": true,
      "size": 4096,
      "atime": "2022-09-21T19:01:55.348Z",
      "mtime": "2022-09-21T19:01:55.500Z",
      "ctime": "2022-09-21T19:01:55.500Z",
      "dest": {
        "target": "/home/meow/Universe/Development/db/dist/new-website/permalink/3a6f4d53-50a6-4f33-8579-872ac5b026ac/files",
        "missing": true,
        "expired": false,
        "update": true
      }
    }
  },
  "attr": {
    "features": {},
    "id": "furkies-purrkies-poetry-0934",
    "guid": "3a6f4d53-50a6-4f33-8579-872ac5b026ac",
    "title": "Easy Peasy Muscle; Or, How To Get Your Beefcupcake On",
    "description": null,
    "tags": [
      "furkies-purrkies"
    ],
    "date": "2022-09-21T03:18:07.713Z",
    "lastmod": null,
    "weight": 93400,
    "audio": "poetry-0934.mp3",
    "image": "poetry-0934-illustration.jpg",
    "images": [],
    "artwork": [
      "https://catpea.com"
    ],
    "resources": null,
    "draft": false,
    "links": [
      {
        "title": "dancing",
        "url": "https://www.youtube.com/results?search_query=tutorial+shuffle+dancing+cutting+shapes",
        "presentation": false
      },
      {
        "title": "hiking",
        "url": "https://www.youtube.com/watch?v=hPSvdKTEZug",
        "presentation": false
      }
    ]
  },
  "html": "<p>Exercise ... road.</p>\n",
  "order": {
    "first": true,
    "last": false,
    "prev": "79689bfd-9365-4b7a-a814-957222fdfaa3",
    "next": "36cac2c7-3bf4-4fb3-8fe0-24a8dba48c88"
  },
  "md": "Exercise... eyes.",
  "text": "Exercise... eyes.",
  "snip": "Exercise... eyes."
  "number": 1112,
}

```

## packages.json

Note the use of: ```antwerp read catpea configuration.theme```

```JSON

{
   "scripts": {
    "watch": "nodemon --watch $(antwerp read catpea configuration.theme) -e ejs,css,js --watch . -e js,json antwerp build catpea",
    "server": "http-server -o -c-1 $(antwerp read catpea configuration.dest)"
  }

}


```
