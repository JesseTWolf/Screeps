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
var roleBoxKicker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let currentCapacity = Game.spawns['spawnW5N8'].room.energyAvailable;
        let maxCapacity = Game.spawns['spawnW5N8'].room.energyCapacity;
        if(creep.memory.working == true) {
            let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });

            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(targets, {visualizePathStyle: {stroke: 'ffffff'}});
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                }
            }
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
        else if(creep.memory.working == false) {

            var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if(containers && creep.withdraw(containers, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
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
            
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
	}
};var roleBuilder = {

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
};var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        let currentCapacity = Game.spawns['spawnW5N8'].room.energyAvailable;
        let maxCapacity = Game.spawns['spawnW5N8'].room.energyCapacity;
        if(creep.memory.working == true) {
            let targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });

            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(targets, {visualizePathStyle: {stroke: 'ffffff'}});
            }
            else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                }
            }
            if(creep.store[RESOURCE_ENERGY] == 0){
                creep.memory.working = false;
            }
        }
        else if(creep.memory.working == false) {

            /*
            // Basic bitch setup
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
            */
            var containers = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if(containers && creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
            }    
            else {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if(target) {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    }
                }
            }

            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');

            if(containers == null && miners == null) {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
	}
};
var roleMiner = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvestPointId) {
            let occupiedHarvestPoints = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner').map((el) => el.memory.harvestPointId);
            let closestSource = creep.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => occupiedHarvestPoints.indexOf(source.id) == -1});
            creep.memory.harvestPointId = closestSource.id;
        }
        let source = Game.getObjectById(creep.memory.harvestPointId);

        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
	}
};var roleUpgrader = {

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
};let maxNumHarvesters = 2;
let maxNumUpgraders = 3;
let maxNumBuilders = 2;
let maxNumMiners = 2;
let maxNumBoxKickers = 3;

// Variables for all my creep body sizes.
let baby = [WORK,CARRY,MOVE,MOVE];
// Uses up 500 energy
let level2 = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
// Uses up 750 energy
let level3 = [WORK,WORK,WORK,CARRY,CARRY,CARRY,
    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
// Uses up 1250 energy
let monster = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];

// Basic miner uses up 600
let basicMiner = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE];

// Print out number of all roles. 
// Currently Harvesters, Upgraders, and Builders
var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);

var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
    console.log('Miners: ' + miners.length);

var boxKickers = _.filter(Game.creeps, (creep) => creep.memory.role == 'boxKicker');
    console.log('BoxKickers: ' + boxKickers.length);    

var totalNumCreep = _.filter(Game.creeps, (creep)).length;
console.log('Total Creeps: ' + totalNumCreep);

// Print out the total amount of energy available within spawn and all extensions.
var energyAvailable = Game.rooms.W5N8.energyAvailable;
    console.log('Total Energy: ' + energyAvailable);

// Function to spawn all my creeps.
function spawnNew(room,role) {
    var newName = role + Game.time;
    // Baby uses only 300 energy to create.
    let body;
    if(energyAvailable >= 300) {
        body = baby
    }
    if(energyAvailable >= 500) {
        body = level2;
    }
    if(energyAvailable >= 750) {
        body = level3;
    }
    if(energyAvailable >= 1250) {
        body = monster;
    }
    if(role == 'miner') {
        body = basicMiner;
    }

    console.log('Spawning new ' + role + ' ' + newName + 'body: ' + body);
    Game.spawns[room].spawnCreep(body, newName, 
        {memory: {role: role, working: true}});
}

//function bodyDesign(role) {
//    if(role == 'miner') {
//      
//    }
//}

// Priority for harvesters is numero uno!
if(totalNumCreep < 2) {
    spawnNew('spawnW5N8','harvester');    
}
else if(miners.length < maxNumMiners) {
    spawnNew('spawnW5N8','miner');
}
else if(boxKickers.length < maxNumBoxKickers) {
    spawnNew('spawnW5N8','boxKicker');
}
else if(upgraders.length < maxNumUpgraders){
    spawnNew('spawnW5N8','upgrader');
}
else if(builders.length < maxNumBuilders){
    spawnNew('spawnW5N8','builder');
}

if(Game.spawns['spawnW5N8'].spawning) { 
    var spawningCreep = Game.creeps[Game.spawns['spawnW5N8'].spawning.name];
    Game.spawns['spawnW5N8'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['spawnW5N8'].pos.x + 1, 
        Game.spawns['spawnW5N8'].pos.y, 
        {align: 'left', opacity: 0.8});
}

for(var name in Memory.creeps) {
    if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
    }
}

for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
        roleBuilder.run(creep);
    }
    if(creep.memory.role == 'miner') {
        roleMiner.run(creep);
    }
    if(creep.memory.role == 'boxKicker') {
        roleBoxKicker.run(creep);
    }
}

//for(var name in Game.creeps) {
//    var creep = Game.creeps[name];
//    if(creep.memory.role == 'Harvesters') {
//        creep.run();
//    }    
//}