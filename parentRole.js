class ParentRole {
  constructor(name,energy,parts) {
    var name = name;
    // if i pass something it will initialize as what is passed in.
    // if nothing is passed in then the "||" sets the variable equal to '0'.
    var energyRequired = energy || 0;
    var bodyParts = parts || [WORK,CARRY,MOVE];
  }
}
