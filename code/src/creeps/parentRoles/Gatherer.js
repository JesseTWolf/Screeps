class Gatherer extends Creep {

  constructor(ref, colony) {
    super(ref, colony)
  }

  pickupEnergy() {
    // console.log("within Gatherer pickupEnergyMethod")
    let container = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
                  && s.store[RESOURCE_ENERGY] > 500
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
        this.ref.say('💧')
    }

    else if(this.ref.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(container)
      this.ref.say('⛋')
    }
  }

  upgradeRoom() {
    if(this.ref.upgradeController(this.ref.room.controller) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(this.ref.room.controller);
      this.ref.say('🔋')
    }
  }

  repairRoads() {
  }

  checkWorkingStatus() {
    if(this.ref.memory.working === true && this.ref.carry.energy == 0) {
        this.ref.memory.working = false;
    }
    else if(this.ref.memory.working === false && this.ref.carry.energy >= this.ref.carryCapacity) {//(.5 * this.ref.carryCapacity)) {
      // console.log("Working is false and filled with energy.")
        this.ref.memory.working = true;
    }
  }
}
