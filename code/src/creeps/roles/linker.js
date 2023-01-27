var roleLinker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // let currentCapacity = creep.room.energyAvailable;
    // let maxCapacity = creep.room.energyCapacity;

    if (!creep.memory.containerID) {
      /** Commented out until I have second linker up and running
       *  let occupiedContainers = _.filter(
        Game.creeps,
        (creep) => creep.memory.role == "linker"
      ).map((el) => el.memory.containerID);

      let closestContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) =>
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store[RESOURCE_ENERGY] > 0,
      });

       creep.memory.containerID = closestContainer.id;
       */

      creep.memory.containerID = "63ca254a20730200730248a8";
    } else {
      if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
        let container = Game.getObjectById(creep.memory.containerID);

        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container, {
            visualizePathStyle: { stroke: "#ffff00" },
          });
        }
      } else {
        let link = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => structure.structureType == STRUCTURE_LINK,
        });

        if (link.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          creep.transfer(link, RESOURCE_ENERGY);
        }
      }
    }
  },
};

module.exports = roleLinker;
