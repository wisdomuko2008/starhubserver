const express = require('express');
const Parser = require('rss-parser'); // npm install rss-parser
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors()); // allow browser fetch

// Home route just to check server
app.get('/', (req, res) => {
  res.send('StarHub Server is running!');
});

// JAMB updates route
app.get('/jamb-updates', async (req, res) => {
  try {
    const feed = await parser.parseURL('https://schoolnewsng.com/rss'); // SchoolNewsNG RSS
    const updates = feed.items.slice(0,5).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate
    }));
    res.json(updates); // MUST be array
  } catch (err) {
    console.error(err);
    res.status(500).json([]); // empty array on error
  }
});

// Listen on Render port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
