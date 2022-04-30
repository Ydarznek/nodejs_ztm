const {
  getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById,
} = require('../../modules/launches.module');

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (!launch.mission || !launch.rocket || !launch.launchDate
    || !launch.destination) {
    return res.status(400).json({
      error: 'Validation',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (!launch.launchDate.valueOf()) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await addNewLaunch(launch);

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
