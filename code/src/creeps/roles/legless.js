var roleLegless = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
      let link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_LINK,
      });

      if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(link, {
          visualizePathStyle: { stroke: "#ffff00" },
        });
      }
    } else {
      let storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_STORAGE,
      });

      if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    }
  },
};

module.exports = roleLegless;
