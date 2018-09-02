// module.exports = class Miner{
//   constructor() {
//     // super() 
//     this.defaultEnergy = 500;
//   }
let miner = {
  //@param {Creep} creep
//   work() {
    run: function(creep) {
    if(creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    // letsource = creep.pos.findClosestByPath(FIND_SOURCES);
    // letsources = room.find(FIND_SOURCES); 
    // letswitchSource = _.random(0,4) == 0;
    // if(switchSource) {
    //   used = sources[0];
    // }
    // else {
    //   used = sources[1];
    // }
    if(creep.harvest(creep.memory.source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.memory.source);
    }
  }
};
