class Miner extends Gatherer {
  constructor(ref, colony) {
    super(ref, colony)
  }

  tick() {
    this.mine();
    // this.ref.moveTo( /* SOMEWHERE */ ) // instead of creep.moveTo()
  }

  mine() {
    if(!this.ref.memory.harvestPointId) {
            let occupiedHarvestPoints = _.filter(Game.creeps, (creep) => this.ref.memory.role == 'Miner').map((el) => el.memory.harvestPointId);
            let closestSource = this.ref.pos.findClosestByRange(FIND_SOURCES, {filter: (source) => occupiedHarvestPoints.indexOf(source.id) == -1});
            this.ref.memory.harvestPointId = closestSource.id;
        }
        let source = Game.getObjectById(this.ref.memory.harvestPointId);
        // if(source) {
            if(this.ref.harvest(source) == ERR_NOT_IN_RANGE) {
                this.ref.moveTo(source);
            }
  }
}
