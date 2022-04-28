const { getAllPlanets } = require('../../modules/planets.module');

function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

module.exports = { httpGetAllPlanets };
