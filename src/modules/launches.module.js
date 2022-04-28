const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'test Mission',
  rocket: 'test Rocket',
  launchDate: new Date('October 26, 2030'),
  destination: 'Kepler-442 b',
  customer: ['NASA', 'TEST'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(newLaunch) {
  latestFlightNumber += 1;
  launches.set(latestFlightNumber, {
    ...newLaunch,
    flightNumber: latestFlightNumber,
    customer: ['NASA', 'TEST'],
    upcoming: true,
    success: true,
  });
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  return {
    ...launches.get(launchId),
    upcoming: false,
    success: false,
  };
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
