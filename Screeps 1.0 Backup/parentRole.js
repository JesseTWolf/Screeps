class ParentRole {
  constructor(name,energy,parts) {
    let name = name;
    // if i pass something it will initialize as what is passed in.
    // if nothing is passed in then the "||" sets the variable equal to '0'.
    let energyRequired = energy || 0;
    let bodyParts = parts || [WORK,CARRY,MOVE];
  }
}
