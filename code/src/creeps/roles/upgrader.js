var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
        else if(creep.memory.working == false) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
    }
};