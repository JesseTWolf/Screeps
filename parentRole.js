class ParentRole {
  constructor(name,energy,parts) {
    var name = name;
    var energyRequired = energy;
    var bodyParts = parts;
  }
  constructor(name) {
    var name = name;
    var energyRequired = null;
    var bodyParts = [WORK,CARRY,MOVE];
  }
}
