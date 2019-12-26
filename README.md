- Takes 'slug' from user's input, makes a path to access the file with the same name 
in directory 'data' which is situated in the same directory as server.js, adds .md extension.
- Asynchronously tries to read file using 'utf-8', if succeeds - sends text as a body of json responce,
otherwise it means there is no page with this slug as a name, so returns error 'Page does not exist.'

```
app.get('/api/page/:slug', async (req, res) => {
  const filePath = path.join('data', `${req.params.slug}.md`);
  try {
    let text = await fs.readFile(filePath, 'utf-8');
    res.json({ status: 'ok', body: text });
  } catch {
    res.json({ status: 'error', message: 'Page does not exist.' });
  }
});
```

// Requests user's input (req.body.body), writes it in a file with the slug name,
// creates if it doesn't exist. Page sends again, because client side initiate previous
// function for the file that was editid or created

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

// reads all names of the files in 'data' directory, removes '.md', sends list as a responce

app.get('/api/pages/all', async (req, res) => {
  let dir = await fs.readdir('data');
  dir = dir.map(e => {
    let arr = e.split('.');
    return arr[0];
  });
  res.json({ status: 'ok', pages: dir });
});

// reads all names of the files in 'data', makes full path to each of them,
// reads content of each file, makes one string of all the content,
// makes an array of all matches with regular expression /#\w+/g,
// that is format of tags.
// client side adds '#' to tags, so it removes it from original tag, not to double it.

app.get('/api/tags/all', async (req, res) => {
  let dir = await fs.readdir('data');
  dir = dir.map(e => {
    let filePath = path.join('data', e);
    return filePath;
  });
  let str = '';
  for (let i = 0; i < dir.length; i++) {
    let text = await fs.readFile(dir[i], 'utf-8');
    str = str.concat(text);
  }
  let tags = str.match(/#\w+/g);
  tags = tags.map(e => e.slice(1));
  for (let i = 0; i < tags.length; i++) {
    let idx = tags.indexOf(tags[i], i + 1);
    if (idx !== -1) {
      tags.splice(idx, 1);
    }
  }
  res.json({ status: 'ok', tags });
});

// takes :tag from req.params.tag
// reads every file in 'data', 
// if file includes tag in it's content,
// removes dir and '.md' from pathfile to get page's name
// adds page's name to array of required pages.

app.get('/api/tags/:tag', async (req, res) => {
  let tag = req.params.tag;
  let dir = await fs.readdir('data');
  dir = dir.map(e => {
    let filePath = path.join('data', e);
    return filePath;
  });
  let pages = [];
  for (let i = 0; i < dir.length; i++) {
    let text = await fs.readFile(dir[i], 'utf-8');
    if (text.includes(tag)) {
      let page = path.basename(dir[i], '.md');
      pages.push(page);
    }
  }
  res.json({ status: 'ok', tag: 'tagName', pages});
});

app.get('/', (req, res) => {
  res.json({ wow: 'hello' });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Wiki app is serving at http://localhost:${port}`));

