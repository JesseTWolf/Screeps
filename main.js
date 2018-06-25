var roleHarvester = require('roleHarvester');
var roleUpgrader = require('roleUpgrader');
var roleBuilder = require('roleBuilder');
var utilities = require('utilities');
var boxKicker = require('roleBoxKicker');
var miner = require('miner');

module.exports.loop = function () {
    
    //Make sure to have minimum of 8 harvesters, 1 upgrader, 1 builder, and 10 boxKickers.
    var minimimumNumberOfHarvesters = 4;
    var minimimumNumberOfUpgraders = 4;
    var minimimumNumberOfBuilders = 1;
    var minimimumNumberOfBoxKickers = 4;
    //Will sum up number of creeps. Find number of harvesters currently.
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role == 'boxKicker');
    
    console.log(numberOfHarvesters);
    //Generate new name, currently just game time.
    var newName = utilities.newName();
    
    var harvesterFlag = null;
    if(numberOfHarvesters < minimimumNumberOfHarvesters) {
        harvesterFlag = true;
    }
    else {
        harvesterFlag = false;
    }

    var upgraderFlag = null;
    if(numberOfUpgraders < minimimumNumberOfUpgraders) {
        upgraderFlag = true;
    }
    else {
        upgraderFlag = false;
    }

    var builderFlag = null;
    if(numberOfBuilders < minimimumNumberOfBuilders) {
        builderFlag = true;
    }
    else {
        builderFlag = false;
    }

    var boxKickerFlag = null;
    if(numberOfBoxKickers < minimimumNumberOfBoxKickers) {
        boxKickerFlag = true;
    }
    else {
        boxKickerFlag = false;
    }

    for(var name in Game.rooms) {
        console.log('Room "' +name+'" has ' +Game.rooms[name].energyAvailable+' energy');
    }

    // if(numberOfHarvesters < minimimumNumberOfHarvesters)
    if(harvesterFlag) {
        if(Game.rooms[name].energyAvailable > 550) {
            Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: { role: 'harvester', working: false } });
        }
        else if(Game.rooms[name].energyAvailable <= 550) {
            Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'harvester', working:false} });
        }
    }
    else if(boxKickerFlag) {
        if(Game.rooms[name].energyAvailable >= 400) {
        Game.spawns['Home'].spawnCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'boxKicker', working: false}});
        }
        else {
            Game.spawns['Home'].spawnCreep([CARRY,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'boxKicker', working: false}});
        }
    }
    // else if(numberOfUpgraders < minimimumNumberOfUpgraders)
    else if(upgraderFlag) {
        if(Game.rooms[name].energyAvailable <= 400) {
            Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
                {memory: {role: 'upgrader', working: false}});
        }
        else {
        Game.spawns['Home'].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            // {memory: {role: 'upgrader', working: false}});
            {memory: {role: 'upgrader', working: false}});
        }
    }

    // if(builders.length < 4 && Game.rooms[name].energyAvailable >= 200 && numberOfHarvesters >= minimimumNumberOfHarvesters) {
    else if(builderFlag) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Home'].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'builder', working:false }
            });
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
        if(creep.memory.role == 'boxKicker') {
            boxKicker.run(creep);
        }
    }

    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
  }
