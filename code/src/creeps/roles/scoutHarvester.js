var roleScoutHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.room.name != creep.memory.workRoom) {
      creep.moveTo(new RoomPosition(25, 20, creep.memory.workRoom), {
        visualizePathStyle: { stroke: "#ff0000" },
      });
    } else if (creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else if (creep.room.name != creep.memory.homeRoom) {
      creep.moveTo(Game.rooms[creep.memory.homeRoom].spawn);
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
