var roleBoxKicker = {

    /** @param {Creep} creep **/
    run: function(creep) {
      if(creep.memory.working == true && creep.carry.energy == 0) {
        creep.memory.working = false;
      }
      else if(creep.memory.working == false && creep.carry.energy >= (.5 * creep.carryCapacity)) {
        creep.memory.working = true;
      }

      if(creep.memory.working == true) {
          var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                //return
                 structure.energy < structure.energyCapacity;
                }
            });
          // var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          //   filter: (s) => s.structureType == STRUCTURE_CONTAINER
          //                 && s.store[RESOURCE_ENERGY] > 0
          //   });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            // else if(Storage.isActive()) {
            //     if(creep.transfer(sotrage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(storage, {visualizePathStyle:  {stroke: '#ffffff'}});
            //     }
            // }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }

        }
      else{
        // if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(container)
        // }
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

        // var source = creep.pos.findClosestByPath(FIND_SOURCES);
        // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(source);
        // }
      }
    }
};
module.exports = roleBoxKicker;
