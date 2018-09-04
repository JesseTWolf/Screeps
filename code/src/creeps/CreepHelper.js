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
