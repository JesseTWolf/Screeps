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
		targets := creep.Get("room").Call("find", js.Global.Get("FIND_STRUCTURES"), js.M{"filter": func(structure *js.Object) bool {
			structureType := structure.Get("structureType").String()
			return (structureType == js.Global.Get("STRUCTURE_EXTENSION").String() || structureType == js.Global.Get("STRUCTURE_SPAWN").String() || structureType == js.Global.Get("STRUCTURE_TOWER").String()) && structure.Get("store").Call("getFreeCapacity", js.Global.Get("RESOURCE_ENERGY")).Int() > 0
		}})

		if targets.Length() > 0 {
			if creep.Call("transfer", targets.Index(0), js.Global.Get("RESOURCE_ENERGY")).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
				creep.Call("moveTo", targets.Index(0))
			}
		}
	}
}