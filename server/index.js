const http = require('http');
const url  = require('url');
const path = require('path');
const fs   = require('fs');
const qs = require('querystring');
http.createServer(function (req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  });

  let { query } = url.parse(req.url);
  let dir = qs.parse(query).path;
  let basename = path.basename(dir);
  let ret = {
    sourceDir: dir,
    dirs: [],
    files:[]
  };

  try {
    let files = fs.readdirSync(dir);
    
    files.forEach(f => {
      let file = path.resolve(dir, f);
      let stat = fs.statSync(file);
      
      if (stat.isDirectory()) {
        ret.dirs.push(f);
      } else if (stat.isFile()) {
        ret.files.push(f);
      }
    });
  } catch (e) {}
  

  res.end(JSON.stringify({
    errno: 0,
    errmsg: '',
    data: ret
  }));
}).listen(1234);
