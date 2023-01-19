const maxNumHarvesters = 2;
const maxNumUpgraders = 2;
const maxNumBuilders = 1;
const maxNumMiners = 2;
const maxNumBoxKickers = 3;
const maxNumDefenders = 2;

const controlledRooms = ["W5N8"];
const minerCampingSpots = [["14,14", "15,13"]];
const delphesRooms = ["W3N7"];

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
}

function spawnLogic(room, role) {
  const energyAvailable = room.energyAvailable;

  const newName = role + Game.time;

  let body;
  if (energyAvailable >= 300) {
    body = baby;
  }
  if (energyAvailable >= 500) {
    body = level2;
  }
  // if (energyAvailable >= 750) {
  //   body = level3;
  // }
  // if (energyAvailable >= 1250) {
  //   body = monster;
  // }
  // if (role == "miner") {
  //   body = basicMiner;
  // }

  Game.spawns[room.name].spawnCreep(body, newName, {
    memory: { role: role },
  });
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

  // TODO: Update this to search within room instead
  const tower = Game.getObjectById("63c7df8e8537bd003a0cf889");
  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    // console.log("Spawning new harvester: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: "harvester" },
    });
  } else if (upgraders.length < 2) {
    var newName = "Upgrader" + Game.time;
    // console.log("Spawning new upgrader: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: "upgrader" },
    });
  } else if (builders.length < 1) {
    var newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  // // If we get wiped make 2 harvesters first
  // if (totalNumberCreeps < 2) {
  //   spawnLogic(room, "harvester");
  // } else if (harvesters.length < maxNumHarvesters) {
  //   spawnLogic(room, "harvester");
  // }
  // // else if (minerCampingSpots.length < maxNumMiners) {
  // // spawnLogic(room, "miner");
  // // }
  // // else if (boxKickers.length < maxNumBoxKickers) {
  // //   // spawnLogic(room.name, "boxKicker");
  // // }
  // else if (upgraders.length < maxNumUpgraders) {
  //   spawnLogic(room, "upgrader");
  // } else if (builders.length < maxNumBuilders) {
  //   spawnLogic(room, "builder");
  // }

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
      console.log("Clearing non-existing creep memory:", name);
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
  }
};
