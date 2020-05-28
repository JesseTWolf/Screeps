class Creep {
    
}var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};var roleHarvester = {
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
            
            //if(creep.transfer(Game.spawns['spawnW5N8'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //        creep.moveTo(Game.spawns['spawnW5N8']);
            //    }
            //}
            //else {
            //    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            //        creep.moveTo(creep.room.controller);
            //    }
            //}
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
var roleMiner = {
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
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
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
            if(creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
                creep.memory.working = true;
            }
        }
    }
};let maxNumHarvesters = 2;
let maxNumUpgraders = 3;
let maxNumBuilders = 2;

// Variables for all my creep body sizes.
let baby = [WORK,CARRY,MOVE];
let level2 = [WORK,WORK,CARRY,MOVE,MOVE];
let level3 = [WORK,WORK,CARRY,MOVE,MOVE];

// Print out number of all roles. 
// Currently Harvesters, Upgraders, and Builders
var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    console.log('Builders: ' + builders.length);    

// Print out the total amount of energy available within spawn and all extensions.
var energyAvailable = Game.rooms.W5N8.energyAvailable;
    console.log('Total Energy: ' + energyAvailable);

// Function to spawn all my creeps.
function spawn(room,role) {
    var newName = role + Game.time;
    // Baby uses only 250 energy to create.
    let body = baby;
    if(energyAvailable >= 350) {
        body = level2;
    }
    else if(energyAvailable >= 500) {
        body = level3;
    }
    console.log('Spawning new ' + role + ' ' + newName);
    Game.spawns[room].spawnCreep(body, newName, 
        {memory: {role: role}});
}

//function bodyDesign(role) {
//
//}

// Priority for harvesters is numero uno.
if(harvesters.length < maxNumHarvesters) {
    spawn('spawnW5N8','harvester');    
}
else if(upgraders.length < maxNumUpgraders){
    spawn('spawnW5N8','upgrader');
}
else if(builders.length < maxNumBuilders){
    spawn('spawnW5N8','builder');
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
    if(creep.memory.role == 'builder'){
        roleBuilder.run(creep);
    }
}