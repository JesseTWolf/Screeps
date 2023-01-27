var roleScoutHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // If creep is working and not in the work room move to it.
    if (creep.memory.working) {
      if (creep.room.name != creep.memory.workRoom) {
        const exitDir = Game.map.findExit(creep.room, creep.memory.workRoom);
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit, { visualizePathStyle: { stroke: "#ff0000" } });
      } else if (creep.store.getFreeCapacity() > 0) {
        var sources = creep.room.find(FIND_SOURCES);

        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      }

      if (creep.store.getFreeCapacity() == 0) {
        creep.memory.working = false;
      }
    } else if (!creep.memory.working) {
      if (creep.room.name != creep.memory.homeRoom) {
        const exitDir = Game.map.findExit(creep.room, creep.memory.homeRoom);
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit, { visualizePathStyle: { stroke: "#ff0000" } });
      }

      if (creep.room.name == creep.memory.homeRoom) {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == STRUCTURE_STORAGE &&
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
        if (targets.length == 0) {
          if (
            creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
          ) {
            creep.moveTo(creep.room.controller, {
              visualizePathStyle: { stroke: "#ffffff" },
            });
          }
        }
      }

      if (
        creep.store.getFreeCapacity([RESOURCE_ENERGY]) ==
        creep.store.getCapacity()
      ) {
        creep.memory.working = true;
      }
    }
  },
};

module.exports = roleScoutHarvester;
