package main

import "github.com/gopherjs/gopherjs/js"

func harvester(creep *js.Object) {
	creepCapacity := creep.Get("store").Call("getFreeCapacity").Int()

	if creepCapacity > 0 {
		sources := creep.Get("room").Call("find", js.Global.Get("FIND_SOURCES"))
		if creep.Call("harvest", sources.Index(0)).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", sources.Index(0))
		}
	} else {
		spawner := js.Global.Get("Game").Get("spawns").Get("Wolf1")
		if creep.Call("transfer", spawner, js.Global.Get("RESOURCE_ENERGY")).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", spawner)
		}
	}
}