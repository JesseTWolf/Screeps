package main

import "github.com/gopherjs/gopherjs/js"

func upgrader(creep *js.Object) {
	if creep.Get("memory").Get("upgrading").Bool() && creep.Get("store").Call("getUsedCapacity").Int() == 0 {
		creep.Get("memory").Set("upgrading", false)
		js.Global.Get("console").Call("log", "Switching to harvesting")
	}
	if !creep.Get("memory").Get("upgrading").Bool() && creep.Get("store").Call("getFreeCapacity").Int() == 0 {
		creep.Get("memory").Set("upgrading", true)
		js.Global.Get("console").Call("log", "Switching to upgrading")
	}

	if creep.Get("memory").Get("upgrading").Bool() {
		upgradeController := creep.Get("room").Get("controller") 
		if creep.Call("upgradeController", upgradeController).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", upgradeController)
		}
	} else if creep.Get("memory").Get("upgrading").Bool() == false {
		sources := creep.Get("room").Call("find", js.Global.Get("FIND_SOURCES"))
		if creep.Call("harvest", sources.Index(0)).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", sources.Index(0))
		}
	}
}
