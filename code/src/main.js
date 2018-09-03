for (let colonyName of Config.COLONIES) {
  (new Colony(colonyName)).tick()
}
