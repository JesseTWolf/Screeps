package main

import "github.com/gopherjs/gopherjs/js"
// import "fmt"

func main() {
	// spawns := js.Global.Get("Game.spawns")
	// myString := "1"
	// myBytes := []byte(myString)
	js.Global.Get("console").Call("log", "Testing")

	basic_creep := []string{"WORK", "CARRY", "MOVE"} 

	js.Global.Get("Game").Get("spawns").Get("Wolf_1").Call("spawnCreep", basic_creep, "TestCreep")
}