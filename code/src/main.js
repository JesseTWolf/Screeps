var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    console.log('Upgraders: ' + upgraders.length);

if(harvesters.length < 2) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['spawnW5N8'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'harvester'}});        
}
else if(upgraders.length < 2){
    var newName = 'Upgrader' + Game.time;
    console.log('Spawning new upgrader: ' + newName);
    Game.spawns['spawnW5N8'].spawnCreep([WORK,CARRY,MOVE], newName, 
        {memory: {role: 'upgrader'}});
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
}