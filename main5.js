class Colony {
  constructor(name) {
    this.name = name
    // this.spawn = new Spawn(Game.spawns[name], this)
    this.spawn = new Spawn(Game.spawns[name])
    this.room = this.spawn.ref.room
    this.creeps = this.getCreepList() // list of creeps for this colony
  }

  tick() {
    this.findNewCreepToSpawn()
    for (let creep of this.creeps) {
      console.log("Creeps within Colony tick method are: " +creep)
      CreepHelper.runCreepRole(creep, this)
    }
  }

  getCreepList() {
    let list = Object.values(Game.creeps).filter(creep => creep.memory.colony === this.name)
    return list
  }

  findNewCreepToSpawn() {
    let totalCreeps = Object.keys(Game.creeps).length;

    let minimimumNumberOfHarvesters = 1;
    let minimimumNumberOfUpgraders = 1;
    let minimimumNumberOfBuilders = 2;
    let minimimumNumberOfBoxKickers = 3;
    let minimimumNumberOfMiners = 2;

    let numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'Harvester');
    let numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'Upgrader');
    let numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'Builder');
    let numberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role == 'BoxKicker');
    let numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'Miner');

    console.log('Harvesters: ' + numberOfHarvesters);
    console.log('Upgraders: ' + numberOfUpgraders);
    console.log('Builders: ' + numberOfBuilders);
    console.log('BoxKickers: ' + numberOfBoxKickers);
    console.log('Miners: ' + numberOfMiners);

    let harvesterFlag = null;
    if(numberOfHarvesters < minimimumNumberOfHarvesters) {
        harvesterFlag = true;
    }
    else { harvesterFlag = false;
    }

    let upgraderFlag = null;
    if(numberOfUpgraders < minimimumNumberOfUpgraders) {
        upgraderFlag = true;
    }
    else { upgraderFlag = false;
    }

    let builderFlag = null;
    if(numberOfBuilders < minimimumNumberOfBuilders) {
        builderFlag = true;
    }
    else { builderFlag = false;
    }

    let boxKickerFlag = null;
    if(numberOfBoxKickers < minimimumNumberOfBoxKickers) {
        boxKickerFlag = true;
    }
    else { boxKickerFlag = false;
    }

    let minerFlag = null;
    if(numberOfMiners < minimimumNumberOfMiners) {
        minerFlag = true;
    }
    else { minerFlag = false;
    }

    // for(var name in Game.rooms) {
    //     console.log('Room "' +name+'" has ' +Game.rooms[this.colony].energyAvailable+' energy');
    // }

    if(totalCreeps == 0) {
      this.spawn.spawnCreep('Harvester')
    }

    else if(minerFlag) {
      this.spawn.spawnCreep('Miner')
    }

    else if(boxKickerFlag) {
      this.spawn.spawnCreep('BoxKicker')
    }

    else if(upgraderFlag) {
      this.spawn.spawnCreep('Upgrader')
    }

    else if(builderFlag) {
      this.spawn.spawnCreep('Builder')
    }

    // // for each creeps to spawn for the current colony level
    // for (let creepToSpawn of creepsToSpawn) {
    //   let creepExists = false
    //
    //   // go through each creeps of the colony to find one already alive
    //   for (let i = currentCreeps.length - 1; i >= 0; i--) {
    //     const sameRole = currentCreeps[i].memory.role === creepToSpawn.role
    //     const sameLevel = currentCreeps[i].memory.level === this.colonyLevel
    //
    //     // if the creep was found alive
    //     // remove it from list and search for next to spawn
    //     if (sameRole && sameLevel) {
    //       creepExists = true
    //       currentCreeps.splice(i, 1)
    //       break
    //     }
    //   }
    //
    //   // if the creep to spawn isn't already alive
    //   if (!creepExists) {
    //     this.spawn.spawnCreep(creepToSpawn)
    //     break
    }
}
class Entity {
  constructor(ref, colony) {
    this.ref = ref
    this.colony = colony
  }
}
class Creep extends Entity {

  constructor(ref, colony) {
    super(ref, colony)
  }
  
}
class CreepHelper {

  static getCreepClass(className) {
    for (let creepRole of Config.ROLES) {
      if (className === creepRole.name) {
        console.log("CreepRole is " +creepRole)
        return creepRole
      }
    }
  }

  static runCreepRole(creepRef, colony) {
    let creepClass = CreepHelper.getCreepClass(creepRef.memory.role)
    let creep = new creepClass(creepRef, colony)
    creep.tick()
  }

  static newCreepName() {
    let newName = Game.time
    return newName
  }
}
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
// class Gatherer extends Creep{
//
//   constructor(ref, colony) {
//     super(ref, colony)
//   }
//
//   pickupEnergy(creep) {
//     let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
//       filter: (s) => s.structureType == STRUCTURE_CONTAINER
//                   && s.store[RESOURCE_ENERGY] > 200
//     });
//
//     let droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
//       filter: (d) => d.amount >= 100
//     });
//
//     let pickupDropped;
//     if(droppedEnergy.length) {
//         pickupDropped = creep.pickup(droppedEnergy[0]);
//         // console.log(pickupDropped);
//     }
//
//     if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
//         creep.moveTo(droppedEnergy[0]);
//     }
//
//     if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(container)
//       creep.say('⛋')
//     }
//   }
//
//   upgradeRoom(creep) {
//     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(creep.room.controller);
//     }
//   }
//
//   repairRoads(creep) {
//
//   }
//
// }
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
class Config {
  constructor() {}

  static get COLONIES() {
    return ['Spawn-W1N8']
  }

  static get ROLES() {
    return [BoxKicker]
  }
}
for (let colonyName of Config.COLONIES) {
  (new Colony(colonyName)).tick()
}
