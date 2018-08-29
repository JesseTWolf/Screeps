let harvestPrototype = {
//   for(let name in Game.creeps) {}
//   var creep = Game.creeps.[name];

  console.log(name + " is working: " + creep.memory.working);

  if(creep.memory.working == true && creep.carry.energy == 0) {
    creep.memory.working = false;
  }
  else if(creep.memoryworking == false && creep.carry.energy == creep.carryCapacity) {
    creep.memory.working = true;
  }

  if(creep.memory.working == true) {
    if(creep.transfer(Game.spawns.Home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Home)};
  }
  else{
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}

module.exports = harvestPrototype;
