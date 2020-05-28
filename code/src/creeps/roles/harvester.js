var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let freeCapacity = Game.spawns['spawnW5N8'].store.getFreeCapacity(RESOURCE_ENERGY);
        //console.log(Game.structures.)

	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else if(freeCapacity > 0){

            let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    //return
                     structure.energy < structure.energyCapacity;
                    }
                });

            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(targets, {visualizePathStyle: {stroke: 'ffffff'}});
            }
            console.log(freeCapacity);
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
	}
};
