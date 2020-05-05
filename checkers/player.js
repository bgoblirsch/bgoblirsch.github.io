class Player {
  constructor(type, color) {
    this.type = type;
    this.color = color;
    this.pieces = [];
    this.moves = [];
    this.jumps = [];
  }



  canJump() {
    for (let i = 0; i < this.pieces.length; i++) {
      if (this.pieces[i].force.length > 0) {
        return true;
      }
    }
    return false;
  }

}
