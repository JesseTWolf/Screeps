class Creep {
  constructor(ref, colony) {
    this.ref = ref;
    this.colony = colony;
  }

  pickupEnergy() {
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  }

  rechargeEnergy() {
    let freeCapacity =
      Game.spawns["W5N8"].store.getFreeCapacity(RESOURCE_ENERGY);
    if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0] == ERR_NOT_IN_RANGE)) {
        creep.moveTo(sources[0]);
      }
    } else if (freeCapacity > 0) {
      let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        },
      });

      if (targets) {
        if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          creep.moveTo(targets, { visualizePathStyle: { stroke: "ffffff" } });
      }
      console.log(freeCapacity);
    }
  }
}
var roleBoxKicker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // let currentCapacity = creep.room.energyAvailable;
    // let maxCapacity = creep.room.energyCapacity;

    if (creep.memory.working) {
      let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              (structure.structureType == STRUCTURE_TOWER &&
                structure.energy < 200)) &&
            structure.energy < structure.energyCapacity
          );
        },
      });

      if (targets) {
        if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
          creep.moveTo(targets, { visualizePathStyle: { stroke: "#fffff" } });
      } else {
        if (
          creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller);
        }
      }
      if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
      }
    } else if (!creep.memory.working) {
      var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store[RESOURCE_ENERGY] > 0,
      });
      if (
        containers &&
        creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(containers);
      } else {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (target) {
          if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
          }
        }
      }

      if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
        creep.memory.working = true;
      }
    }
  },
};

module.exports = roleBoxKicker;
var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store[RESOURCE_ENERGY] > 0,
      });
      const droppedResources = creep.pos.findClosestByRange(
        FIND_DROPPED_RESOURCES
      );
      if (droppedResources.length != 0) {
        if (creep.pickup(droppedResources) == ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedResources);
        }
      } else {
        if (creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(containers);
        }
      }
    }
  },
};

module.exports = roleBuilder;
var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    }
  },
};

module.exports = roleHarvester;
var roleMiner = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (!creep.memory.harvestPointId) {
      let occupiedHarvestPoints = _.filter(
        Game.creeps,
        (creep) => creep.memory.role == "miner"
      ).map((el) => el.memory.harvestPointId);
      let closestSource = creep.pos.findClosestByPath(FIND_SOURCES, 20, {
        filter: (source) => occupiedHarvestPoints.indexOf(source.id) == -1,
      });
      console.log(closestSource);
      creep.memory.harvestPointId = closestSource.id;
    }
    let source = Game.getObjectById(creep.memory.harvestPointId);

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  },
};

module.exports = roleMiner;
var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
      if (target) {
        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      } else {
        var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) =>
            s.structureType == STRUCTURE_CONTAINER &&
            s.store[RESOURCE_ENERGY] > 0,
        });
        if (
          containers &&
          creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(containers);
        }
      }

      if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
        creep.memory.upgrading = true;
      }

      // var sources = creep.room.find(FIND_SOURCES);
      // if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      //   creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      // }
    }
  },
};

module.exports = roleUpgrader;
const maxNumHarvesters = 2;
const maxNumUpgraders = 1;
const maxNumBuilders = 1;
const maxNumMiners = 2;
const maxNumBoxKickers = 2;
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
  if (energyAvailable >= 750) {
    body = level3;
  }
  // if (energyAvailable >= 1250) {
  //   body = monster;
  // }
  if (role == "miner") {
    if (energyAvailable >= 600) {
      body = basicMiner;
    } else {
      body = realBasicMiner;
    }
  }

  Game.spawns[room.name].spawnCreep(body, newName, {
    memory: { role: role, working: true },
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

  const miners = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "miner" && creep.room.name == room.name
  );

  const boxKickers = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "boxKicker" && creep.room.name == room.name
  );

  // TODO: Update this to search within room instead
  const tower = Game.getObjectById("63c7df8e8537bd003a0cf889");
  if (tower) {
    const closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) =>
          structure.hits < structure.hitsMax &&
          structure.structureType != STRUCTURE_WALL,
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

  // if (harvesters.length < maxNumHarvesters) {
  //   var newName = "Harvester" + Game.time;
  //   // console.log("Spawning new harvester: " + newName);
  //   Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
  //     memory: { role: "harvester" },
  //   });
  // } else if (upgraders.length < maxNumUpgraders) {
  //   var newName = "Upgrader" + Game.time;
  //   // console.log("Spawning new upgrader: " + newName);
  //   Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
  //     memory: { role: "upgrader" },
  //   });
  // } else if (builders.length < maxNumBuilders) {
  //   var newName = "Builder" + Game.time;
  //   // console.log("Spawning new builder: " + newName);
  //   Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, {
  //     memory: { role: "builder" },
  //   });
  // }

  // // If we get wiped make 2 harvesters first
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
    if (creep.memory.role == "miner") {
      roleMiner.run(creep);
    }
    if (creep.memory.role == "boxKicker") {
      roleBoxKicker.run(creep);
    }
  }
};
