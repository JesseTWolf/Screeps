// class Gatherer extends Creep{
//
//   constructor(ref, colony) {
//     super(ref, colony)
//   }
//
//   pickupEnergy(creep) {
//     let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
//       filter: (s) => s.structureType == STRUCTURE_CONTAINER
//                   && s.store[RESOURCE_ENERGY] > 200
//     });
//
//     let droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
//       filter: (d) => d.amount >= 100
//     });
//
//     let pickupDropped;
//     if(droppedEnergy.length) {
//         pickupDropped = creep.pickup(droppedEnergy[0]);
//         // console.log(pickupDropped);
//     }
//
//     if(droppedEnergy.length > 0 && pickupDropped == ERR_NOT_IN_RANGE) {
//         creep.moveTo(droppedEnergy[0]);
//     }
//
//     if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(container)
//       creep.say('⛋')
//     }
//   }
//
//   upgradeRoom(creep) {
//     if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
//       creep.moveTo(creep.room.controller);
//     }
//   }
//
//   repairRoads(creep) {
//
//   }
//
// }
