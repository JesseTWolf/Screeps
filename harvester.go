package main

import "github.com/gopherjs/gopherjs/js"

func harvester(creep *js.Object) {
	if creep.Get("store").Get("freeCapacity").Int() > 0 {
		source := creep.Call("pos").Call("findClosestByPath", js.Global.Get("Game").Get("sources"))
		if creep.Call("harvest", source).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
			creep.Call("moveTo", source)
		}
	} else {
		target := creep.Call("pos").Call("findClosestByPath", js.Global.Get("Game").Get("structures"), js.M{
			"filter": func(structure *js.Object) bool {
				return structure.Get("structureType").String() == "extension" && structure.Get("store").Get("freeCapacity").Int() > 0
			},
		})
		if target != nil {
			if creep.Call("transfer", target, js.Global.Get("RESOURCE_ENERGY")).Int() == js.Global.Get("ERR_NOT_IN_RANGE").Int() {
				creep.Call("moveTo", target)
			}
		}
	}
}