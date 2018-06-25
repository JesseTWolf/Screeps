module.exports = class nameGenerator {
    
    //Name Generator method.
    // static newName(role) {
    static newName() {
        // var newName = role + Game.time;
        var newName = Game.time;
        return newName;
    }
}