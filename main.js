var roleHarvester = require('roleHarvester');
var roleUpgrader = require('roleUpgrader');
var roleBuilder = require('roleBuilder');
var utilities = require('utilities');
var boxKicker = require('roleBoxKicker');
var miner = require('roleMiner');

module.exports.loop = function () {

    const roomName = 'W8N3';

    const sourceIds = ['26f20772347f879', '71ac0772347ffe6'];
    // console.log(sourceIds[0]);
    
    var totalCreeps = Object.keys(Game.creeps).length;

    //Make sure to have minimum of 8 harvesters, 1 upgrader, 1 builder, and 10 boxKickers.
    var minimimumNumberOfHarvesters = 1;
    var minimimumNumberOfUpgraders = 2;
    var minimimumNumberOfBuilders = 2;
    var minimimumNumberOfBoxKickers = 4;
    var minimimumNumberOfMiners = 2;
    //Will sum up number of creeps. Find number of harvesters currently.
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role == 'boxKicker');
    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    
    console.log('Harvesters: ' + numberOfHarvesters);
    console.log('Upgraders: ' + numberOfUpgraders);
    console.log('Builders: ' + numberOfBuilders);
    console.log('BoxKickers: ' + numberOfBoxKickers);
    console.log('Miners: ' + numberOfMiners);
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

    var minerFlag = null;
    if(numberOfMiners < minimimumNumberOfMiners) {
        minerFlag = true;
    }
    else {
        minerFlag = false;
    }

    for(var name in Game.rooms) {
        console.log('Room "' +name+'" has ' +Game.rooms[name].energyAvailable+' energy');
    }

    console.log(_.filter(Game.creeps, creep => creep.memory.mineSource == sourceIds[0]));
    // if(numberOfHarvesters < minimimumNumberOfHarvesters)
    // if(harvesterFlag || Game.creeps == 0)
    if(totalCreeps == 0) {
        // if(Game.rooms[name].energyAvailable > 550) {
        //     Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE], 
        //         newName,
        //         {memory: { role: 'harvester', working: false } });
        // }
        // else if(Game.rooms[name].energyAvailable > 300 && Game.rooms[name].energyAvailable <= 550) {
        //     Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,MOVE,MOVE,MOVE], 
        //         newName,
        //         {memory: {role: 'harvester', working:false} });
        // }
        // else {
            Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE,MOVE], 
                newName,
                {memory: {role: 'harvester', working:false} });
        // }
    }
    else if(minerFlag) {
        if(Game.rooms[name].energyAvailable < 650) {
            Game.spawns['Home'].spawnCreep([WORK,WORK,MOVE], 
                newName,
                {memory: {role: 'miner', working: false}});
        }
        else {
        Game.spawns['Home'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE], 
                newName,
                {memory: {role: 'miner', working: false}});
        }
    }
    else if(boxKickerFlag) {
        if(Game.rooms[name].energyAvailable >= 550) {
        Game.spawns['Home'].spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], 
            newName,
            {memory: {role: 'boxKicker', working: false}});
        }
        else {
            Game.spawns['Home'].spawnCreep([CARRY,CARRY,MOVE,MOVE], 
                newName,
                {memory: {role: 'boxKicker', working: false}});
        }
    }
    // else if(numberOfUpgraders < minimimumNumberOfUpgraders)
    else if(upgraderFlag) {
        if(Game.rooms[name].energyAvailable <= 400) {
            Game.spawns['Home'].spawnCreep([WORK,CARRY,MOVE,MOVE], 
                    newName,
                    {memory: {role: 'upgrader', working: false}});
        }
        else {
        Game.spawns['Home'].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], 
                newName,
                {memory: {role: 'upgrader', working: false}});
        }
    }

    // if(builders.length < 4 && Game.rooms[name].energyAvailable >= 200 && numberOfHarvesters >= minimimumNumberOfHarvesters) {
    else if(builderFlag) {
        Game.spawns['Home'].spawnCreep([ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 
            newName,
            {memory: {role: 'builder', working:false }});
    }
// || minimimumNumberOfBuilders < creep.room.find(FIND_CONSTRUCTION_SITES)
    // console.log(creep.room.find(FIND_CONSTRUCTION_SITES));
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
        if(creep.memory.role == 'miner') {
            miner.run(creep);
        }
    }

    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    // function defendRoom(roomName) {
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    // }
}
