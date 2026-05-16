package main

import "github.com/gopherjs/gopherjs/js"

func main() {
	// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' ); 
	// Problem was that WORK is a global constant and is mapped to 'work' so it's not technically a string.
	bodyParts := []interface{}{
		js.Global.Get("WORK"),
		js.Global.Get("CARRY"),
		js.Global.Get("MOVE"),
	}
	result := js.Global.Get("Game").Get("spawns").Get("Wolf_1").Call("spawnCreep", bodyParts, "Harvester1")
	js.Global.Get("console").Call("log", "Result: ", result)

	for _, name := range js.Keys(js.Global.Get("Game").Get("creeps")) {
		creep := js.Global.Get("Game").Get("creeps").Get(name)
		if creep.Get("memory").Get("role").String() == "harvester" {
			harvester(creep)
		}
		if creep.Get("memory").Get("role").String() == "upgrader" {
			upgrader(creep)
		}
	}
}
