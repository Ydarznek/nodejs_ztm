const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches() {
  const launchesList = await launches.find({}, {
    _id: 0,
    __v: 0,
  });
  return launchesList;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    planetName: launch.destination,
  });

  if (!planet) {
    throw new Error('No matching planets');
  }

  await launches.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function existsLaunchWithId(launchId) {
  const currentLaunch = await launches.findOne({ flightNumber: launchId });
  return currentLaunch;
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customer: ['NASA', 'TEST'],
    upcoming: true,
    success: true,
  };

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  await launches.updateOne({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });
}

module.exports = {
  getAllLaunches,
  saveLaunch,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
