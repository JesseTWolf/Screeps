let maxNumHarvesters = 2;
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