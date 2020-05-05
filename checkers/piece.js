class Piece {
  constructor(position, player) {
    this.position = position;
    this.player = player;
    this.type = 'man';
    this.available = [];
    this.force = [];
  }

  kingme() {
    this.type = 'king';
  }

  // x and y are the coords that we are trying to jump to
  jump(x, y) {
    // check if selected xy coords match any cell in the piece's force array
    for (let i = 0; i < this.force.length; i++) {
      if (board[x][y] == this.force[i]) {
        // if so, delete the jumped piece
        let xdiff = (x - this.position.x) / 2;
        let ydiff = (y - this.position.y) / 2;
        let jumpx = x - xdiff;
        let jumpy = y - ydiff;

        // delete the jumped piece
        let jumped = board[jumpx][jumpy];
        for (let i = 0; i < jumped.player.pieces.length; i++) {
          if (jumped == jumped.player.pieces[i]) {
            jumped.player.pieces.splice(i, 1);
          }
        }
        board[jumpx][jumpy] = new Empty(createVector(jumpx, jumpy));


        // and move the piece
        board[x][y] = this;

        // and update the piece's x & y
        this.position.x = x;
        this.position.y = y;

        // and update all pieces' available moves
        calcAvailableMoves();
        selected = null;

        // check if another jump is available
        if (this.force.length > 0) {
          if (this.force.length == 1) {
            let x = this.force[0].position.x;
            let y = this.force[0].position.y;
            selected = selectPiece(this);
            selected.jump(x, y);
            switchPlayer();
          } else if (this.player.type == "human") {
            console.log("more than one double jump option available, picked one at random");
            let r = floor(random(this.force.length));
            let x = this.force[r].position.x;
            let y = this.force[r].position.y;
            selected = selectPiece(this);
            selected.jump(x, y);
            // jump() switches the current player,
            switchPlayer();
          } else {
            // random works for now, but for minimax, we need to pick the optimal jump
            console.log("AI random double jump; need to have it call bestMove() again instead");
            let r = floor(random(this.force.length));
            let x = this.force[r].position.x;
            let y = this.force[r].position.y;
            selected = selectPiece(this);
            selected.jump(x, y);
            // jump() switches the current player, so we need to switch it back
            // back to the player that just jumped in case another jump is available
            switchPlayer();
          }
        }

        // king this piece if it reaches the end of the board
        if (this.position.y < 1 && this.player.color == 'black') {
          this.kingme();
        } else if (this.position.y > 6 && this.player.color == 'red') {
          this.kingme();
        }
        // kinging ends the player's turn
        switchPlayer();
      }
    }
  }

  move(x, y) {
    // check if selected xy coords match any cell in the piece's available array
    for (let i = 0; i < this.available.length; i++) {
      if (board[x][y] == this.available[i]) {
        // if so, place the piece
        board[x][y] = this;
        // and update the piece's x & y
        this.position.x = x;
        this.position.y = y;
        // and update all pieces' available moves
        calcAvailableMoves();
        switchPlayer();
        // king this piece if it reaches the end of the board
        if (this.position.y < 1 && this.player.color == 'black') {
          this.kingme();
        } else if (this.position.y > 6 && this.player.color == 'red') {
          this.kingme();
        }
        selected = null;
      }
    }
  }

  calcAvailMoves() {
    let x = this.position.x;
    let y = this.position.y;
    let forwardleft;
    let forwardright;
    let backleft;
    let backright;
    this.force = [];
    this.available = [];

    // for each piece, we try to calculate forward left and forward right
    // (and back left + back right for kings). if out of bounds, it's not a valid move
    // it would be simpler to just try in all four directions, but that would
    // requite more computations

    // you could simplify this by using a positive/negative variable for direction
    // based on player

    if (this.player.color == "red") {
      // try forward left
      try {
        forwardleft = board[x - 1][y + 1];
        if (forwardleft instanceof Piece && forwardleft.player.color == "black") {
          if (board[x - 2][y + 2] instanceof Empty) {
            this.force.push(board[x - 2][y + 2]);
          }
        } else if (forwardleft instanceof Empty) {
            this.available.push(forwardleft);
        }
      }
      catch(e) {
      }

      // try forward right
      try {
        forwardright = board[x + 1][y + 1];
        if (forwardright instanceof Piece && forwardright.player.color == "black") {
          if (board[x + 2][y + 2] instanceof Empty) {
            this.force.push(board[x + 2][y + 2]);
          }
        } else if (forwardright instanceof Empty) {
            this.available.push(forwardright);
        }
      }
      catch(e) {
      }

      // if this is a king, calc backwards too
      if (this.type == "king") {
        // try backleft
        try {
          backleft = board[x - 1][y - 1];
          if (backleft instanceof Piece && backleft.player.color == "black") {
            if (board[x - 2][y - 2] instanceof Empty) {
              this.force.push(board[x - 2][y - 2]);
            }
          } else if (backleft instanceof Empty) {
              this.available.push(backleft);
          }
        }
        catch(e) {
        }

        // try backright
        try {
          backright = board[x + 1][y - 1];
          if (backright instanceof Piece && backright.player.color == "black") {
            if (board[x + 2][y - 2] instanceof Empty) {
              this.force.push(board[x + 2][y - 2]);
            }
          } else if (backright instanceof Empty) {
              this.available.push(backright);
          }
        }
        catch(e) {
        }
      }

    // and same process for black
    } else if (this.player.color == "black") {
      // try forward left
      try {
        forwardleft = board[x - 1][y - 1];
        if (forwardleft instanceof Piece && forwardleft.player.color == "red") {
          if (board[x - 2][y - 2] instanceof Empty) {
            this.force.push(board[x - 2][y - 2]);
          }
        } else if (forwardleft instanceof Empty) {
            this.available.push(forwardleft);
        }
      }
      catch(e) {
      }

      // try forward right
      try {
        forwardright = board[x + 1][y - 1];
        if (forwardright instanceof Piece && forwardright.player.color == "red") {
          if (board[x + 2][y - 2] instanceof Empty) {
            this.force.push(board[x + 2][y - 2]);
          }
        } else if (forwardright instanceof Empty) {
            this.available.push(forwardright);
        }
      }
      catch(e) {
      }

      // if this is a king, calc backwards too
      if (this.type == "king") {
        // try backleft
        try {
          backleft = board[x - 1][y + 1];
          if (backleft instanceof Piece && backleft.player.color == "red") {
            if (board[x - 2][y + 2] instanceof Empty) {
              this.force.push(board[x - 2][y + 2]);
            }
          } else if (backleft instanceof Empty) {
              this.available.push(backleft);
          }
        }
        catch(e) {
        }

        // try backright
        try {
          backright = board[x + 1][y + 1];
          if (backright instanceof Piece && backright.player.color == "red") {
            if (board[x + 2][y + 2] instanceof Empty) {
              this.force.push(board[x + 2][y + 2]);
            }
          } else if (backright instanceof Empty) {
              this.available.push(backright);
          }
        }
        catch(e) {
        }
      }
    }
  }
}
