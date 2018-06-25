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

    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
};
