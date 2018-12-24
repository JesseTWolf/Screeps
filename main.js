class Colony {
  constructor(name) {
    this.name = name
    // this.spawn = new Spawn(Game.spawns[name], this)
    this.spawn = new Spawn(Game.spawns[name],this)
    this.room = this.spawn.ref.room
    this.towerList = this.getTowerList()
    this.creeps = this.getCreepList() // list of creeps for this colony
  }

  tick() {
    this.findNewCreepToSpawn()
    for (let creep of this.creeps) {
      // console.log("Creeps within Colony tick method are: " +creep)
      CreepHelper.runCreepRole(creep, this)
    }

    for(let tower of this.towerList) {
      (new Tower(tower).tick())
    }
  }

  getCreepList() {
    let list = Object.values(Game.creeps).filter(creep => creep.memory.colony === this.name)
    return list
  }

  getTowerList() {
    return this.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    })
  }

  findNewCreepToSpawn() {
    let totalCreeps = Object.keys(Game.creeps).length;

    let minimimumNumberOfHarvesters = 1;
    let minimimumNumberOfUpgraders = 1;
    let minimimumNumberOfBuilders = 2;
    let minimimumNumberOfBoxKickers = 3;
    let minimimumNumberOfMiners = 2;
    let minimimumNumberOfRepairMan = 1;

    let numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'Harvester');
    let numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role === 'Upgrader');
    let numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role === 'Builder');
    let numberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role === 'BoxKicker');
    let numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role === 'Miner');
    let numberOfRepairMan = _.sum(Game.creeps, (c) => c.memory.role === 'RepairMan');

    for(var name in Game.rooms) {
        console.log('Room "' +name+'" has ' +Game.rooms[name].energyAvailable+' energy');
    }

    console.log('Harvesters: ' + numberOfHarvesters);
    console.log('Upgraders: ' + numberOfUpgraders);
    console.log('Builders: ' + numberOfBuilders);
    console.log('BoxKickers: ' + numberOfBoxKickers);
    console.log('Miners: ' + numberOfMiners);
    console.log('RepairMan: ' + numberOfRepairMan);
    console.log("   ")

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
        // console.log(boxKickerFlag)
    }
    else { boxKickerFlag = false;
    }

    let minerFlag = null;
    if(numberOfMiners < minimimumNumberOfMiners) {
        minerFlag = true;
    }
    else { minerFlag = false;
    }

    let repairManFlag = null;
    if(numberOfRepairMan < minimimumNumberOfRepairMan) {
      repairManFlag = true;
    }
    else { repairManFlag = false;
    }

    // for(var name in Game.rooms) {
    //     console.log('Room "' +name+'" has ' +Game.rooms[this.colony].energyAvailable+' energy');
    // }

    // if(totalCreeps == 0) {
    // if(harvesterFlag) {
    //   this.spawn.spawnCreep('Harvester')
    // }

    // else if(minerFlag) {
    if(minerFlag) {
      this.spawn.spawnCreep('Miner')
    }

    else if(boxKickerFlag) {
      // console.log('inside boxKickerFlag if statement')
      this.spawn.spawnCreep('BoxKicker')
    }

    else if(upgraderFlag) {
      this.spawn.spawnCreep('Upgrader')
    }

    else if(builderFlag) {
      this.spawn.spawnCreep('Builder')
    }

    else if(repairManFlag) {
      this.spawn.spawnCreep('RepairMan')
    }

    // let hostiles = this.ref.find(FIND_HOSTILE_CREEPS);
    // if(hostiles.length > 0) {
    //     let username = hostiles[0].owner.username;
    //     Game.notify(`User ${username} spotted in room ${roomName}`);
    //     let towers = this.ref.find(
    //         FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    //     towers.forEach(tower => tower.attack(hostiles[0]));
    // }

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
        // console.log("CreepRole is " +creepRole)
        return creepRole
      }
    }
  }

  static runCreepRole(creepRef, colony) {
    let creepClass = CreepHelper.getCreepClass(creepRef.memory.role)
    // console.log('Creep Ref : ' + creepRef + ' colony : ' + colony)
    let creep = new creepClass(creepRef, colony)
    creep.tick()
  }

  static newCreepName() {
    let newName = Game.time
    return newName
  }
}
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
      filter: (d) => d.amount >= 150
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
class BoxKicker extends Gatherer {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
    // if(this.ref.energyAvailable <= this.ref.energyCapacity) {
      this.pickupEnergy();
    }
    // else if(this.ref.memory.working === false) {
    else if(this.ref.memory.working === true) {
      this.dropOffEnergy();
      // console.log("no mass energy to drop off")
      // this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  dropOffEnergy() {
    // console.log("hoopla")
    let targets = this.ref.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                //return
                 structure.energy < structure.energyCapacity;
                }
            });
          // letcontainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          //   filter: (s) => s.structureType == STRUCTURE_CONTAINER
          //                 && s.store[RESOURCE_ENERGY] > 0
          //   });
            if(targets.length > 0) {
                if(this.ref.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // break;
            // else if(Storage.isActive()) {
            //     if(this.ref.transfer(sotrage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         this.ref.moveTo(storage, {visualizePathStyle:  {stroke: '#ffffff'}});
            //     }
            // }

            else {
                if(this.ref.upgradeController(this.ref.room.controller) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(this.ref.room.controller);
                }
            }

  }

  // pickupEnergy() {
  //   let container = this.ref.pos.findClosestByPath(FIND_STRUCTURES, {
  //     filter: (s) => s.structureType == STRUCTURE_CONTAINER
  //                 && s.store[RESOURCE_ENERGY] > 200
  //   });
  //
  //   let droppedEnergy = this.ref.room.find(FIND_DROPPED_RESOURCES, {
  //     filter: (d) => d.amount >= 100
  //   });
  //
  //   let pickupDropped;
  //   if(droppedEnergy.length) {
  //       pickupDropped = this.ref.pickup(droppedEnergy[0]);
  //       // console.log(pickupDropped);
  //   }
  //
  //   if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
  //       this.ref.moveTo(droppedEnergy[0]);
  //   }
  //
  //   if(this.ref.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
  //     this.ref.moveTo(container)
  //     this.ref.say('⛋')
  //   }
  // }
}
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
      // this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  build() {
    let targets = this.ref.room.find(FIND_CONSTRUCTION_SITES);
			// console.log(targets);
            if(targets.length) {
                if(this.ref.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    this.ref.say('🔨')
                }
			}
  }
}
class Harvester extends Gatherer {

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.checkWorkingStatus();
    if(this.ref.memory.working === false) {
    // if(this.ref.energyAvailable <= this.ref.energyCapacity) {
      this.pickupEnergy();
    }
    // else if(this.ref.memory.working === false) {
    else if(this.ref.memory.working === true) {
      this.dropOffEnergy();
      // console.log("no mass energy to drop off")
      // this.upgradeRoom();
    }
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  dropOffEnergy() {
    // console.log("hoopla")
    let targets = this.ref.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                //return
                 structure.energy < structure.energyCapacity;
                }
            });
          // letcontainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          //   filter: (s) => s.structureType == STRUCTURE_CONTAINER
          //                 && s.store[RESOURCE_ENERGY] > 0
          //   });
            if(targets.length > 0) {
                if(this.ref.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.ref.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // break;
            // else if(Storage.isActive()) {
            //     if(this.ref.transfer(sotrage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         this.ref.moveTo(storage, {visualizePathStyle:  {stroke: '#ffffff'}});
            //     }
            // }

            // else {
            //     if(this.ref.upgradeController(this.ref.room.controller) == ERR_NOT_IN_RANGE) {
            //         this.ref.moveTo(this.ref.room.controller);
            //     }
            // }

  }
}
class Miner extends Gatherer {
  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.mine();
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  mine() {
    if(!this.ref.memory.harvestPointId) {
            let occupiedHarvestPoints = _.filter(Game.creeps, (creep) => this.ref.memory.role == 'Miner').map((el) => el.memory.harvestPointId);
            let closestSource = this.ref.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => occupiedHarvestPoints.indexOf(source.id) == -1});
            this.ref.memory.harvestPointId = closestSource.id;
        }
        let source = Game.getObjectById(this.ref.memory.harvestPointId);
        // if(source) {
            if(this.ref.harvest(source) == ERR_NOT_IN_RANGE) {
                this.ref.moveTo(source);
            }
  }
}
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
    let totalCreeps = Object.keys(Game.creeps).length;
    let newName = Game.time;
    // if (!options) options = {}
    // if (!options.memory) options.memory = {}

    // let creepClass = CreepHelper.getCreepClass(info.role)

    // options.memory.role = creepClass.name
    // options.memory.colony = this.colony.name

    // if(info == 'Harvester') {
    //   this.ref.spawnCreep([WORK,CARRY,MOVE],
    //     'Harvester' + newName,
    //     { memory: { role: 'Harvester', colony: this.colony.name, working: false}})
    // }

    if(info === 'Miner') {
      if(this.ref.room.energyAvailable >= 600) {
        this.ref.spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
          'Miner ' + newName,
          { memory: { role: 'Miner' , colony: this.colony.name, working: false}})
      }
      else if(totalCreeps >0) {
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
class Config {
  constructor() {}

  static get COLONIES() {
    return ['Spawn-W3N7']
  }

  static get ROLES() {
    return [Gatherer,BoxKicker, Builder, RepairMan, Miner, Upgrader]
  }
}
for (let colonyName of Config.COLONIES) {
  (new Colony(colonyName)).tick()
}
