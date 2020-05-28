let maxNumHarvesters = 2;
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