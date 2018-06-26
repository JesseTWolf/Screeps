// module.exports = class Miner{
//   constructor() {
//     // super() 
//     this.defaultEnergy = 500;
//   }
var miner = {
  //@param {Creep} creep
//   work() {
    run: function(creep) {
    if(creep.memory.working == true && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    // var source = creep.pos.findClosestByPath(FIND_SOURCES);
    // var sources = room.find(FIND_SOURCES); 
    // var switchSource = _.random(0,4) == 0;
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
