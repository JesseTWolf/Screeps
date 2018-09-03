/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * letmod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
let roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
    //   if(creep.memory.working == true && creep.carry.energy == 0) {
    //     creep.memory.working = false;
    //   }
    //   else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
    //     creep.memory.working = true;
    //   }

    //   if(creep.memory.working == true) {
        //   lettargets = creep.room.find(FIND_STRUCTURES, {
        //             filter: (structure) => {
        //                 return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        //                     structure.energy < structure.energyCapacity;
        //             }
        //     });
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            //     }
            // }
        // }
    //   else{
        // letsource = creep.pos.findClosestByPath(FIND_SOURCES);
        // console.log(source);
        if(!creep.memory.harvestPointId) {
            let occupiedHarvestPoints = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').map((el) => el.memory.harvestPointId);
            let closestSource = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => occupiedHarvestPoints.indexOf(source.id) == -1});
            creep.memory.harvestPointId = closestSource.id;
        }
        let source = Game.getObjectById(creep.memory.harvestPointId);
        // if(source) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            // creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}})
        //   creep.moveTo(creep.memory, {visualizePathStyle: {stroke: '#ffffff'}}););

        // }
        // }
    }
};

module.exports = roleMiner;
