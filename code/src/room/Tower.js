class Tower extends Entity {
  constructor(ref) {
    super(ref)
  }

  tick() {
    let hostiles = this.ref.room.find(FIND_HOSTILE_CREEPS)

    if(hostiles.length) {
      this.attack(hostiles)
    }
    else {
      let damagedCreeps = this.ref.room.find(FIND_MY_CREEPS).filter(creep => {
        return creep.hits < creep.hitsMax
      })

      this.heal(damagedCreeps)
    }
  }

  attack(hostiles) {
    this.ref.attack(hostiles[0])
  }

  heal(damagedCreeps) {
    this.ref.heal(damagedCreeps)
  }
}
