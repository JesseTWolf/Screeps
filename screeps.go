package main

import "github.com/gopherjs/gopherjs/js"

// How to write a loop in Go that iterates over the creeps in the Game and calls a function based on the creep's role?
func main() {
	// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' ); 
	// Problem was that WORK is a global constant and is mapped to 'work' so it's not technically a string.

	// Iterate JS object keys explicitly. Go cannot range directly over *js.Object.
	memoryCreeps := js.Global.Get("Memory").Get("creeps")
	for _, name := range js.Keys(memoryCreeps) {
		if !js.Global.Get("Game").Get("creeps").Get(name).Bool() {
			js.Global.Get("console").Call("log", "Clearing non-existing creep memory:", name)
			js.Global.Get("Reflect").Call("deleteProperty", memoryCreeps, name)
		}
	}

	// Hard coding tower id for now, will update later.
	tower := js.Global.Get("Game").Call("getObjectById", "6a0e2aa0a4c4e6002c159aa8")
	if tower.Bool() {
		closestHostile := tower.Get("pos").Call("findClosestByRange", js.Global.Get("FIND_HOSTILE_CREEPS"))
		if closestHostile.Bool() {
			tower.Call("attack", closestHostile)
		}

		closestDamagedStructure := tower.Get("pos").Call("findClosestByRange", js.Global.Get("FIND_STRUCTURES"), js.M{"filter": func(structure *js.Object) bool {
			return structure.Get("hits").Int() < structure.Get("hitsMax").Int()
		}})
		if closestDamagedStructure.Bool() {
			tower.Call("repair", closestDamagedStructure)
		}
	}

	creeps := js.Global.Get("Game").Get("creeps")

	builders := []string{}
	for _, name := range js.Keys(creeps) {
		creep := creeps.Get(name)

		if creep.Get("memory").Get("role").String() == "builder" {
			builders = append(builders, name)
		}
	}
	
	harversters := []string{}
	for _, name := range js.Keys(creeps) {
		creep := creeps.Get(name)

		if creep.Get("memory").Get("role").String() == "harvester" {
			harversters = append(harversters, name)
		}
	}

	upgraders := []string{}
	for _, name := range js.Keys(creeps) {
		creep := creeps.Get(name)

		if creep.Get("memory").Get("role").String() == "upgrader" {
			upgraders = append(upgraders, name)
		}
	}

	// js.Global.Get("console").Call("log", "Harvesters: ", harversters)
	// js.Global.Get("console").Call("log", "Upgraders: ", upgraders)

	if (len(builders) < 2) {
		newName := "Builder" + js.Global.Get("Game").Get("time").String()
		bodyParts := []interface{}{
			js.Global.Get("WORK"),
			js.Global.Get("CARRY"),
			js.Global.Get("MOVE"),
		}
		js.Global.Get("Game").Get("spawns").Get("Wolf1").Call("spawnCreep", bodyParts, newName, map[string]interface{}{
			"memory": map[string]interface{}{
				"role": "builder",
			},
		})
	}

	if (len(harversters) < 3) {
		newName := "Harvester" + js.Global.Get("Game").Get("time").String()
		bodyParts := []interface{}{
			js.Global.Get("WORK"),
			js.Global.Get("CARRY"),
			js.Global.Get("MOVE"),
		}
		js.Global.Get("Game").Get("spawns").Get("Wolf1").Call("spawnCreep", bodyParts, newName, map[string]interface{}{
			"memory": map[string]interface{}{
				"role": "harvester",
			},
		})
	}

	if (len(upgraders) < 3) {
		newName := "Upgrader" + js.Global.Get("Game").Get("time").String()
		bodyParts := []interface{}{
			js.Global.Get("WORK"),
			js.Global.Get("CARRY"),
			js.Global.Get("MOVE"),
		}
		js.Global.Get("Game").Get("spawns").Get("Wolf1").Call("spawnCreep", bodyParts, newName, map[string]interface{}{
			"memory": map[string]interface{}{
				"role": "upgrader",
			},
		})
	}

	if (js.Global.Get("Game").Get("spawns").Get("Wolf1").Get("spawning").Bool()) {
		spawningCreep := js.Global.Get("Game").Get("creeps").Get(js.Global.Get("Game").Get("spawns").Get("Wolf1").Get("spawning").Get("name").String())
		js.Global.Get("Game").Get("spawns").Get("Wolf1").Get("room").Get("visual").Call("text", "🛠️ "+spawningCreep.Get("memory").Get("role").String(), js.Global.Get("Game").Get("spawns").Get("Wolf1").Get("pos").Get("x").Int(), js.Global.Get("Game").Get("spawns").Get("Wolf1").Get("pos").Get("y").Int(), map[string]interface{}{
			"align": "left",
			"opacity": 0.8,
		})
	}

	for _, name := range js.Keys(js.Global.Get("Game").Get("creeps")) {
		creep := js.Global.Get("Game").Get("creeps").Get(name)
		if creep.Get("memory").Get("role").String() == "builder" {
			builder(creep)
		}
		if creep.Get("memory").Get("role").String() == "harvester" {
			harvester(creep)
		}
		if creep.Get("memory").Get("role").String() == "upgrader" {
			upgrader(creep)
		}
	}
}
