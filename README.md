# antwerp
Antwerp The Static Archive Site Generator


## Usage

- ```antwerp register catpea /home/usr/my-project/```
- ```antwerp new catpea westland-warrior --title "The Great Being"```
- ```antwerp build catpea```

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
