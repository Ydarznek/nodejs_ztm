const express = require('express');
const morgan = require('morgan');

const cors = require('cors');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/launches/launches.router');

const app = express();

app.use(cors({
  origin: 'http://locslhost:3000',
}));
app.use(morgan('short'));

app.use(express.json());

app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = app;
