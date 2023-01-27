var roleBoxKicker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.working) {
      let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < structure.energyCapacity
          );
        },
      });

      if (targets) {
        if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets, { visualizePathStyle: { stroke: "#fffff" } });
        }
      }
      if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.working = false;
      }
    } else if (!creep.memory.working) {
      var storages = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0,
      });

      var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store[RESOURCE_ENERGY] > 0,
      });

      if (
        storages &&
        creep.withdraw(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(storages);
      } else if (
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
