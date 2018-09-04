class RepairMan extends Gatherer {
  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
      this.pickupEnergy();
    }
    else if(this.ref.memory.working === true){
      // this.build();
      this.repairAllTheThings()
      // this.upgradeRoom();
    }

  }

  repairAllTheThings() {
    let targets = this.ref.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_STORAGE) &&
                 structure.hits < structure.hitsMax;
                }
            });
              if(targets.length) {
                  if(this.ref.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                      this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                      this.ref.say('🔧')
                  }
  			}
  }
}
