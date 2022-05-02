const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://darznek:OvJlXW3HTTcL44NB@clustertest.xkllh.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection is ready');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };