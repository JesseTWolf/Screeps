/*

Memory.Economy:
  sumMined: int
  sumSpent: int
  averageMined: int
  averageSpent: int
  averageDiff: int
  minedHistory: [int] // max length of HISTORY_LENGTH
  spentHistory: [int] // max length of HISTORY_LENGTH

*/

class EconomySingleton {
  constructor(ref) {
    // delete Memory.Economy

    this.visual = new RoomVisual()
    this.minedHistory = null
    this.spentHistory = null
    this.minedForCurrentTick = 0
    this.spentForCurrentTick = 0

    this.initMemory()
  }

  get HISTORY_LENGTH() { return 50 }
  get GREEN_COLOR() { return '#00ff66' }
  get RED_COLOR() { return '#ff4444' }
  get YELLOW_COLOR() { return '#ffff00' }

  get memory() { return Memory.Economy }

  initMemory() {
    if (!Memory.Economy) {
      Memory.Economy = {}
      this.minedHistory = []
      this.spentHistory = []
    } else {
      this.minedHistory = Memory.Economy.minedHistory
      this.spentHistory = Memory.Economy.spentHistory
    }
  }

  mined(amount) {
    this.minedForCurrentTick += amount
  }

  spend(amount) {
    this.spentForCurrentTick += amount
  }

  updateAndSave() {
    this.minedHistory.push(this.minedForCurrentTick)
    this.spentHistory.push(this.spentForCurrentTick)

    if (this.minedHistory.length > this.HISTORY_LENGTH) {
      this.minedHistory.shift()
    }

    if (this.spentHistory.length > this.HISTORY_LENGTH) {
      this.spentHistory.shift()
    }

    let sumMined = this.minedHistory.reduce((acc, v) => acc += v, 0)
    let sumSpent = this.spentHistory.reduce((acc, v) => acc += v, 0)

    let averageMined = sumMined / this.minedHistory.length
    let averageSpent = sumSpent / this.minedHistory.length
    let diff = Math.round(averageMined - averageSpent)

    Memory.Economy.sumMined = sumMined || 0
    Memory.Economy.sumSpent = sumSpent || 0
    Memory.Economy.averageMined = averageMined || 0
    Memory.Economy.averageSpent = averageSpent || 0
    Memory.Economy.averageDiff = diff || 0
    Memory.Economy.minedHistory = this.minedHistory
    Memory.Economy.spentHistory = this.spentHistory
  }

  render() {
    this.displayText()
    this.displayGraph()
  }

  displayText() {
    this.visual.rect(0 - 0.5, 0 - 0.5, 9, 1, { fill: '#000000', opacity: 0.5 })
    this.visual.text(`⛏: +${ Math.round(Memory.Economy.averageMined) || 0 }`, 1, 0.2, {color: this.GREEN_COLOR})
    this.visual.text(`💰: -${ Math.round(Memory.Economy.averageSpent) || 0 }`, 4, 0.2, {color: this.RED_COLOR})

    if (Memory.Economy.averageDiff >= 0) {
      this.visual.text(`⚖ +${ Math.round(Memory.Economy.averageDiff) || 0 }`, 7, 0.2, {color: this.GREEN_COLOR})
    } else {
      this.visual.text(`⚖ -${ Math.abs(Math.round(Memory.Economy.averageDiff) || 0) }`, 7, 0.2, {color: this.RED_COLOR})
    }
  }

  displayGraph() {
    const width = 9
    const height = 5
    const widthMultiplier = Math.min(width, width / this.minedHistory.length)
    const xOffset = -0.5
    const yOffset = 1
    const yScale = 75

    this.visual.rect(xOffset, yOffset, width, height, { fill: '#000000', opacity: 0.5 })

    for (let i = 1; i < this.minedHistory.length; i++) {
      let lastv = this.minedHistory[i - 1]
      let v = this.minedHistory[i]

      let x1 = (i - 1) * widthMultiplier
      let y1 = height - ((lastv / yScale) * height)

      let x2 = i * widthMultiplier
      let y2 = height - ((v / yScale) * height)

      y1 = Math.max(0, y1)
      y2 = Math.max(0, y2)

      x1 += xOffset
      x2 += xOffset
      y1 += yOffset
      y2 += yOffset

      this.visual.line(x1, y1, x2, y2, { color: this.GREEN_COLOR})
    }

    for (let i = 1; i < this.spentHistory.length; i++) {
      let lastv = this.spentHistory[i - 1]
      let v = this.spentHistory[i]

      let x1 = (i - 1) * widthMultiplier
      let y1 = height - ((lastv / yScale) * height)

      let x2 = i * widthMultiplier
      let y2 = height - ((v / yScale) * height)

      y1 = Math.max(0, y1)
      y2 = Math.max(0, y2)

      x1 += xOffset
      x2 += xOffset
      y1 += yOffset
      y2 += yOffset

      this.visual.line(x1, y1, x2, y2, { color: this.RED_COLOR})
    }
  }
}
class MemoryCleaner {
  static clearDeadCreeps() {
    for(letname in Memory.creeps) {
      if (!Game.creeps[name]) {
        // console.log('Clearing non-existing creep memory: ', name)
        delete Memory.creeps[name]
      }
    }
  }
}
/*

colony.room.memory.army:
  squads: {
    'squadName': { Squad Infos }
  }

*/

class Army {
  constructor(colony) {
    this.colony = colony
    this.squads = this.getSquads()
  }

  getSquads() {
    if (!this.colony.memory.army.squads) {
      this.colony.memory.army.squads = {}
    }

    return this.colony.memory.army.squads
  }

  tick() {
    for (let squadName in this.squads) {
      (new Squad(this.colony, squadName)).tick()
    }
  }
}
class Colony {
  constructor(name) {
    this.name = name
    this.spawn = new Spawn(Game.spawns[name], this)
    this.room = this.spawn.ref.room
    this.army = new Army(this)
    this.creeps = this.getCreepList()
    this.creepsByRole = this.getCreepsByRole()
    this.towerList = this.getTowerList()
    this.colonyLevel = this.getColonyLevel()
    this.controllerUpgradeIsPriority = this.isControllerSafetyUpgradeActive()
    this.sources = this.room.find(FIND_SOURCES)
    this.gatherFromMinerals = false

    // console.log(JSON.stringify({
    //   'Gatherer': this.creepsByRole.Gatherer.length,
    //   'Hauler': this.creepsByRole.Hauler.length,
    //   'Repair': this.creepsByRole.Repair.length,
    //   'Builder': this.creepsByRole.Builder.length,
    // }))
  }

  tick() {
    this.findNewCreepToSpawn()

    for (let creep of this.creeps) {
      CreepHelper.runCreepRole(creep, this)
    }

    for (let tower of this.towerList) {
      (new Tower(tower)).tick()
    }

    this.army.tick()
  }

  isControllerSafetyUpgradeActive() {
    const DOWNGRADE_DELAY = CONTROLLER_DOWNGRADE[this.room.controller.level]

    if (this.room.controller.ticksToDowngrade < DOWNGRADE_DELAY * 0.5) {
      this.room.memory.controllerSafetyUpgrading = true
      return true
    } else if (this.room.controller.ticksToDowngrade < DOWNGRADE_DELAY * 0.75) {
      return !!this.room.memory.controllerSafetyUpgrading
    } else {
      this.room.memory.controllerSafetyUpgrading = false
      return false
    }
  }

  getCreepsByRole() {
    let creepsByRoles = {}

    for (let role of Config.ROLES) {
      creepsByRoles[role.name] = this.creeps.filter(creep => creep.memory.role === role.name)
    }

    return creepsByRoles
  }

  getTowerList() {
    return this.room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    })
  }

  getCreepList() {
    let list = Object.values(Game.creeps).filter(creep => creep.memory.colony === this.name)
    return list
  }

  getColonyLevel() {
    if (!this.creepsByRole.Gatherer.length || !this.creepsByRole.Hauler.length) return 1

    const maxEnergy = this.room.energyCapacityAvailable

    // spawner only
    if (maxEnergy === SPAWN_ENERGY_CAPACITY) return 1

    // from 0 to 9 extensions
    if (maxEnergy < SPAWN_ENERGY_CAPACITY + 10*50) return 2

    // from 10 to 14 extensions
    if (maxEnergy < SPAWN_ENERGY_CAPACITY + 20*50) return 3

    return 4
  }

  findNewCreepToSpawn() {
    let creepsToSpawn = Config.CREEP_BUILD_ORDER[this.colonyLevel]
    let currentCreeps = this.creeps.slice()

    // for each creeps to spawn for the current colony level
    for (let creepToSpawn of creepsToSpawn) {
      let creepExists = false

      // go through each creeps of the colony to find one already alive
      for (let i = currentCreeps.length - 1; i >= 0; i--) {
        const sameRole = currentCreeps[i].memory.role === creepToSpawn.role
        const sameLevel = currentCreeps[i].memory.level === this.colonyLevel

        // if the creep was found alive
        // remove it from list and search for next to spawn
        if (sameRole && sameLevel) {
          creepExists = true
          currentCreeps.splice(i, 1)
          break
        }
      }

      // if the creep to spawn isn't already alive
      if (!creepExists) {
        this.spawn.spawnCreep(creepToSpawn)
        break
      }
    }
  }

  getNewGathererSourceId() {
    let sources = this.sources.slice()

    if (this.gatherFromMinerals) {
      sources = sources.concat(this.room.find(FIND_MINERALS))
    }

    for (let source of sources) {
      let nGatherersForSource = this.creepsByRole.Gatherer.filter(creep => {
        return creep.memory.sourceid === source.id
      }).length

      if (nGatherersForSource === 0) {
        return source.id
      }
    }
  }

  getNewHaulerSourceId() {
    let sources = this.sources.slice()

    if (this.gatherFromMinerals) {
      sources = sources.concat(this.room.find(FIND_MINERALS))
    }

    for (let source of sources) {
      let nGatherersForSource = this.creepsByRole.Hauler.filter(creep => {
        return creep.memory.sourceid === source.id
      }).length

      if (nGatherersForSource === 0) {
        return source.id
      }
    }
  }

  getNewRepairTarget() {
    let targetsToRepair = this.room.find(FIND_STRUCTURES).filter(structure => {
      const requireRepair = structure.hits < structure.hitsMax
      const isWall = structure.structureType === STRUCTURE_WALL
      const isRampart = structure.structureType === STRUCTURE_RAMPART
      return requireRepair && !isWall && !isRampart
    })

    if (targetsToRepair.length) {
      targetsToRepair.sort((a, b) => {
        a.hits / a.hitsMax > b.hits / b.hitsMax ? 1 : -1
      })

      return targetsToRepair[0].id
    }
  }
}
/*
class Spawn extends Entity {
  constructor(name) {
    super(Game.spawns[name])
    this.name = name
    this.spawnRequested = false
    this.kickstart = this.requireKickstart()
    this.gatherFromMinerals = true

    new RoomEntity(this.ref.room)

    let creepList = Object.values(Game.creeps)

    if (this.kickstart) {
      this.gatherFromMinerals = false
      this.spawnGatherer(creepList)
      this.spawnHauler(creepList)
    } else {
      this.despawnArmy(creepList)
      this.spawnArmy(creepList, 2)
      this.spawnGatherer(creepList)
      this.spawnHauler(creepList)

      if (Economy.memory.averageMined > 16) {
        this.spawnBuilder(creepList, 6)
      }

      this.spawnRepair(creepList, 1)
      this.spawnReserver(creepList)
      this.spawnScavenger(creepList, 1)
    }
  }

  requireKickstart() {
    let creeps = this.ref.room.find(FIND_MY_CREEPS)
    let sources = this.ref.room.find(FIND_SOURCES)

    if (creeps.length < sources.length * 2) {
      return true
    }

    return false
  }

  despawnArmy(creepList) {
    let hostiles = this.ref.room.find(FIND_HOSTILE_CREEPS)

    if (!hostiles.length) {
      const tanks = creepList.filter(creep => creep.memory.role === CreepArmyTankEntity.ROLE_NAME)

      for (let tank of tanks) {
        this.ref.recycleCreep(tank)
      }
    }
  }

  spawnArmy(creepList, nSpawns) {
    let hostiles = this.ref.room.find(FIND_HOSTILE_CREEPS)

    if (hostiles.length) {
      const tanks = creepList.filter(creep => creep.memory.role === CreepArmyTankEntity.ROLE_NAME)

      if (tanks.length < nSpawns) {
        let parts = null

        parts = {
          [TOUGH]: 7,
          [ATTACK]: 3,
          [MOVE]: 10
        } // 810

        this.tryToSpawnCreep(parts, {
          memory: {
            role: CreepArmyTankEntity.ROLE_NAME
          }
        }, CreepArmyTankEntity.ICON)
      }
    }
  }

  spawnGatherer(creepList) {
    const rooms = Config.CONTROLLED_ROOMS.concat(Config.RESERVED_ROOMS)
    const gatherers = creepList.filter(creep => creep.memory.role === CreepGathererEntity.ROLE_NAME)

    for (let roomId of rooms) {
      if (!Game.rooms[roomId]) {
        continue
      }

      let room = Game.rooms[roomId]
      let sources = room.find(FIND_SOURCES)

      if (this.gatherFromMinerals) {
        sources = sources.concat(room.find(FIND_MINERALS))
      }

      for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
        let nGatherersForSource = gatherers.filter(creep => {
          return creep.memory.room === roomId &&
          creep.memory.sourceid === sources[sourceIndex].id
        }).length

        if (nGatherersForSource < 1) {
          let parts = null

          if (this.ref.room.energyCapacityAvailable >= 850) {
            parts = {
              [WORK]: 6,
              [MOVE]: 5
            } // 850
          } else if (this.ref.room.energyCapacityAvailable >= 550) {
            parts = {
              [WORK]: 4,
              [MOVE]: 3
            } // 550
          } else if (this.ref.room.energyCapacityAvailable >= 400) {
            parts = {
              [WORK]: 3,
              [MOVE]: 2
            } // 400
          } else {
            parts = {
              [WORK]: 2,
              [MOVE]: 2
            } // 300
          }

          if (this.kickstart === true) {
            parts = {
              [WORK]: 1,
              [MOVE]: 1
            }
          }

          this.tryToSpawnCreep(parts, {
            memory: {
              role: CreepGathererEntity.ROLE_NAME,
              room: roomId,
              sourceid: sources[sourceIndex].id
            }
          }, CreepGathererEntity.ICON)
        }
      }
    }
  }

  spawnBuilder(creepList, nSpawns) {
    const builders = creepList.filter(creep => creep.memory.role === CreepBuilderEntity.ROLE_NAME)
    let nBuildersInRoom = builders.length

    if (nBuildersInRoom < nSpawns) {
      let parts = null

      if (this.ref.room.energyCapacityAvailable >= 1400) {
        parts = {
          [WORK]: 4,
          [CARRY]: 8,
          [MOVE]: 12
        } // 750
      } else if (this.ref.room.energyCapacityAvailable >= 750) {
        parts = {
          [WORK]: 3,
          [CARRY]: 3,
          [MOVE]: 6
        } // 750
      } else if (this.ref.room.energyCapacityAvailable >= 500) {
        parts = {
          [WORK]: 2,
          [CARRY]: 2,
          [MOVE]: 4
        } // 500
        parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
      } else {
        parts = {
          [WORK]: 1,
          [CARRY]: 1,
          [MOVE]: 2
        } // 250
      }

      this.tryToSpawnCreep(parts, {
        memory: {
          role: CreepBuilderEntity.ROLE_NAME
        }
      }, CreepBuilderEntity.ICON)
    }
  }

  spawnRepair(creepList, nSpawns) {
    const repairs = creepList.filter(creep => creep.memory.role === CreepRepairEntity.ROLE_NAME)
    let nRepairs = repairs.length

    if (nRepairs < nSpawns) {
      let parts = null

      if (this.ref.room.energyCapacityAvailable >= 1050) {
        parts = {
          [WORK]: 3,
          [CARRY]: 6,
          [MOVE]: 9
        } // 750
      } else if (this.ref.room.energyCapacityAvailable >= 750) {
        parts = {
          [WORK]: 3,
          [CARRY]: 3,
          [MOVE]: 6
        } // 750
      } else if (this.ref.room.energyCapacityAvailable >= 500) {
        parts = {
          [WORK]: 2,
          [CARRY]: 2,
          [MOVE]: 4
        } // 500
        parts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
      } else {
        parts = {
          [WORK]: 1,
          [CARRY]: 1,
          [MOVE]: 2
        } // 250
      }

      this.tryToSpawnCreep(parts, {
        memory: {
          role: CreepRepairEntity.ROLE_NAME
        }
      }, CreepRepairEntity.ICON)
    }
  }

  spawnScavenger(creepList, nSpawns) {
    const scavengers = creepList.filter(creep => creep.memory.role === CreepScavengerEntity.ROLE_NAME)
    let nScavengers = scavengers.length

    if (nScavengers < nSpawns) {
      let parts = null

      if (this.ref.room.energyCapacityAvailable >= 300 && this.ref.room.storage) {
        parts = {
          [CARRY]: 3,
          [MOVE]: 3
        }
      }

      this.tryToSpawnCreep(parts, {
        memory: {
          role: CreepScavengerEntity.ROLE_NAME
        }
      }, CreepScavengerEntity.ICON)
    }
  }

  spawnHauler(creepList) {
    const rooms = Config.CONTROLLED_ROOMS.concat(Config.RESERVED_ROOMS)
    const gatherers = creepList.filter(creep => creep.memory.role === CreepHaulerEntity.ROLE_NAME)

    for (let roomId of rooms) {
      if (!Game.rooms[roomId]) {
        continue
      }

      let room = Game.rooms[roomId]
      let sources = room.find(FIND_SOURCES)

      if (this.gatherFromMinerals) {
        sources = sources.concat(room.find(FIND_MINERALS))
      }

      for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
        let nHaulersForSource = gatherers.filter(creep => {
          return creep.memory.room === roomId &&
          creep.memory.sourceid === sources[sourceIndex].id
        }).length

        if (nHaulersForSource < 1) {
          let parts = null

          if (this.ref.room.energyCapacityAvailable >= 1000) {
            parts = {
              [CARRY]: 10,
              [MOVE]: 10
            } // 1000
          } else if (this.ref.room.energyCapacityAvailable >= 600) {
            parts = {
              [CARRY]: 6,
              [MOVE]: 6
            } // 600
          } else {
            parts = {
              [CARRY]: 2,
              [MOVE]: 2
            } // 200
          }

          if (this.kickstart) {
            parts = {
              [CARRY]: 1,
              [MOVE]: 1
            }
          }

          this.tryToSpawnCreep(parts, {
            memory: {
              role: CreepHaulerEntity.ROLE_NAME,
              room: roomId,
              sourceid: sources[sourceIndex].id
            }
          }, CreepHaulerEntity.ICON)
        }
      }
    }
  }

  spawnReserver(creepList) {
    const reservers = creepList.filter(creep => creep.memory.role === CreepReserverEntity.ROLE_NAME)

    for (let room of Config.RESERVED_ROOMS) {
      let reserversForRoom = reservers.filter(creep => creep.memory.room === room)
      let needReplacement = true

      if (reserversForRoom.length) {
        for (let reserver of reserversForRoom) {
          if (reserver.ticksToLive > 200) {
            needReplacement = false
          }
        }
      }

      if (!reserversForRoom || needReplacement) {
        let parts = null

        if (this.ref.room.energyCapacityAvailable >= 1300) {
          parts = {
            [CLAIM]: 2,
            [MOVE]: 2
          } // 1300
        } else if (this.ref.room.energyCapacityAvailable >= 650) {
          parts = {
            [CLAIM]: 1,
            [MOVE]: 1
          } // 650
        } else {
          parts = {
            [MOVE]: 1
          } // 50
        }

        this.tryToSpawnCreep(parts, {
          memory: {
            role: CreepReserverEntity.ROLE_NAME,
            room: room
          }
        }, CreepReserverEntity.ICON)
      }
    }
  }

  tryToSpawnCreep(parts, options, namePrefix) {
    options = options || {}
    namePrefix = namePrefix || ''

    if (this.spawnRequested) {
      return
    }

    this.spawnRequested = true

    if (typeof parts === 'object') {
      parts = CreepEntity.generateParts(parts)
    }

    const energyCost = parts.reduce((acc, v) => {
      return acc + BODYPART_COST[v]
    }, 0)

    if (this.ref.room.energyAvailable >= energyCost) {
      let name = `${namePrefix} ${CreepEntity.generateName()}`
      const spawnStatus = this.ref.spawnCreep(parts, name, options)

      if (spawnStatus === OK) {
        Economy.spend(energyCost)
      }
    }
  }
}

 */
class Entity {
  constructor(ref, colony) {
    this.ref = ref
    this.colony = colony
  }
}
/*

colony.room.memory.army.squads[name]:
  leader: creepid
  targetRoom: roomid
  status: 'building' | 'attacking' | 'defending'
  members: [creepid, creepid, ...]
  layout: ??
*/

class Squad {
  constructor(colony, name) {
    const infos = colony.room.memory.army.squads[name]
    this.members = getMembers(infos.members)
    this.leader = getLeader(infos.leader)
    this.targetRoom = infos.targetRoom
    this.status = infos.status
    this.layout = infos.layout
  }

  tick() {
    let leader = this.getLeader()
    this.saveToMemory()
  }

  getMembers(memberIds) {
    let members = []

    for (let memberId of memberIds) {
      let creep = Game.getObjectById(memberId)

      if (creep) {
        members.push(creep)
      }
    }

    return members
  }

  getLeader(leaderId) {
    let currentLeader = Game.getObjectById(leaderId)

    // find new leader if the last one just died
    if ( ! currentLeader) {
      // TODO: Find new leader algorithm

    }
  }

  saveToMemory() {
    colony.room.memory.army.squads[name].layout = this.layout
    colony.room.memory.army.squads[name].status = this.status
    colony.room.memory.army.squads[name].targetRoom = this.targetRoom
    colony.room.memory.army.squads[name].leader = (this.leader) ? this.leader.id : null
    colony.room.memory.army.squads[name].members = this.members.map((creep) => creep.id)
  }
}
/*

memory:
  role: '???'

*/

class Creep extends Entity {
  constructor(ref, colony) {
    super(ref, colony)
  }

  get nWorkParts() {
    return this.ref.body.filter(part => part.type === WORK).length
  }

  moveToDeathArea() {
    this.ref.memory = {
      role: this.ref.memory.role
    }

    let flag = this.ref.room.find(FIND_FLAGS).filter(flag => flag.name === 'Dying')

    if (flag.length) {
      this.ref.moveTo(flag[0], {visualizePathStyle: {stroke: '#FF0000'}})
    }
  }

  isDying() {
    return this.ref.ticksToLive < 45
  }
}
class CreepHelper {

  static getCreepClass(className) {
    for (let creepRole of Config.ROLES) {
      if (className === creepRole.name) {
        return creepRole
      }
    }
  }

  static runCreepRole(creepRef, colony) {
    let creepClass = CreepHelper.getCreepClass(creepRef.memory.role)
    let creep = new creepClass(creepRef, colony)

    // if (creep.isDying()) {
    //   creep.moveToDeathArea()
    // } else {
      creep.tick()
    // }
  }

  static generateName() {
    let vowels = 'a,e,i,o,u,y'.split(',')
    let consonants = 'b,c,d,f,g,gh,j,k,l,m,n,p,q,r,s,st,t,th,v,w,x,z'.split(',')

    let syllables = [].concat(vowels)

    for (let consonant of consonants) {
      for (let vowel of vowels) {
        syllables.push(consonant + vowel)
      }
    }

    let nParts = Math.round(Math.random() * 2 + 2)
    let name = ''

    for (let i = 0; i < nParts; i++) {
      name += syllables[Math.round(Math.random() * (syllables.length - 1))]
    }

    name = name[0].toUpperCase() + name.slice(1)

    if (Game.creeps[name]) {
      return this.generateName()
    }

    return name
  }

  static generateParts(partList) {
    let parts = []

    for (let partName in partList) {
      for (let i = 0, nTimes = partList[partName]; i < nTimes; i++) {
        parts.push(partName)
      }
    }

    return parts
  }
}
/*

memory:
  role: 'Tank'

*/

class Tank extends Creep {

  static get ICON() { return '🛡' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    let hostiles = this.ref.room.find(FIND_HOSTILE_CREEPS)

    if (hostiles.length) {
      if(this.ref.attack(hostiles[0]) === ERR_NOT_IN_RANGE) {
        this.ref.moveTo(hostiles[0])
      }
    } else {
      // go back to spawn to get recycled
      const spawns = this.ref.room.find(FIND_MY_STRUCTURES, {
          filter: { structureType: STRUCTURE_SPAWN }
      })
      this.ref.moveTo(spawns[0])
    }
  }
}
/*

memory:
  role: 'Builder'
  status: 'PICKUP' || 'BUILD'

*/

class Builder extends Creep {

  static get ICON() { return '⚒' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.updateStatus()

    if (this.ref.memory.status === 'PICKUP') {
      this.pickup()
    } else if (this.ref.memory.status === 'BUILD') {
      this.build()
    }
  }

  updateStatus() {
    if (!this.ref.memory.status) {
      this.ref.memory.status = 'PICKUP'
    }

    if (this.ref.carry.energy === this.ref.carryCapacity) {
      this.ref.memory.status = 'BUILD'
    }

    if (this.ref.carry.energy === 0) {
      this.ref.memory.status = 'PICKUP'
    }
  }

  pickup() {
    const storage = this.ref.room.storage

    if (storage && storage.store[RESOURCE_ENERGY] > 0) {
      if(this.ref.withdraw(this.ref.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(this.ref.room.storage, {visualizePathStyle: {stroke: '#ebf442'}})
      }
    } else {
      let droppedEnergy = this.ref.pos.findClosestByRange(FIND_DROPPED_RESOURCES)

      if(this.ref.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ebf442'}})
      }
    }
  }

  build() {
    let targetsToBuild = this.ref.room.find(FIND_CONSTRUCTION_SITES)

    if (targetsToBuild.length && !this.colony.controllerUpgradeIsPriority) {
      // finish the one with the highest progress percent done first
      targetsToBuild.sort((a, b) => {
        return a.progress / a.progressTotal < b.progress / b.progressTotal ? 1 : -1
      })

      let buildStatus = this.ref.build(targetsToBuild[0])

      if (buildStatus === OK) {
        Economy.spend(this.nWorkParts)
      } else if (buildStatus === ERR_NOT_IN_RANGE) {
        this.ref.moveTo(targetsToBuild[0], {visualizePathStyle: {stroke: '#ebf442'}});
      }
    } else {
      // this.ref.say('★ Upgrade')
      this.ref.moveTo(this.colony.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
      let upgradeStatus = this.ref.upgradeController(this.colony.room.controller)

      if (upgradeStatus === OK) {
        Economy.spend(this.nWorkParts)
      }
    }
  }
}
/*

memory:
  role: 'Gatherer'
  reachedTarget: true || undefined
  sourceid: string || undefined

*/

class Gatherer extends Creep {

  static get ICON() { return '⛏' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    if (!this.ref.memory.sourceid) {
      this.ref.memory.sourceid = this.colony.getNewGathererSourceId()
    }

    if (!this.ref.memory.sourceid) return

    let source = Game.getObjectById(this.ref.memory.sourceid)

    if (!source) {
      this.ref.memory.sourceid = null
      return
    }

    if (this.ref.memory.reachedTarget) {
      const harvestStatus = this.ref.harvest(source)

      if (harvestStatus === OK) {
        if (source.mineralType !== undefined) {
          // mineral
        } else {
          // energy
          Economy.mined(this.nWorkParts * 2) // 2 energy per work part per tick
        }
      } else if (harvestStatus === ERR_NOT_IN_RANGE) {
        // no container
        this.ref.moveTo(source, {visualizePathStyle: {stroke: '#0099FF'}})
      }
    } else {
      let container = source.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: { structureType: STRUCTURE_CONTAINER }
      })

      if (container.length) {
        this.ref.moveTo(container[0], {visualizePathStyle: {stroke: '#0099FF'}})
        if (this.ref.pos.x === container[0].pos.x && this.ref.pos.y === container[0].pos.y) {
            this.ref.memory.reachedTarget = true
        }
      } else {
        this.ref.moveTo(source, {visualizePathStyle: {stroke: '#0099FF'}})
        if (this.ref.pos.getRangeTo(source) <= 1) {
          this.ref.memory.reachedTarget = true
        }
      }
    }
  }
}
/*

memory:
  role: 'Hauler' // this.ROLE_NAME
  status: 'PICKUP' || 'DEPOSIT'
  gatherRoom: string // room name

*/

class Hauler extends Creep {

  static get ICON() { return '▙' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.updateStatus()

    if (this.ref.memory.status === 'PICKUP') {
      this.pickup()
    } else if (this.ref.memory.status === 'DEPOSIT') {
      this.deposit()
    }
  }

  updateStatus() {
    if (!this.ref.memory.status) {
      this.ref.memory.status = 'PICKUP'
    }

    const carrySum = Object.values(this.ref.carry).reduce((acc, v) => acc + v)
    if (carrySum === this.ref.carryCapacity) {
      this.ref.memory.status = 'DEPOSIT'
    }

    if (carrySum === 0) {
      this.ref.memory.status = 'PICKUP'
    }
  }

  pickup() {
    let droppedEnergy

    for (let source of this.colony.sources) {
      let droppedEnergiesForSource = source.pos.findInRange(FIND_DROPPED_RESOURCES, 2)

      if (droppedEnergiesForSource.length && droppedEnergiesForSource[0].amount > 100) {
        droppedEnergy = droppedEnergiesForSource[0]
        break
      }
    }


    if (droppedEnergy) {
      if(this.ref.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#00ff00'}})
      }
    } else {
      let container

      for (let source of this.colony.sources) {
        let containersForSource = source.pos.findInRange(FIND_STRUCTURES, 2, {
          filter: { structureType: STRUCTURE_CONTAINER }
        })

        if (containersForSource.length && containersForSource[0].store[RESOURCE_ENERGY] > 100) {
          container = containersForSource[0]
          break
        }
      }

      if (container) {
        let validEnergyTypes = Object.keys(container.store).filter(key => {
          return container.store[key] > 0
        })
        //
        if(this.ref.withdraw(container, validEnergyTypes[0]) == ERR_NOT_IN_RANGE) {
        // if(this.ref.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.ref.moveTo(container, {visualizePathStyle: {stroke: '#ebf442'}})
        }
      }
    }
  }

  deposit() {
    let hasMineral = Object.keys(this.ref.carry).filter(type => type !== RESOURCE_ENERGY).length > 0
    if (hasMineral) {
      this.depositMineral()
    } else {
      this.depositEnergy()
    }
  }

  depositEnergy() {
    // lower number is higher priority
    let priorities = {
      [STRUCTURE_TOWER]: 1,
      [STRUCTURE_SPAWN]: 2,
      [STRUCTURE_EXTENSION]: 2,
      [STRUCTURE_STORAGE]: 999
    }

    let targetsToFill = Object.values(Game.structures).filter(structure => {
      if ([STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER].includes(structure.structureType)) {
        if (structure.energy < structure.energyCapacity) {
          return true
        }
      } else if (structure.structureType === STRUCTURE_STORAGE) {
        if (structure.store[RESOURCE_ENERGY] < structure.storeCapacity) {
          return true
        }
      }

      return false
    })

    if (targetsToFill) {
      targetsToFill.sort((a, b) => {
        if (priorities[a.structureType] > priorities[b.structureType]) {
          return 1
        } else if (priorities[a.structureType] < priorities[b.structureType]) {
          return -1
        } else {
          return this.ref.pos.getRangeTo(a) > this.ref.pos.getRangeTo(b) ? 1 : -1
        }
      })

      if(this.ref.transfer(targetsToFill[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(targetsToFill[0], {visualizePathStyle: {stroke: '#00ff88'}})
      }
    }
  }

  depositMineral() {
    let validEnergyTypes = Object.keys(this.ref.carry).filter(key => {
      return this.ref.carry[key] > 0
    })

    if(this.ref.transfer(this.ref.room.storage, validEnergyTypes[0]) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(this.ref.room.storage, {visualizePathStyle: {stroke: '#00ff88'}})
    }
  }
}
/*

memory:
  role: 'Repair'
  status: 'PICKUP' || 'REPAIR'

*/

class Repair extends Creep {

  static get ICON() { return '🔧' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.updateStatus()

    if (this.ref.memory.status === 'PICKUP') {
      this.pickup()
    } else if (this.ref.memory.status === 'REPAIR') {
      this.repair()
    }
  }

  updateStatus() {
    if (!this.ref.memory.status) {
      this.ref.memory.status = 'PICKUP'
    }

    if (this.ref.carry.energy === this.ref.carryCapacity) {
      this.ref.memory.status = 'REPAIR'
    }

    if (this.ref.carry.energy === 0) {
      this.ref.memory.status = 'PICKUP'
    }
  }

  pickup() {
    const storage = this.ref.room.storage

    if (storage && storage.store[RESOURCE_ENERGY] > 0) {
      if(this.ref.withdraw(this.ref.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(this.ref.room.storage, {visualizePathStyle: {stroke: '#ebf442'}})
      }
    } else {
      let droppedEnergy = this.ref.pos.findClosestByRange(FIND_DROPPED_RESOURCES)

      if(this.ref.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ebf442'}})
      }
    }
  }

  repair() {
    if (!this.ref.memory.repairTargetId) {
      this.ref.memory.repairTargetId = this.colony.getNewRepairTarget()
    }

    if (this.ref.memory.repairTargetId) {
      const repairTarget = Game.getObjectById(this.ref.memory.repairTargetId)

      this.ref.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ff0000'}})
      let repairStatus = this.ref.repair(repairTarget)

      if (repairStatus === OK) {
        Economy.spend(this.nWorkParts)
      }
      
      if (repairTarget.hits === repairTarget.hitsMax) {
        this.ref.memory.repairTargetId = null
      }
    }
  }

  fortifyWalls() {
    let targetsToRepair = this.ref.room.find(FIND_STRUCTURES).filter(structure => {
      const requireFortify = structure.hits < 10000
      const isWall = structure.structureType === STRUCTURE_WALL
      const isRampart = structure.structureType === STRUCTURE_RAMPART
      return requireFortify && (isWall || isRampart)
    })

    if (targetsToRepair.length) {
      // targetsToRepair.sort((a, b) => {
      //   if (a.hits === b.hits) return 0
      //   return a.hits > b.hits ? 1 : -1
      // })

      this.ref.moveTo(targetsToRepair[0], {visualizePathStyle: {stroke: '#ff0000'}})
      let repairStatus = this.ref.repair(targetsToRepair[0])

      if (repairStatus === OK) {
        Economy.spend(this.nWorkParts)
      }
    } else {
      if (Game.flags[`${this.ref.room.name}-chill`]) {
        this.ref.moveTo(Game.flags[`${this.ref.room.name}-chill`], {visualizePathStyle: {stroke: '#ff0000'}})
      }
    }
  }
}
/*

memory:
  role: 'Reserver'
  room: string // room id

*/


class Reserver extends Creep {

  static get ICON() { return '🔒' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    if (this.ref.room.name === this.ref.memory.room) {
      if(this.ref.reserveController(this.ref.room.controller) != OK) {
          this.ref.moveTo(this.ref.room.controller);
      }
    } else {
      let pos = new RoomPosition(25, 25, this.ref.memory.room)
      this.ref.moveTo(pos)
    }
  }
}
/*

memory:
  role: 'Scavenger'
  status: 'PICKUP' || 'REPAIR'

*/

class Scavenger extends Creep {

  static get ICON() { return '☠️' }

  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.updateStatus()

    if (this.ref.memory.status === 'PICKUP') {
      this.pickup()
    } else if (this.ref.memory.status === 'DEPOSIT') {
      this.deposit()
    }
  }

  updateStatus() {
    if (!this.ref.memory.status) {
      this.ref.memory.status = 'PICKUP'
    }

    const carrySum = Object.values(this.ref.carry).reduce((acc, v) => acc + v)
    if (carrySum === this.ref.carryCapacity) {
      this.ref.memory.status = 'DEPOSIT'
    }

    if (carrySum === 0) {
      this.ref.memory.status = 'PICKUP'
    }
  }

  pickup() {
    const tombstones = this.ref.room.find(FIND_TOMBSTONES).filter(tombstone => {
      return Object.values(tombstone.store).reduce((acc, v) => acc + v) > 0
    })

    if (tombstones.length) {
      tombstones.sort((a, b) => {
        return this.ref.pos.getRangeTo(a) > this.ref.pos.getRangeTo(b) ? 1 : -1
      })

      let nearestTombstone = tombstones[0]

      let validEnergyTypes = Object.keys(nearestTombstone.store).filter(key => {
        return nearestTombstone.store[key] > 0
      })

      let withdrawStatus = this.ref.withdraw(nearestTombstone, validEnergyTypes[0])

      if(withdrawStatus == ERR_NOT_IN_RANGE) {
        this.ref.moveTo(nearestTombstone, {visualizePathStyle: {stroke: '#666666'}})
      }
    } else {
      let flag = this.ref.room.find(FIND_FLAGS).filter(flag => flag.name === 'Dying')

      if (flag.length) {
        let container = this.ref.room.lookForAt(LOOK_STRUCTURES, flag[0].pos)

        if (container.length) {
          container = container[0]
          const containerSum = Object.values(container.store).reduce((acc, v) => acc + v)
          if (containerSum > 0) {
            let validEnergyTypes = Object.keys(container.store).filter(key => {
              return container.store[key] > 0
            })

            let withdrawStatus = this.ref.withdraw(container, validEnergyTypes[0])
            if (withdrawStatus === ERR_NOT_IN_RANGE) {
              this.ref.moveTo(container, {visualizePathStyle: {stroke: '#666666'}})
            }
          } else {
            this.ref.memory.status = 'DEPOSIT'

            if (Game.flags[`${this.ref.room.name}-chill`]) {
              this.ref.moveTo(Game.flags[`${this.ref.room.name}-chill`], {visualizePathStyle: {stroke: '#ff0000'}})
            }
          }
        }
      }
    }
  }

  deposit() {
    let validEnergyTypes = Object.keys(this.ref.carry).filter(key => {
      return this.ref.carry[key] > 0
    })

    if(this.ref.transfer(this.ref.room.storage, validEnergyTypes[0]) == ERR_NOT_IN_RANGE) {
      this.ref.moveTo(this.ref.room.storage, {visualizePathStyle: {stroke: '#666666'}})
    }
  }
}
class Spawn extends Entity {
  constructor(ref, colony) {
    super(ref)
    this.colony = colony
  }

  spawnCreep(infos, options) {
    if (!options) options = {}
    if (!options.memory) options.memory = {}

    let creepClass = CreepHelper.getCreepClass(infos.role)

    const namePrefix = creepClass.ICON ? `${creepClass.ICON} ` : ''
    const parts = CreepHelper.generateParts(infos.parts)
    const energyCost = parts.reduce((acc, v) => {
      return acc + BODYPART_COST[v]
    }, 0)

    options.memory.role = creepClass.name
    options.memory.colony = this.colony.name
    options.memory.level = this.colony.colonyLevel

    if (this.ref.room.energyAvailable >= energyCost) {
      let name = namePrefix + CreepHelper.generateName()
      const spawnStatus = this.ref.spawnCreep(parts, name, options)

      if (spawnStatus === OK) {
        // console.log(`Spawned a ${creepClass.name}`)
        Economy.spend(energyCost)
      }
    } else {
      let text = `${creepClass.name}: ${this.ref.room.energyAvailable}/${energyCost}`

      this.ref.room.visual.text(text, this.ref.pos.x, this.ref.pos.y - 1.5, {
        font: '14px'
      })
    }
  }
}
class Tower extends Entity {
  constructor(ref) {
    super(ref)
  }

  tick() {
    let hostiles = this.ref.room.find(FIND_HOSTILE_CREEPS)

    if (hostiles.length) {
      this.attack(hostiles)
    } else {
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
    this.ref.heal(damagedCreeps[0])
  }
}
class Config {
  constructor() {}

  static get COLONIES() {
    return ['Home']
  }

  static get ROLES() {
    return [Gatherer, Builder, Reserver, Hauler, Repair, Tank, Scavenger]
  }

  static get CREEP_BUILD_ORDER() {
    return {
      1: [
        { role: 'Gatherer', parts: { [WORK]: 2, [MOVE]: 2 } },
        { role: 'Hauler', parts: { [CARRY]: 2, [MOVE]: 2 } },
        { role: 'Gatherer', parts: { [WORK]: 2, [MOVE]: 2 } },
        { role: 'Builder', parts: { [CARRY]: 1, [MOVE]: 2, [WORK]: 1 } },
        { role: 'Builder', parts: { [CARRY]: 1, [MOVE]: 2, [WORK]: 1 } },
      ],
      2: [
        { role: 'Gatherer', parts: { [WORK]: 4, [MOVE]: 2 } },
        { role: 'Hauler', parts: { [CARRY]: 2, [MOVE]: 2 } },
        { role: 'Gatherer', parts: { [WORK]: 4, [MOVE]: 2 } },
        { role: 'Builder', parts: { [CARRY]: 2, [MOVE]: 3, [WORK]: 1 } },
        { role: 'Builder', parts: { [CARRY]: 2, [MOVE]: 3, [WORK]: 1 } },
        { role: 'Builder', parts: { [CARRY]: 2, [MOVE]: 3, [WORK]: 1 } }
      ],
      3: [
        { role: 'Gatherer', parts: { [WORK]: 5, [MOVE]: 2 } },
        { role: 'Hauler', parts: { [CARRY]: 5, [MOVE]: 5 } },
        { role: 'Gatherer', parts: { [WORK]: 5, [MOVE]: 2 } },
        { role: 'Builder', parts: { [CARRY]: 3, [MOVE]: 5, [WORK]: 2 } },
        { role: 'Builder', parts: { [CARRY]: 3, [MOVE]: 5, [WORK]: 2 } },
        { role: 'Repair', parts: { [CARRY]: 2, [MOVE]: 3, [WORK]: 1 } },
      ],
      4: [
        { role: 'Gatherer', parts: { [WORK]: 5, [MOVE]: 2 } },
        { role: 'Hauler', parts: { [CARRY]: 6, [MOVE]: 6 } },
        { role: 'Gatherer', parts: { [WORK]: 5, [MOVE]: 2 } },
        { role: 'Hauler', parts: { [CARRY]: 6, [MOVE]: 6 } },
        { role: 'Repair', parts: { [CARRY]: 4, [MOVE]: 8, [WORK]: 5 } },
        { role: 'Builder', parts: { [CARRY]: 5, [MOVE]: 10, [WORK]: 5 } },
        { role: 'Builder', parts: { [CARRY]: 5, [MOVE]: 10, [WORK]: 5 } },
        { role: 'Builder', parts: { [CARRY]: 5, [MOVE]: 10, [WORK]: 5 } },
        { role: 'Builder', parts: { [CARRY]: 5, [MOVE]: 10, [WORK]: 5 } },
      ]
    }
  }
}
// console.log(`===== ${Game.time} =====`)

MemoryCleaner.clearDeadCreeps()

let Economy = new EconomySingleton()

for (let colonyName of Config.COLONIES) {
  (new Colony(colonyName)).tick()
}

Economy.updateAndSave()
Economy.render()
