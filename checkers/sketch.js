// Brandon Goblirsch
// [github link]
// Adapted from Daniel Schifman's tic-tac-toe minimax and the University of
// Florida's Dept of CSCI checkers example:
// link to coding train
// http://www.cs.ucf.edu/~dmarino/ucf/java/

// ###########
// ## To-Do ##
// ###########
// + test cases: simple move and jump check, check triple jumps, ensure all available cells calculate correctly, etc.
// + something causes minimax to make poor decisions; it seems to not properly evauluate black double jumps

let board = new Array(8);
const size = 8;
let rcount = 12;
let bcount = 12;
let player = 'b';
let pieces = ['r', 'b', 'R', 'B'];
let history = [];

let p1 = "human";

// width/height
let w;
let h;

// black starts the game
let currentPlayer = 'b';
let selected = null;
let resultP;

let undobutton;
let resetbutton;
let undo;
let reset;

function setup() {
  createCanvas(800, 800);
  background(100);

  // pixel size of each cell
  w = width / 8;
  h = height / 8;

  // setup whole board as blank
  for (let i = 0; i < 8; i++) {
    board[i] = new Array(8);
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      board[i][j] = '_';
    }
  }

  // place the pieces (red on top)
  for (let i = 1; i < size; i += 2) {
    board[0][i] = 'r';
    board[2][i] = 'r';
    board[6][i] = 'b';
  }

  for (let i = 0; i < size; i += 2) {
    board[1][i] = 'r';
    board[5][i] = 'b';
    board[7][i] = 'b';
  }

  // copyBoard returns a new array (rather than a reference)
  // save the starting state of the board
  history.push(copyBoard(board));

  // create the undo and reset buttons
  resetbutton = createButton("Reset");
  resetbutton.mousePressed(resetBoard);
  // undobutton = createButton("Undo");
  // undobutton.mousePressed(undoMove);

}

// variables to store the origin of selected pieces
let originx;
let originy;

function mousePressed() {
  // target cell
  let x = floor(mouseX / w);
  let y = floor(mouseY / h);
  let target;
  // if x and y are in bounds
  if (x < 8 && y < 8) {
    //console.log("Clicked: ", x, y);
    // target stores the type of piece
    target = board[y][x];
  }
  // if player 1 is human, it's their turn, and nothing is selected
  if (p1 == "human" && currentPlayer == 'b' && selected === null) {
    // is the target a black piece?
    if (target == 'b' || target == 'B') {
      if (canPlayerJump(currentPlayer)) {
        if (canPieceJump(x, y)) {
          originx = x;
          originy = y;
          selected = target;
          board[y][x] = '_';
        }
      } else if (canPieceMove(x, y)) {
        originx = x;
        originy = y;
        selected = target;
        board[y][x] = '_';
      }
    }
  }
  // if current player is human and something is selected
  else if (currentPlayer == 'b' && selected != null) {
    // if we are just deselecting the piece
    if (originx == x && originy == y) {
      board[originy][originx] = selected;
      selected = null;
      return;
    }
    // if the piece can jump
    board[originy][originx] = selected;
    if (canPieceJump(originx, originy)) {
      let result = validMove(originx, originy, x, y);
      if (result.bool && result.type == "jump") {
        jump(originx, originy, x, y);
        if (canPieceJump(x, y)) {
          originx = x;
          originy = y;
          board[y][x] = '_';
        } else {
          currentPlayer = 'r';
          selected = null;
        }
      }
      makeKing();
    } else if (validMove(originx, originy, x, y).bool) {
      move(originx, originy, x, y);
      currentPlayer = 'r'
      selected = null;
    } else {
      board[originy][originx] = '_';
      console.log("not a valid move")
    }
  }
}

function canPlayerJump(player) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j].toLowerCase() == player && canPieceJump(j, i)) {
        return true;
      }
    }
  }
  return false;
}

function canPlayerMove(player) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j].toLowerCase() == player && canPieceMove(j, i)) {
        return true;
      }
    }
  }
  return false;
}

function validMove(originx, originy, destx, desty) {
  let piece = board[originy][originx];
  let bool = false;
  let type;
  let result = { bool, type };
  if (piece == '_') {
    return result;
  }
  // check if array indices are out of range
  if (originx < 0 || originx > 7 || originy < 0 || originy > 7 ||
      destx < 0 || destx > 7 || desty < 0 || desty > 7) {
        bool = false;
        type = null;
        result = { bool, type }
        return result;
  }
  // is dest blank?
  else if (board[desty][destx] == '_') {
              // check move
              if (abs(originx - destx) == 1) {
                if (piece == 'r' && desty - originy == 1) {
                  bool = true;
                  type = "move";
                  result = { bool, type };
                  return result;
                } else if (piece == 'b' && desty - originy == -1) {
                  bool = true;
                  type = "move";
                  result = { bool, type };
                  return result;
                } else if (abs(originy - desty) == 1 && (piece == 'R' || piece == 'B')) {
                  bool = true;
                  type == "move";
                  result = { bool, type };
                  return result;
                }
              }
              // check jump
              else if (abs(originx - destx) == 2) {
                if (piece == 'r' && desty - originy == 2 &&
                    board[(originy + desty) / 2][(originx + destx) / 2].toLowerCase() == 'b') {
                      bool = true;
                      type = "jump";
                      result = { bool, type };
                      return result;
                    }
                else if (piece == 'b' && desty - originy == -2 &&
                    board[(originy + desty) / 2][(originx + destx) / 2].toLowerCase() == 'r') {
                      bool = true;
                      type = "jump";
                      result = { bool, type };
                      return result;
                }
                else if (piece == 'R' && abs(desty - originy) == 2 &&
                         (board[(originy + desty) / 2][(originx + destx) / 2] == 'b' ||
                          board[(originy + desty) / 2][(originx + destx) / 2] == 'B')) {
                            bool = true;
                            type = "jump";
                            result = { bool, type };
                            return result;
                }
                else if (piece == 'B' && abs(desty - originy) == 2 &&
                         (board[(originy + desty) / 2][(originx + destx) / 2] == 'r' ||
                          board[(originy + desty) / 2][(originx + destx) / 2] == 'R')) {
                            bool = true;
                            type = "jump";
                            result = { bool, type };
                            return result;
                }
            }
  }
  return result;
}

// function makes no gurantee that the parameters make a valid move
function move(originx, originy, destx, desty) {
  //animatePiece(piece, originx, originy, destx, desty);

  // move piece to new location and set origin to blank
  board[desty][destx] = board[originy][originx];
  board[originy][originx] = '_';
  makeKing();

  history.push(copyBoard(board));
}

// function makes no gurantee that the parameters make a valid jump
function jump(originx, originy, destx, desty) {
  // test the team of the jumped piece and decrement its piece coutn
  if (board[(originy + desty) / 2][(originx + destx) / 2].toLowerCase() == 'r') {
    rcount--;
  } else {
    bcount--;
  }
  // then delete the jumped piece
  board[(originy + desty) / 2][(originx + destx) / 2] = '_';

  // move the piece
  board[desty][destx] = board[originy][originx]
  board[originy][originx] = '_';

  history.push(copyBoard(board));
}

function aiJump(originx, originy, destx, desty) {
  // test the team of the jumped piece and decrement its piece coutn
  if (board[(originy + desty) / 2][(originx + destx) / 2].toLowerCase() == 'r') {
    rcount--;
  } else {
    bcount--;
  }
  // then delete the jumped piece
  board[(originy + desty) / 2][(originx + destx) / 2] = '_';

  // move the piece
  board[desty][destx] = board[originy][originx]
  board[originy][originx] = '_';
  history.push(copyBoard(board));

  if (canPieceJump(destx, desty)) {
    originx = destx;
    originy = desty;
    if (board[originy][originx] == 'r') {
      if (validMove(originx, originy, originx - 2, originy + 2).bool) {
        aiJump(originx, originy, originx - 2, originy + 2);
      } else if (validMove(originx, originy, originx + 2, originy + 2).bool) {
        aiJump(originx, originy, originx + 2, originy + 2);
      }
    } else if (board[originy][originx] == 'b') {
      if (validMove(originx, originy, originx - 2, originy - 2).bool) {
        aiJump(originx, originy, originx - 2, originy - 2);
      } else if (validMove(originx, originy, originx + 2, originy - 2).bool) {
        aiJump(originx, originy, originx + 2, originy - 2);
      }
    } else if (board[originy][originx] == 'R' || [originy][originx] == 'B') {
      if (validMove(originx, originy, originx - 2, originy + 2).bool) {
        aiJump(originx, originy, originx - 2, originy + 2);
      } else if (validMove(originx, originy, originx + 2, originy + 2).bool) {
        aiJump(originx, originy, originx + 2, originy + 2);
      } else if (validMove(originx, originy, originx - 2, originy - 2).bool) {
        aiJump(originx, originy, originx - 2, originy - 2);
      } else if (validMove(originx, originy, originx + 2, originy - 2).bool) {
        aiJump(originx, originy, originx + 2, originy - 2);
      }
    }
  }
}

function switchPlayer() {
  if (currentPlayer == 'b') {
    currentPlayer = 'r';
  } else {
    currentPlayer = 'b';
  }
}

function makeKing() {
  for (let i = 0; i < size; i++) {
    if (board[0][i] == 'b') {
      board[0][i] = 'B';
    } else if (board[7][i] == 'r') {
      board[7][i] = 'R';
    }
  }
}

function gameOver() {
  // check if
  rcount = 0;
  bcount = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j].toLowerCase() == 'r') {
        rcount++;
      } else if (board[i][j].toLowerCase() == 'b') {
        bcount++;
      }
    }
  }
  return (rcount == 0 || bcount == 0);
}

function winner() {
  if (bcount == 0) {
    return "red";
  } else if (rcount == 0) {
    return "black";
  }
}

function copyBoard(board) {
  let result = [];
  for (let i = 0; i < size; i++) {
    result.push(board[i].slice(0))
  }
  return result;
}

function undoMove() {
  if (history.length > 3) {
    board = history[history.length - 4];
    history.pop();
    history.pop();
  } else {
    board = history[0];
  }
  currentPlayer = 'b';
}

function resetBoard() {
  loop();
  resultP = null;
  board = history[0];
  history = [];
  history.push(copyBoard(board));
  bcount = 12;
  rcount = 12
  currentPlayer = 'b';
}

// function animatePiece(piece, originx, origny, destx, desty) {
//   let x = originx * w;
//   let y = originy * h;
//   while (abs((destx * w) - x) > 0 && abs((desty * w) - y > 0)) {
//     console.log(x,y)
//     x += (destx - originx);
//     y += (desty - originy);
//     switch (piece) {
//       case 'r':
//         fill('red');
//         ellipse(x, y, w / 2);
//         break;
//       case 'b':
//       fill('black');
//         ellipse(x, y, w / 2);
//         break;
//       case 'R':
//         fill('red');
//         rectMode(CENTER);
//         rect(x, y, w * 0.6, h * 0.6);
//         break;
//       case 'B':
//         fill('black');
//         rectMode(CENTER);
//         rect(x, y, w * 0.6, h * 0.6);
//         break;
//     }
//   }
// }

function draw() {
  bcount = 0;
  rcount = 0;
  // draw the board
  let white_cell = true;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (white_cell == true) {
        // Draw white non-playable square
        fill(255);
        rectMode(CORNER);
        rect(i * w, j * h, w, h);
        white_cell = false;
      } else {
        // draw grey playable square
        fill(100);
        rectMode(CORNER);
        rect(i * w, j * h, w, h);
        white_cell = true;
      }
    }
    white_cell = !white_cell;
  }

  // draw the pieces
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[j][i] != '_') {
        let x;
        let y;
        switch (board[j][i]) {
          case 'r':
            rcount += 1;
            fill('red');
            x = i * h + h / 2;
            y = j * w + w / 2;
            noStroke()
            ellipse(x, y, w / 2);
            break;
          case 'b':
            bcount += 1;
            fill('black');
            x = i * h + h / 2;
            y = j * w + w / 2;
            if (currentPlayer == 'b' && board[j][i] == 'b' && canPieceJump(i, j)) {
              stroke(255);
            } else {
              noStroke()
            }
            ellipse(x, y, w / 2);
            break;
          case 'R':
            rcount += 1;
            fill('red');
            x = i * h + h / 2;
            y = j * w + w / 2;
            rectMode(CENTER);
            rect(x, y, h * 0.6, w * 0.6);
            break;
          case 'B':
            bcount += 1;
            fill('black');
            x = i * h + h / 2;
            y = j * w + w / 2;
            noStroke()
            if (currentPlayer == 'b' && board[j][i] == 'B' && canPieceJump(i, j)) {
              stroke(255);
            } else {
              noStroke()
            }
            rectMode(CENTER);
            rect(x, y, h * 0.6, w * 0.6);
            break;
        }
      }
    }
  }


  // if something is selected, keep it at mousex/mousey
  if (selected != null) {
    var x = mouseX;
    var y = mouseY;

    switch (selected) {
      case 'r':
        fill('red');
        ellipse(x, y, w / 2);
        break;
      case 'b':
          fill('black');
          ellipse(x, y, w / 2);
          break;
      case 'R':
        fill('red');
        rectMode(CENTER);
        rect(x, y, w * 0.6, h * 0.6);
        break;
      case 'B':
        fill('black');
        rectMode(CENTER);
        rect(x, y, w * 0.6, h * 0.6);
        break;
    }
  }

  // if it's the ai's turn, have it make a move
  if (currentPlayer == 'r' && rcount > 0) {
    // ai make first avail move
    //randomMove();

    bestMove('r');
    // switch player
    currentPlayer = 'b';
  }

  // always check to see if the game is over and return the winner if it is
  if (gameOver()) {
    resultP = createP('');
    resultP.style('font-size', '32pt');
    if (winner() == 'draw') {
      resultP.html("Draw!")
    } else {
      resultP.html(`${winner()} wins!`);
    }
    noLoop();
  }
}

// lengthy function to check if a piece can jump
function canPieceJump(originx, originy) {
  // check if red can jump;
  if (board[originy][originx] == 'r') {
    try {
      let forwardleft = board[originy+1][originx-1];
      if (forwardleft == 'b' || forwardleft == 'B') {
        if (board[originy+2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let forwardright = board[originy+1][originx+1];
      if (forwardright == 'b' || forwardright == 'B') {
        if (board[originy+2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}
  }

  // check if black can jump
  else if (board[originy][originx] == 'b') {
    try {
      let forwardleft = board[originy-1][originx-1];
      if (forwardleft == 'r' || forwardleft == 'R') {
        if (board[originy-2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let forwardright = board[originy-1][originx+1];
      if (forwardright == 'r' || forwardright == 'R') {
        if (board[originy-2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}
  }

  // check red king jumps; forward/backward are irrelevant, we check all directions
  else if (board[originy][originx] == 'R') {
    try {
      let forwardleft = board[originy-1][originx+1];
      if (forwardleft == 'b' || forwardleft == 'B') {
        if (board[originy-2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let forwardright = board[originy+1][originx+1];
      if (forwardright == 'b' || forwardright == 'B') {
        if (board[originy+2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let backleft = board[originy-1][originx-1];
      if (backleft == 'b' || backleft == 'B') {
        if (board[originy-2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let backright = board[originy+1][originx-1];
      if (backright == 'b' || backright == 'B') {
        if (board[originy+2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}
  }

  // check black king jumps
  else if (board[originy][originx] == 'B') {
    try {
      let forwardleft = board[originy-1][originx+1];
      if (forwardleft == 'r' || forwardleft == 'R') {
        if (board[originy-2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let forwardright = board[originy+1][originx+1];
      if (forwardright == 'r' || forwardright == 'R') {
        if (board[originy+2][originx+2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let backleft = board[originy-1][originx-1];
      if (backleft == 'r' || backleft == 'R') {
        if (board[originy-2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}

    try {
      let backright = board[originy+1][originx-1];
      if (backright == 'r' || backright == 'R') {
        if (board[originy+2][originx-2] == '_') {
          return true;
        }
      }
    } catch(e) {}
  }
  return false;
}

// lengthy function to check if a piece can move
function canPieceMove(x, y) {
  // check if red can move;
  if (board[y][x] == 'r') {
    try { // forward left
      if (board[y+1][x-1] == '_') {
        return true;
      }
    } catch(e) {}

    try { // forward right
      if (board[y+1][x+1] == '_') {
        return true;
      }
    } catch(e) {}
  }

  // check if black can move
  else if (board[y][x] == 'b') {
    try { // forward left
      if (board[y-1][x-1] == '_') {
        return true;
      }
    } catch(e) {}

    try { // forward right
      if (board[y-1][x+1] == '_') {
        return true;
      }
    } catch(e) {}
  }

  // check king moves
  else if (board[y][x] == 'R' || board[y][x] == 'B') {
    try { // forward left
      if (board[y+1][x-1] == '_') {
        return true;
      }
    } catch(e) {}

    try { // forward right
      if (board[y+1][x+1] == '_') {
        return true;
      }
    } catch(e) {}

    try { // back left
      if (board[y-1][x-1] == '_') {
        return true;
      }
    } catch(e) {}

    try { // back right
      if (board[y-1][x+1] == '_') {
        return true;
      }
    } catch(e) {}
  }
  return false;
}
