/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.working == true && creep.carry.energy == 0) {
        creep.memory.working = false;
      }
      else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
      }

      if(creep.memory.working == true) {
          var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        // if(creep.transfer(Game.spawns.Home, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(Game.spawns.Home)};
    //   }
      else{
        var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
};
	   // if(creep.carry.energy < creep.carryCapacity) {
    //         var sources = creep.room.find(FIND_SOURCES);
    //         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    //         }
    //     }
    //     if(creep.carry.energy == creep.carryCapacity) {
    //         var targets = creep.room.find(FIND_STRUCTURES, {
    //                 filter: (structure) => {
    //                     return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
    //                         structure.energy < structure.energyCapacity;
    //                 }
    //         });
    //         if(targets.length > 0) {
    //             if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
    //             }
    //         }
    //     }
            // if(creep.transfer(Game.spawns['Home'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(Game.spawns['Home']);
            // }
//     }
// };

module.exports = roleHarvester;
