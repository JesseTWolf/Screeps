class Spawn extends Entity {
  constructor(ref, colony) {
    super(ref)
    this.colony = colony
  }

// spawnCreep(info, options) {
  spawnCreep(info) {
    // if (!options) options = {}
    // if (!options.memory) options.memory = {}

    let creepClass = CreepHelper.getCreepClass(info.role)

    // options.memory.role = creepClass.name
    // options.memory.colony = this.colony.name

    if(creepClass === 'BoxKicker')
      if(this.ref.room.energyAvailable >= 550) {
        this.ref.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
          'BoxKicker ' + newCreepName(),
          { memory: { colony: this.colony.name }})
      }
      else {
        this.ref.spawnCreep([CARRY,CARRY,MOVE,MOVE],
          'BoxKicker ' + newCreepName(),
          { memory: { colony: this.colony.name }})
      }
    }
    // spawn creep with colony variable in memory
}
