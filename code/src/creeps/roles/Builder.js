class Builder extends Gatherer {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
      this.pickupEnergy();
    }
    else if(this.ref.memory.working === true){
      this.build();
      this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  build() {
    let targets = this.ref.room.find(FIND_CONSTRUCTION_SITES);
			// console.log(targets);
            if(targets.length) {
                if(this.ref.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
			}
  }
}
