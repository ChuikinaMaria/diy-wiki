const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Uncomment this out once you've made your first route.
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('/api/page/:slug', async (req, res) => {
  const filePath = path.join('data', `${req.params.slug}.md`);
  try {
    let text = await fs.readFile(filePath, 'utf-8');
    res.json({ status: 'ok', body: text });
  } catch {
    res.json({ status: 'error', message: 'Page does not exist.' });
  }
});

app.post('/api/page/:slug', async (req, res) => {
  const filePath = path.join('data', `${req.params.slug}.md`);
  try {
    let text = req.body.body;
    await fs.writeFile(filePath, text);
    res.json({ status: 'ok' });
  } catch {
    res.json({ status: 'error', message: 'Could not write page.' });
  }
});

app.get('/api/pages/all', async (req, res) => {
  let dir = await fs.readdir('data');
  dir = dir.map(e => {
    let arr = e.split('.');
    return arr[0];
  });
  res.json({ status: 'ok', pages: dir });
});

app.get('/', (req, res) => {
  res.json({ wow: 'hello' });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));
