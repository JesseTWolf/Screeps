/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
// var roleUpgrader = require('roleUpgrader');

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.memory.working == true && creep.carry.energy == 0) {
			creep.memory.working = false;
		}
		else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
			// console.log('Hoopla');
			creep.memory.working = true;
		}

		if(creep.memory.working == true) {
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			// console.log(targets);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
			}
			else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			  }
		}
		else {
      var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && s.store[RESOURCE_ENERGY] > 0
      });
			var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
				filter: (d) => d.amount >= 100
			});
      if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container)
        creep.say('⛋')
      }
			// console.log(JSON.stringify(droppedEnergy));
			if(droppedEnergy.length) {
				var pickupDropped = creep.pickup(droppedEnergy[0]);
				// console.log(pickupDropped);
			}

			if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
				creep.moveTo(droppedEnergy[0]);
			}

			// var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
	    }


	    // if(creep.memory.building && creep.carry.energy == 0) {
        //     creep.memory.building = false;
        //     creep.say('🔄 harvest');
	    // }
	    // if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	    //     creep.memory.building = true;
	    //     creep.say('🚧 build');
	    // }
	    // if(creep.memory.building) {
	    //     var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //     if(targets.length) {
        //         if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     }
	    // }
	   // else {
	   //     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    //             creep.moveTo(creep.room.controller);
    //         }
	   // }
	}
};
module.exports = roleBuilder;
