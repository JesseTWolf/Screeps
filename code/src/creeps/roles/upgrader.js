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
            //Deprecated
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
            
           const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                 creep.moveTo(target);
                }
            }
            else {
                var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                                && s.store[RESOURCE_ENERGY] > 0
                });
                if(containers && creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers);
                }  
                console.log(containers);
            }

            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
    }
};