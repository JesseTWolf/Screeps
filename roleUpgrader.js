/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.working == true && creep.carry.energy == 0) {
        creep.memory.working = false;
      }
      else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
      }

      if(creep.memory.working == true) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
        }
      }
        else{
          var source = creep.pos.findClosestByPath(FIND_SOURCES);
          if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
          }
        }

  }
};
//         if(creep.carry.energy == 0) {
//             var sources = creep.room.find(FIND_SOURCES);
//             if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(sources[1]);
//             }
//         }

//         // else {
//             if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(creep.room.controller);
//             }
//         // }
// 	}
// };

module.exports = roleUpgrader;
