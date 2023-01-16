var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    } else if (
      Game.spawns["W5N8"].energy < Game.spawns["W5N8"].energyCapacity
    ) {
      if (
        creep.transfer(Game.spawns["W5N8"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(Game.spawns["W5N8"]);
      }
    }
  },
};

module.exports = roleHarvester;
var roleHarvester = require("harvester.js");

module.exports.loop = function () {
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    roleHarvester.run(creep);
  }
};
