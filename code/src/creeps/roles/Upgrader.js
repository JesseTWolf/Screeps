class Upgrader extends Gatherer {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
      this.pickupEnergy();
    }
    else if(this.ref.memory.working === true){
      this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }
}
