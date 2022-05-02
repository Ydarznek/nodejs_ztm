const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function getAllLaunches(skip, limit) {
  const launchesList = await launches
    .find({}, {
      _id: 0,
      __v: 0,
    })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return launchesList;
}

async function saveLaunch(launch) {
  await launches.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, {
    upsert: true,
  });
}

async function findLaunch(filter) {
  const launch = await launches.findOne(filter);
  return launch;
}

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  const response = await axios.post(SPACE_X_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;

  launchDocs.forEach(async (launchDoc) => {
    const {
      flight_number: flightNumber,
      name: mission,
      rocket,
      date_local: launchDate,
      upcoming,
      success,
      payloads,
    } = launchDoc;

    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber,
      mission,
      rocket: rocket.name,
      launchDate,
      upcoming,
      success,
      customers,
      destination: '',
    };

    await saveLaunch(launch);
  });
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (!firstLaunch) {
    console.log('Load data from API');
    populateLaunches();
  }
}

async function existsLaunchWithId(launchId) {
  const currentLaunch = await findLaunch({ flightNumber: launchId });
  return currentLaunch;
}

async function getLatestFlightNumber() {
  const latestLaunch = await findLaunch.sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    planetName: launch.destination,
  });

  if (!planet) {
    throw new Error('No matching planets');
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ['NASA', 'TEST'],
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
  loadLaunchData,
  existsLaunchWithId,
  scheduleNewLaunch,
  abortLaunchById,
};
