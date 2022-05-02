const express = require('express');
const morgan = require('morgan');

const cors = require('cors');

const api = require('./routes/api');

const app = express();

app.use(cors({
  origin: 'http://locslhost:3000',
}));
app.use(morgan('short'));

app.use(express.json());

app.use('/v1', api);

module.exports = app;
