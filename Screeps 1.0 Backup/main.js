let roleHarvester = require('roleHarvester');
let roleUpgrader = require('roleUpgrader');
let roleBuilder = require('roleBuilder');
let utilities = require('utilities');
let boxKicker = require('roleBoxKicker');
let miner = require('roleMiner');

module.exports.loop = function () {

    const roomName = 'W1N8';
    const spawnName = 'Spawn-W1N8';

    const sourceIds = ['ab9e0774d1c107c', 'f5680774d1c1fe8'];
    // console.log(sourceIds[0]);

    let totalCreeps = Object.keys(Game.creeps).length;

    //Make sure to have minimum of 8 harvesters, 1 upgrader, 1 builder, and 10 boxKickers.
    let minimimumNumberOfHarvesters = 1;
    let minimimumNumberOfUpgraders = 1;
    let minimimumNumberOfBuilders = 2;
    let minimimumNumberOfBoxKickers = 2;
    let minimimumNumberOfMiners = 2;

    //Will sum up number of creeps. Find number of harvesters currently.
    let numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    let numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    let numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    let numberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role == 'boxKicker');
    let numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');

    console.log('Harvesters: ' + numberOfHarvesters);
    console.log('Upgraders: ' + numberOfUpgraders);
    console.log('Builders: ' + numberOfBuilders);
    console.log('BoxKickers: ' + numberOfBoxKickers);
    console.log('Miners: ' + numberOfMiners);
    //Generate new name, currently just game time.
    let newName = utilities.newName();

    let harvesterFlag = null;
    if(numberOfHarvesters < minimimumNumberOfHarvesters) {
        harvesterFlag = true;
    }
    else {
        harvesterFlag = false;
    }

    let upgraderFlag = null;
    if(numberOfUpgraders < minimimumNumberOfUpgraders) {
        upgraderFlag = true;
    }
    else {
        upgraderFlag = false;
    }

    let builderFlag = null;
    if(numberOfBuilders < minimimumNumberOfBuilders) {
        builderFlag = true;
    }
    else {
        builderFlag = false;
    }

    let boxKickerFlag = null;
    if(numberOfBoxKickers < minimimumNumberOfBoxKickers) {
        boxKickerFlag = true;
    }
    else {
        boxKickerFlag = false;
    }

    let minerFlag = null;
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
            Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE,MOVE],
                newName,
                {memory: {role: 'harvester', working:false} });
        // }
    }
    else if(minerFlag) {
        if(Game.rooms[name].energyAvailable >= 600) {
          Game.spawns[spawnName].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
                  'Miner ' + newName,
                  {memory: {role: 'miner', working: false}});
        }
        else {
          Game.spawns[spawnName].spawnCreep([WORK,WORK,MOVE],
              'Miner ' + newName,
              {memory: {role: 'miner', working: false}});
        }
    }
    else if(boxKickerFlag) {
        if(Game.rooms[name].energyAvailable >= 1010) {
          Game.spawns[spawnName].spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
            WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            'Kicker of Boxes ' + newName,
            {memory: {role: 'boxKicker', working: false}});
        }
        else if(Game.rooms[name].energyAvailable >= 550) {
        Game.spawns[spawnName].spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
            'Kicker of Boxes ' + newName,
            {memory: {role: 'boxKicker', working: false}});
        }
        else {
            Game.spawns[spawnName].spawnCreep([CARRY,CARRY,MOVE,MOVE],
                'Kicker of Boxes ' + newName,
                {memory: {role: 'boxKicker', working: false}});
        }
    }
    // else if(numberOfUpgraders < minimimumNumberOfUpgraders)
    else if(upgraderFlag) {
        // if(Game.rooms[name].energyAvailable >= 1600) {
        //   Game.spawns[spawnName].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
        //     ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
        //     ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
        //           'Upgrader ' + newName,
        //           {memory: {role: 'upgrader', working: false}});
        // }
        if(Game.rooms[name].energyAvailable >= 800) {
          Game.spawns[spawnName].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
          ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                  'Upgrader ' + newName,
                  {memory: {role: 'upgrader', working: false}});
        }
        else if(Game.rooms[name].energyAvailable >= 400) {
          Game.spawns[spawnName].spawnCreep([ATTACK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE],
                  'Upgrader ' + newName,
                  {memory: {role: 'upgrader', working: false}});
        }
        else {
          Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE,MOVE],
                  'Upgrader ' + newName,
                  {memory: {role: 'upgrader', working: false}});
        }
    }

    // if(builders.length < 4 && Game.rooms[name].energyAvailable >= 200 && numberOfHarvesters >= minimimumNumberOfHarvesters) {
    else if(builderFlag) {
        if(Game.rooms[name].energyAvailable >= 1460) {
          Game.spawns[spawnName].spawnCreep([ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
          ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
              'Builder ' + newName,
              {memory: {role: 'builder', working:false }});
        }
        else if(Game.rooms[name].energyAvailable >= 730) {
          Game.spawns[spawnName].spawnCreep([ATTACK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
              'Builder ' + newName,
              {memory: {role: 'builder', working:false }});
        }
        else {
          Game.spawns[spawnName].spawnCreep([WORK,CARRY,MOVE,MOVE],
                  'Builder ' + newName,
                  {memory: {role: 'builder', working: false}});
        }
    }
// || minimimumNumberOfBuilders < creep.room.find(FIND_CONSTRUCTION_SITES)
    // console.log(creep.room.find(FIND_CONSTRUCTION_SITES));
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
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

    for(let i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    // function defendRoom(roomName) {
        let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            let username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            let towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    // }
}
