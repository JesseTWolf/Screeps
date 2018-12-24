class Config {
  constructor() {}

  static get COLONIES() {
    return ['Spawn-W3N7']
  }

  static get ROLES() {
    return [Gatherer,BoxKicker, Builder, RepairMan, Miner, Upgrader]
  }
}
