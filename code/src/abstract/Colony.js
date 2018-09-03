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
