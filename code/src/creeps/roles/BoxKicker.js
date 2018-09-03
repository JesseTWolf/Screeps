class BoxKicker extends Creep {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.pickupEnergy();
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  pickupEnergy() {
    let container = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
                  && s.store[RESOURCE_ENERGY] > 200
    });

    let droppedEnergy = this.ref.room.find(FIND_DROPPED_RESOURCES, {
      filter: (d) => d.amount >= 100
    });

    let pickupDropped;
    if(droppedEnergy.length) {
        pickupDropped = this.ref.pickup(droppedEnergy[0]);
        // console.log(pickupDropped);
    }

    if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(droppedEnergy[0]);
    }

    if(this.ref.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(container)
      this.ref.say('⛋')
    }
  }
}
