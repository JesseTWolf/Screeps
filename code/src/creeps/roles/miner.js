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
      creep.memory.harvestPointId = closestSource.id;
    }
    let source = Game.getObjectById(creep.memory.harvestPointId);

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: "#ffff00" } });
    }
  },
};

module.exports = roleMiner;
