const {
  getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById,
} = require('../../modules/launches.module');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  launch.launchDate = new Date(launch.launchDate);

  addNewLaunch(launch);

  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const abortedLaunch = abortLaunchById(launchId);
  return res.status(200).json(abortedLaunch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
