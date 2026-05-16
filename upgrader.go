package main

import "github.com/gopherjs/gopherjs/js"

func upgrader(creep *js.Object) {
	if creep.Get("store").Get("freeCapacity").Int() > 0 {
		source := creep.Call("pos").Call("findClosestByPath", js.Global.Get("Game").Get("sources"))
		if creep.Call("harvest", source).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", source)
		}
	} else {
		controller := creep.Call("pos").Call("findClosestByPath", js.Global.Get("Game").Get("controllers"))
		if controller != nil {
			if creep.Call("upgradeController", controller).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
				creep.Call("moveTo", controller)
			}
		}
	}
}
