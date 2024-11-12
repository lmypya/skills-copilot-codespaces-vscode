//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const qs = require('querystring');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  if (req.method === 'GET') {
    if (pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream(path.resolve(__dirname, 'index.html')).pipe(res);
    } else if (pathname === '/comments') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(comments));
    } else {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not found');
    }
  } else if (req.method === 'POST') {
    if (pathname === '/comments') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const comment = qs.parse(body);
        comments.push(comment);
        fs.writeFile(
          path.resolve(__dirname, 'comments.json'),
          JSON.stringify(comments),
          err => {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify(comment));
          }
        );
      });
    } else {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('Not found');
    }
  } else {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(3000, () => console.log('Server is running on http://localhost:3000'));