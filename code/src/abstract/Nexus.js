class Nexus {
  constructor(roomName) {
    this.name = roomName;
    this.spawnName = roomName.find(FIND_SPAWNS);
    this.sourceIds = roomName.find(FIND_SOURCES);
    this.containers = this.getContainers();
  }

  getContainers() {
    let containerList = find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER
                  && s.store[RESOURCE_ENERGY] > 200
    });
    return containerList;  
  }
}
