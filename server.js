const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Uncomment this out once you've made your first route.
app.use(express.static(path.join(__dirname, 'client', 'build')));

// some helper functions you can use
async function readFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}
async function writeFile(filePath) {
  return await fs.writeFile(filePath, 'utf-8');
}
async function readDir(dirPath) {
  return await fs.readDir(dirPath);
}

// some more helper functions
const DATA_DIR = 'data';
const TAG_RE = /#\w+/g;
function slugToPath(slug) {
  const filename = `${slug}.md`;
  return path.join(DATA_DIR, filename);
}
function jsonOK(res, data) {
  res.json({ status: 'ok', ...data });
}
function jsonError(res, message) {
  res.json({ status: 'error', message });
}

app.get('/api/page/:slug', (req, res) => {
  let slug = req.params('slug');
  let filePath = slugToPath(slug);
  let body = readFile(filePath);
  res.json({status: 'ok', body: `${body}`});
});

app.get('/', (req, res) => {
  res.json({ wow: 'Hello Masha!' });
});


// If you want to see the wiki client, run npm install && npm build in the client folder,
// then comment the line above and uncomment out the lines below and comment the line above.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
// });

// GET: '/api/page/:slug'
// success response: {status: 'ok', body: '<file contents>'}
// failure response: {status: 'error', message: 'Page does not exist.'}

// POST: '/api/page/:slug'
// body: {body: '<file text content>'}
// success response: {status: 'ok'}
// failure response: {status: 'error', message: 'Could not write page.'}

// GET: '/api/pages/all'
// success response: {status:'ok', pages: ['fileName', 'otherFileName']}
//  file names do not have .md, just the name!
// failure response: no failure response

// GET: '/api/tags/all'
// success response: {status:'ok', tags: ['tagName', 'otherTagName']}
//  tags are any word in all documents with a # in front of it
// failure response: no failure response

// GET: '/api/tags/:tag'
// success response: {status:'ok', tag: 'tagName', pages: ['tagName', 'otherTagName']}
//  file names do not have .md, just the name!
// failure response: no failure response

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));
