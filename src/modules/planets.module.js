const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const file = 'kepler_data.csv';
const planets = [];

function isHabitablePlanet(planet) {
  return planet.koi_disposition === 'CONFIRMED'
    && planet.koi_insol > 0.36
    && planet.koi_insol < 1.11
    && planet.koi_prad < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', file))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          planets.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        console.log(planets.map((planet) => planet.kepler_name));
        console.log('done');
        resolve();
      });
  });
}

module.exports = {
  loadPlanetsData,
  planets,
};
