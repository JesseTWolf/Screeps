const maxNumHarvesters = 2;
const maxNumUpgraders = 3;
const maxNumBuilders = 2;
const maxNumMiners = 2;
const maxNumBoxKickers = 3;
const maxNumDefenders = 2;

const controlledRooms = ["W5N8"];

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
  var energyAvailable = room.energyAvailable;
  room.visual.text("Total Energy: " + energyAvailable, 46.2, 9, {
    color: "green",
    font: 0.8,
  });

  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  room.visual.text("Harvesters: " + harvesters.length, 46, 0.5, {
    color: "green",
    font: 0.8,
  });

  var upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  room.visual.text("Upgraders:  " + upgraders.length, 46, 1.5, {
    color: "green",
    font: 0.8,
  });

  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  room.visual.text("Builders:      " + builders.length, 46, 2.5, {
    color: "green",
    font: 0.8,
  });
}

// function () {

// }

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // For each room in the list of controlled rooms do...
  controlledRooms.forEach(function (name) {
    printTheThings(Game.rooms[name]);
  });

  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  var upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );

  var tower = Game.getObjectById("bf124711ff3f3a01cc17bf28");
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    // console.log("Spawning new harvester: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  } else if (upgraders.length < 2) {
    var newName = "Upgrader" + Game.time;
    // console.log("Spawning new upgrader: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" },
    });
  } else if (builders.length < 1) {
    var newName = "Builder" + Game.time;
    // console.log("Spawning new builder: " + newName);
    Game.spawns["W5N8"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  if (Game.spawns["W5N8"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["W5N8"].spawning.name];
    Game.spawns["W5N8"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["W5N8"].pos.x + 1,
      Game.spawns["W5N8"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
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
