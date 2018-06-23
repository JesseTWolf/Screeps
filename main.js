var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    for(var name in Game.rooms) {
        // console.log('Room "' +name+'" has ' +Game.rooms[name].energyAvailable+' energy');
    }
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // console.log('Harvesters: ' + harvesters.length);
    
      if(harvesters.length < 2 && Game.rooms[name].energyAvailable >= 200) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}});        
        }
        
        if(Game.spawns['Home'].spawning) { 
            var spawningCreep = Game.creeps[Game.spawns['Home'].spawning.name];
            Game.spawns['Home'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Home'].pos.x + 1, 
                Game.spawns['Home'].pos.y, 
                {align: 'left', opacity: 0.8});
        }
   
    
    
    // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // // console.log('Harvesters: ' + harvesters.length);
    
    // if(harvesters.length < 2) {
    //     var newName = 'Harvester' + Game.time;
    //     console.log('Spawning new harvester: ' + newName);
    //     Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE], newName, 
    //         {memory: {role: 'harvester'}});        
    // }
    
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    
    if(builders.length < 4 && Game.rooms[name].energyAvailable >= 200) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});        
    }
    
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    
    if(upgraders.length < 4 && Game.rooms[name].energyAvailable >= 200) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});        
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
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}