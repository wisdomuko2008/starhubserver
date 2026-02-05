// server.js
const express = require('express');
const Parser = require('rss-parser');
const cors = require('cors');

const app = express();
const parser = new Parser();

app.use(cors()); // allow browser fetch

// Simple in-memory cache
let cachedUpdates = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Home route
app.get('/', (req, res) => {
  res.send('StarHub Server is running!');
});

// JAMB updates route
app.get('/jamb-updates', async (req, res) => {
  const now = Date.now();

  // If cached and not expired, return cache
  if (cachedUpdates.length && (now - lastFetchTime < CACHE_DURATION)) {
    return res.json(cachedUpdates);
  }

  try {
    const feed = await parser.parseURL('https://schoolnewsng.com/rss', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36'
      }
    });

    // Take first 5 items
    const updates = feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate
    }));

    // Update cache
    cachedUpdates = updates;
    lastFetchTime = now;

    res.json(updates);
  } catch (err) {
    console.error('Error fetching RSS feed:', err);
    // Return cache if available, else empty array
    if (cachedUpdates.length) {
      res.json(cachedUpdates);
    } else {
      res.status(500).json([]);
    }
  }
});

// Listen on Render port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
