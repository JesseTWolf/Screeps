module.exports.loop = function () {

    const roomName = 'W1N8';
    const spawnName = 'Spawn-W1N8';

    const sourceIds = ['ab9e0774d1c107c', 'f5680774d1c1fe8'];
    // console.log(sourceIds[0]);

    lettotalCreeps = Object.keys(Game.creeps).length;

    //Make sure to have minimum of 8 harvesters, 1 upgrader, 1 builder, and 10 boxKickers.
    letminimimumNumberOfHarvesters = 1;
    letminimimumNumberOfUpgraders = 4;
    letminimimumNumberOfBuilders = 2;
    letminimimumNumberOfBoxKickers = 2;
    letminimimumNumberOfMiners = 2;

    //Will sum up number of creeps. Find number of harvesters currently.
    letnumberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    letnumberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    letnumberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    letnumberOfBoxKickers = _.sum(Game.creeps, (c) => c.memory.role == 'boxKicker');
    letnumberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');

    console.log('Harvesters: ' + numberOfHarvesters);
    console.log('Upgraders: ' + numberOfUpgraders);
    console.log('Builders: ' + numberOfBuilders);
    console.log('BoxKickers: ' + numberOfBoxKickers);
    console.log('Miners: ' + numberOfMiners);
    //Generate new name, currently just game time.
    letnewName = utilities.newName();

    letharvesterFlag = null;
    if(numberOfHarvesters < minimimumNumberOfHarvesters) {
        harvesterFlag = true;
    }
    else {
        harvesterFlag = false;
    }

    letupgraderFlag = null;
    if(numberOfUpgraders < minimimumNumberOfUpgraders) {
        upgraderFlag = true;
    }
    else {
        upgraderFlag = false;
    }

    letbuilderFlag = null;
    if(numberOfBuilders < minimimumNumberOfBuilders) {
        builderFlag = true;
    }
    else {
        builderFlag = false;
    }

    letboxKickerFlag = null;
    if(numberOfBoxKickers < minimimumNumberOfBoxKickers) {
        boxKickerFlag = true;
    }
    else {
        boxKickerFlag = false;
    }

    letminerFlag = null;
    if(numberOfMiners < minimimumNumberOfMiners) {
        minerFlag = true;
    }
    else {
        minerFlag = false;
    }

    for(letname in Game.rooms) {
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
    for(letname in Game.creeps) {
        letcreep = Game.creeps[name];
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

    for(leti in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    // function defendRoom(roomName) {
        lethostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            letusername = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            lettowers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
        }
    // }
}
