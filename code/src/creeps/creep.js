class Creep {
    constructor(ref, colony) {
        this.ref = ref;
        this.colony = colony;
    }

    pickupEnergy() {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }   
        }
    }

    rechargeEnergy() {
        let freeCapacity = Game.spawns['spawnW5N8'].store.getFreeCapacity(RESOURCE_ENERGY);
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
                     structure.energy < structure.energyCapacity;
                    }
                });

            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(targets, {visualizePathStyle: {stroke: 'ffffff'}});
            }
            console.log(freeCapacity);
        }
    }
}
