class Harvester extends Gatherer {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
    // if(this.ref.energyAvailable <= this.ref.energyCapacity) {
      this.pickupEnergy();
    }
    // else if(this.ref.memory.working === false) {
    else if(this.ref.memory.working === true) {
      this.dropOffEnergy();
      // console.log("no mass energy to drop off")
      // this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  dropOffEnergy() {
    // console.log("hoopla")
    let targets = this.ref.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                //return
                 structure.energy < structure.energyCapacity;
                }
            });
          // letcontainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          //   filter: (s) => s.structureType == STRUCTURE_CONTAINER
          //                 && s.store[RESOURCE_ENERGY] > 0
          //   });
            if(targets.length > 0) {
                if(this.ref.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // break;
            // else if(Storage.isActive()) {
            //     if(this.ref.transfer(sotrage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         this.ref.moveTo(storage, {visualizePathStyle:  {stroke: '#ffffff'}});
            //     }
            // }

            // else {
            //     if(this.ref.upgradeController(this.ref.room.controller) == ERR_NOT_IN_RANGE) {
            //         this.ref.moveTo(this.ref.room.controller);
            //     }
            // }

  }
}
