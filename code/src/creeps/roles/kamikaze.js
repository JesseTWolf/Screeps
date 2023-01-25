var roleKamikaze = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // If creep is working and not in the work room move to it.
    // if (creep.memory.working) {
    ceaseFire = true;

    if (creep.room.name != creep.memory.workRoom) {
      // const exitDir = Game.map.findExit(creep.room, creep.memory.workRoom);
      // const exit = creep.pos.findClosestByRange(exitDir);
      // creep.moveTo(exit, { visualizePathStyle: { stroke: "#ff0000" } });
      creep.moveTo(new RoomPosition(8, 35, creep.memory.workRoom));
    } else {
      const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);

      if (hostiles.length) {
        const target = hostiles[0];

        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        } else {
          creep.attack(target);
        }

        // creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if (target) {
        //   creep.attack(target);
        // }
      } else {
        creep.moveTo(Game.flags["SkirmishZone"]);
      }
    }
    // }
  },
};

module.exports = roleKamikaze;
