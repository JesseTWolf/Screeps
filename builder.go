package main

import "github.com/gopherjs/gopherjs/js"

func builder(creep *js.Object) {
	if creep.Get("memory").Get("building").Bool() && creep.Get("store").Call("getUsedCapacity").Int() == 0 {
		creep.Get("memory").Set("building", false)
		creep.Call("say", "Harvesting")
	}
	if !creep.Get("memory").Get("building").Bool() && creep.Get("store").Call("getFreeCapacity").Int() == 0 {
		creep.Get("memory").Set("building", true)
		creep.Call("say", "Building")
	}

	if creep.Get("memory").Get("building").Bool() {
		targets := creep.Get("room").Call("find", js.Global.Get("FIND_CONSTRUCTION_SITES"))
		if targets.Length() > 0 {
			if creep.Call("build", targets.Index(0)).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
				creep.Call("moveTo", targets.Index(0))
			}
		}
	} else if creep.Get("memory").Get("building").Bool() == false {
		sources := creep.Get("room").Call("find", js.Global.Get("FIND_SOURCES"))
		if creep.Call("harvest", sources.Index(0)).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", sources.Index(0))
		}
	}
}
