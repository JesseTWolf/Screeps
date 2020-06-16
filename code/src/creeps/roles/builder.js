var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /**
	    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say('🚧 build');
        }
        */
        
	    if(creep.memory.working == true) {
            // Find out all current repair sites. Avoiding walls for now.
            let repairSites = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.structureType != STRUCTURE_WALL && object.hits < object.hitsMax
            });
            repairSites.sort((a,b) => a.hits - b.hits);

            console.log('RepairSite 1: ' + repairSites[0]);
            
            // Find all current construction sites.
            let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

            console.log('ConstructionSite: ' + constructionSites.length);

            // If there are some construction sites then go work on them.
            
            if(constructionSites.length > 0) {
                if(creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if(repairSites.length > 0) {
                if(creep.repair(repairSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairSites[0]);
                }
            }
            else {
                let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                        }
                    });
    
                if(targets) {
                    if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    creep.moveTo(targets, {visualizePathStyle: {stroke: 'ffffff'}});
                }
            }
            // If creeps storage goes to 0 then set working to false. This will prompt them to go refill.
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
        // If our creep's working status is false
        else if(creep.memory.working == false) {
            // Find our sources
            // TODO: Get this updated to be closest to this particular creep.
            var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
                        && s.store[RESOURCE_ENERGY] > 0
            });
            if(creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers);
            }
            else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                    if(target) {
                        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                
            }
            // Once the Creep is back to storage capacity, set working back to true.
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
	}
};