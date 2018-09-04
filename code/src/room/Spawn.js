class Spawn extends Entity {
  constructor(ref, colony) {
    super(ref,colony)
    // this.colony = colony
  }

  // let newName;
  // newCreepName() {
  //   let newName = Game.time
  // }

// spawnCreep(info, options) {
  spawnCreep(info) {
    // this.colony = colony
    let newName = Game.time
    // if (!options) options = {}
    // if (!options.memory) options.memory = {}

    // let creepClass = CreepHelper.getCreepClass(info.role)

    // options.memory.role = creepClass.name
    // options.memory.colony = this.colony.name

    if(info === 'Miner') {
      if(this.ref.room.energyAvailable >= 600) {
        this.ref.spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
          'Miner ' + newName,
          { memory: { role: 'Miner' , colony: this.colony.name, working: false}})
      }
      else {
        this.ref.spawnCreep([WORK,WORK,MOVE],
          'Miner ' + newName,
          { memory: { role: 'Miner' , colony: this.colony.name, working: false}})
      }
    }

    else if(info === 'BoxKicker') {
      if(this.ref.room.energyAvailable >= 700) {
        this.ref.spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
          'BoxKicker ' + newName,
          { memory: { role: 'BoxKicker', colony: this.colony.name, working: false}})
      }
      else {
        this.ref.spawnCreep([WORK,CARRY,MOVE,MOVE],
          'BoxKicker ' + newName,
          { memory: { role: 'BoxKicker', colony: this.colony.name, working: false}})
      }
    }

    else if(info === 'Upgrader') {
      if(this.ref.room.energyAvailable >= 800) {
        this.ref.spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
                             ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
          'Upgrader ' + newName,
          { memory: { role:'Upgrader', colony: this.colony.name, working: false}})
      }
      else if(this.ref.room.energyAvailable >= 400) {
          this.ref.spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                  'Upgrader ' + newName,
                  {memory: { role:'Upgrader', colony: this.colony.name, working: false}});
      }
      else {
        this.ref.spawnCreep([WORK,CARRY,MOVE,MOVE],
          'Upgrader ' + newName,
          { memory: { role:'Upgrader', colony: this.colony.name, working: false}})
      }
    }

    else if(info === 'Builder') {
      if(this.ref.room.energyAvailable >= 1460) {
        this.ref.spawnCreep([ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                             ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
          'Builder ' + newName,
          { memory: { role:'Builder', colony: this.colony.name, working: false}})
      }
      else if(this.ref.room.energyAvailable >= 730) {
          this.ref.spawnCreep([ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                  'Builder ' + newName,
                  {memory: { role:'Builder',  colony: this.colony.name, working: false}});
      }
      else {
        this.ref.spawnCreep([WORK,CARRY,MOVE,MOVE],
          'Builder ' + newName,
          { memory: { role:'Builder', colony: this.colony.name, working: false}})
      }
    }

    else if(info === 'RepairMan') {
      // console.log('within repairman')
      this.ref.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'RepairMan ' + newName,
        { memory: { role:'RepairMan', colony: this.colony.name, working: false}})
    }
  }
    // spawn creep with colony variable in memory
}
