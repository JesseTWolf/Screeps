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
      } else {
        const closestDamagedStructure = creep.pos.findClosestByRange(
          FIND_STRUCTURES,
          {
            filter: (structure) =>
              (structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_WALL) ||
              (structure.structureType == STRUCTURE_WALL &&
                structure.hits == 1),
          }
        );
        if (closestDamagedStructure) {
          if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestDamagedStructure);
          }
        } else if (
          creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      var storages = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          (s.structureType == STRUCTURE_STORAGE ||
            s.structureType == STRUCTURE_LINK) &&
          s.store[RESOURCE_ENERGY] > 0,
      });

      var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
          s.structureType == STRUCTURE_CONTAINER &&
          s.store[RESOURCE_ENERGY] > 0,
      });
      const droppedResources = creep.pos.findClosestByRange(
        FIND_DROPPED_RESOURCES
      );

      if (
        storages &&
        creep.withdraw(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(storages);
      } else if (droppedResources) {
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
