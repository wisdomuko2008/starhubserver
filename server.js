const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors()); // Allow cross-origin requests

// Endpoint to serve latest 5 JAMB news updates
app.get('/jamb-updates', async (req, res) => {
  try {
    // SchoolNewsNG RSS feed URL
    const feed = await parser.parseURL('https://schoolnewsng.com/rss');

    // Take latest 5 items and map to JSON
    const updates = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate
    }));

    res.json(updates);
  } catch (err) {
    console.error('Error fetching RSS:', err);
    res.status(500).json({ error: 'Unable to fetch updates' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));