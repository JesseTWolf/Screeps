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
      if (creep.room.controller.sign.username != "Jesse") {
        if (
          creep.signController(
            creep.room.controller,
            "Keep your filthy creeps outta here Delphes :P"
          ) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller);
        }
      }
    } else {
      const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_STORAGE &&
          s.store.getUsedCapacity[RESOURCE_ENERGY] > 0,
      });
      if (storage) {
        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storage);
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
