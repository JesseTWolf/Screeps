const maxNumHarvesters = 2;
const maxNumUpgraders = 2;
const maxNumBuilders = 2;
const maxNumMiners = 2;
const maxNumBoxKickers = 2;
const maxNumDefenders = 2;
const maxScoutHarvesters = 8;
const maxKamikazes = 1;
const maxLinkers = 1;
const maxLegless = 1;

const numHarvestersPerRoom = 2;

const controlledRooms = ["W5N8"];
const linkIDs = ["63cd864a7511580039a79be6", "63cd83b04bf53000383a7111"];
const miningRooms = ["W4N8", "W5N9", "W6N8", "W5N7"];
const delphesRooms = ["W3N7"];
const skirmishRoom = ["W4N9"];

// Creep sizing
let baby = [WORK, CARRY, MOVE, MOVE];
// Uses up 500 energy
let level2 = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
// Uses up 750 energy
let level3 = [
  WORK,
  WORK,
  WORK,
  CARRY,
  CARRY,
  CARRY,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
];
// Uses up 1250 energy
let monster = [
  WORK,
  WORK,
  WORK,
  WORK,
  WORK,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
];

// Uses up 800
let legless = [
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
  CARRY,
];

// Uses up 450
let superSimpleAttacker = [
  TOUGH,
  TOUGH,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  RANGED_ATTACK,
  ATTACK,
];

// Uses up 760 energy
let simpleAttacker = [
  TOUGH,
  TOUGH,
  TOUGH,
  TOUGH,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  MOVE,
  ATTACK,
  ATTACK,
  ATTACK,
  ATTACK,
];

// Real basic miner uses up 300
let realBasicMiner = [WORK, WORK, MOVE];
// Basic miner uses up 600
let basicMiner = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE];

// Pass in a room object and print using that rooms visuals.
function printTheThings(room) {
  room.visual.rect(43, -0.5, 10, 10, {
    fill: "#000000",
    opacity: "1",
  });

  // Print out the total amount of energy available within spawn and all extensions.
  const energyAvailable = room.energyAvailable;
  room.visual.text("Total Energy: " + energyAvailable, 46.2, 9, {
    color: "green",
    font: 0.8,
  });

  const creepsInRoom = _.filter(
    Game.creeps,
    (creep) => creep.room.name == room.name
  );
  room.visual.text("Total Creeps: " + creepsInRoom.length, 46, 0.5, {
    color: "green",
    font: 0.8,
  });

  const harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  room.visual.text("Harvesters:   " + harvesters.length, 46, 2, {
    color: "green",
    font: 0.8,
  });

  const upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  room.visual.text("Upgraders:   " + upgraders.length, 46, 3, {
    color: "green",
    font: 0.8,
  });

  const builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  room.visual.text("Builders:       " + builders.length, 46, 4, {
    color: "green",
    font: 0.8,
  });

  const boxKickers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "boxKicker"
  );
  room.visual.text("BoxKickers:  " + boxKickers.length, 46, 5, {
    color: "green",
    font: 0.8,
  });

  const miners = _.filter(Game.creeps, (creep) => creep.memory.role == "miner");
  room.visual.text("Miners:  " + miners.length, 46, 6, {
    color: "green",
    font: 0.8,
  });

  const scoutHarvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "scoutHarvester"
  );
  room.visual.text("Travelers:  " + scoutHarvesters.length, 46, 7, {
    color: "green",
    font: 0.8,
  });
}

function spawnLogic(room, role, workRoomName) {
  const energyAvailable = room.energyAvailable;

  const newName =
    role + Game.time + (workRoomName == undefined ? room.name : workRoomName);

  let body;
  if (energyAvailable >= 300) {
    body = baby;
  } else if (energyAvailable >= 500) {
    body = level2;
  } else if (energyAvailable >= 750) {
    body = level3;
  } else if (energyAvailable >= 1250) {
    body = monster;
  }

  if (role == "kamikaze") {
    if (energyAvailable >= 450) {
      body = superSimpleAttacker;
    }
    // else if (energyAvailable >= 765) {
    //   body = simpleAttacker;
    // } else {
    //   return;
    // }
  } else if (role == "miner") {
    if (energyAvailable >= 600) {
      body = basicMiner;
    } else {
      body = realBasicMiner;
    }
  } else if (role == "legless") {
    if (energyAvailable >= 800) {
      body = legless;
    } else body = [CARRY, CARRY, CARRY, CARRY];
  }

  if (role == "scoutHarvester") {
    Game.spawns[room.name].spawnCreep(body, newName, {
      memory: {
        role: role,
        working: true,
        workRoom: workRoomName,
        homeRoom: room.name,
      },
      directions: [BOTTOM_LEFT],
    });
  } else if (role == "kamikaze") {
    Game.spawns[room.name].spawnCreep(body, newName, {
      memory: {
        role: role,
        working: true,
        workRoom: workRoomName,
        homeRoom: room.name,
      },
      directions: [BOTTOM_LEFT],
    });
  } else if (role == "legless") {
    Game.spawns[room.name].spawnCreep(body, newName, {
      memory: {
        role: role,
        working: true,
      },
      directions: [BOTTOM_RIGHT],
    });
  } else {
    Game.spawns[room.name].spawnCreep(body, newName, {
      memory: { role: role, working: true },
      directions: [BOTTOM_LEFT],
    });
  }
}

function roomLoop(room) {
  // Print out the total amount of energy available within spawn and all extensions.
  const energyAvailable = room.energyAvailable;
  room.visual.text("Total Energy: " + energyAvailable, 46.2, 9, {
    color: "green",
    font: 0.8,
  });

  const creepsInRoom = _.filter(
    Game.creeps,
    (creep) => creep.room.name == room.name
  );

  const totalNumberCreeps = creepsInRoom.length;

  const harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester" && creep.room.name == room.name
  );

  const upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader" && creep.room.name == room.name
  );

  const builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder" && creep.room.name == room.name
  );

  const miners = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "miner" && creep.room.name == room.name
  );

  const boxKickers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "boxKicker" && creep.room.name == room.name
  );

  const scoutHarvesters = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "scoutHarvester" &&
      creep.memory.homeRoom == room.name
  );

  const scoutHarvestersRoom0 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "scoutHarvester" &&
      creep.memory.workRoom == miningRooms[0]
  );

  const scoutHarvestersRoom1 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "scoutHarvester" &&
      creep.memory.workRoom == miningRooms[1]
  );

  const scoutHarvestersRoom2 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "scoutHarvester" &&
      creep.memory.workRoom == miningRooms[2]
  );

  const scoutHarvestersRoom3 = _.filter(
    Game.creeps,
    (creep) =>
      creep.memory.role == "scoutHarvester" &&
      creep.memory.workRoom == miningRooms[3]
  );

  const kamikazes = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "kamikaze"
  );

  const linkers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "linker" && creep.room.name == room.name
  );

  const legless = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "legless" && creep.room.name == room.name
  );

  const towers = Game.spawns[room.name].room.find(FIND_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER },
  });

  const linkFrom = Game.getObjectById(linkIDs[0]);

  const linkTo = Game.getObjectById(linkIDs[1]);

  if (linkFrom.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
    linkFrom.transferEnergy(linkTo);
  }

  // For each room in the list of controlled rooms do...
  towers.forEach(function (tower) {
    if (tower) {
      // const closestDamagedStructure = tower.pos.findClosestByRange(
      //   FIND_STRUCTURES,
      //   {
      //     filter: (structure) =>
      //       structure.hits < structure.hitsMax &&
      //       structure.structureType != STRUCTURE_WALL,
      //   }
      // );
      // if (closestDamagedStructure) {
      //   tower.repair(closestDamagedStructure);
      // }

      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }
  });

  // If we get wiped make 2 harvesters first
  if (totalNumberCreeps < 2) {
    spawnLogic(room, "harvester");
  } else if (miners.length < maxNumMiners && boxKickers != 0) {
    spawnLogic(room, "miner");
  } else if (boxKickers.length < maxNumBoxKickers) {
    spawnLogic(room, "boxKicker");
  } else if (upgraders.length < maxNumUpgraders) {
    spawnLogic(room, "upgrader");
  } else if (builders.length < maxNumBuilders) {
    spawnLogic(room, "builder");
  } else if (linkers.length < maxLinkers) {
    spawnLogic(room, "linker");
  } else if (legless.length < maxLegless) {
    spawnLogic(room, "legless");
  } else if (
    scoutHarvesters.length < maxScoutHarvesters &&
    energyAvailable > 800
  ) {
    // If number of scout harvesters in room 0 are less than 5 make more for that room.
    if (scoutHarvestersRoom0.length < numHarvestersPerRoom) {
      spawnLogic(room, "scoutHarvester", miningRooms[0]);
    } else if (scoutHarvestersRoom1.length < numHarvestersPerRoom) {
      spawnLogic(room, "scoutHarvester", miningRooms[1]);
    } else if (scoutHarvestersRoom2.length < numHarvestersPerRoom) {
      spawnLogic(room, "scoutHarvester", miningRooms[2]);
    } else if (scoutHarvestersRoom3.length < numHarvestersPerRoom) {
      spawnLogic(room, "scoutHarvester", miningRooms[3]);
    }
  } else if (kamikazes.length < maxKamikazes && energyAvailable >= 760) {
    spawnLogic(room, "kamikaze", skirmishRoom[0]);
  }

  if (Game.spawns[room.name].spawning) {
    const spawningCreep = Game.creeps[Game.spawns[room.name].spawning.name];
    Game.spawns[room.name].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns[room.name].pos.x + 1,
      Game.spawns[room.name].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
}

module.exports.loop = function () {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      // console.log("Clearing non-existing creep memory:", name);
    }
  }

  // For each room in the list of controlled rooms do...
  controlledRooms.forEach(function (name) {
    printTheThings(Game.rooms[name]);
    roomLoop(Game.rooms[name]);
  });

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == "miner") {
      roleMiner.run(creep);
    }
    if (creep.memory.role == "boxKicker") {
      roleBoxKicker.run(creep);
    }
    if (creep.memory.role == "scoutHarvester") {
      roleScoutHarvester.run(creep);
    }
    if (creep.memory.role == "kamikaze") {
      roleKamikaze.run(creep);
    }
    if (creep.memory.role == "linker") {
      roleLinker.run(creep);
    }
    if (creep.memory.role == "legless") {
      roleLegless.run(creep);
    }
  }
};
