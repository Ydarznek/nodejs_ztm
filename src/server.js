const http = require('http');
const express = require('express');

const app = require('./app');
const planetsRouter = require('./routes/planets/planets.router');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

app.use(express.json());
app.use(planetsRouter);

server.listen(PORT, () => {
  console.log(`Listening for ${PORT}`);
});
