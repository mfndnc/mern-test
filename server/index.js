require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const movieRouter = require('./routes/movie-router');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', movieRouter);

if (process.env.ENVLOCAL && process.env.ENVLOCAL === 'local') {
  console.log('local app');
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
} else {
  console.log('build app');
  const path = require('path');
  app.use(express.static(path.join(__dirname, '..', '/client/build')));
  app.use((req, res) => {
    // If no routes match, send them the React HTML.
    res.sendFile(__dirname + '../build/index.html');
  });
}
if (process.env.NODE_ENV === 'production') {
  console.log('production');
} else {
  console.log('NOT production');
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
