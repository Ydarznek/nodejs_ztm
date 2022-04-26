const express = require('express');
const morgan = require('morgan');

const cors = require('cors');

const planetsRouter = require('./routes/planets/planets.router');

const app = express();

app.use(cors({
  origin: 'http://locslhost:3000',
}));
app.use(morgan('short'));
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
