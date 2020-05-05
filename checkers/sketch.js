// Brandon Goblirsch
// [github link]

// ###########
// ## To-Do ##
// ###########
// + After jumping, if another jump(s) is available, allow and force that
// + if player type == human, would be nice to highlight pieces that can jump
//      and highlight available cells when a piece is selected
//    - also, related to this, console.log("black can jump") does not happen when
//        clicking an available cell (and not the forced cell)
// + minor bug, but most of the time when the game ends, the last piece is not
//      removed from the board
// + test cases: check triple jumps, ensure all available cells calculate correctly, etc.

let board = [];

// arrays to store each player's pieces
// these should really be "player" objects that have a pieces and team property
let red = new Player("ai", "red");
let black = new Player("human", "black");

// width/height
let w;
let h;

// black starts the game
let currentPlayer = black;

function setup() {
  createCanvas(800, 800);
  background(100);

  // pixel size of each cell
  w = width / 8;
  h = height / 8;
  //bestMove();

  // setup board object
  let white_cell = true;
  for (let j = 0; j < 8; j++) {
    let row = [];
    for (let i = 0; i < 8; i++) {
      let pos = createVector(j, i);
      if (white_cell == true) {
        // filler objects are the non-playable cells
        let filler = new Filler(pos);
        row.push(filler);
        white_cell = false;
        continue;
      }
      // create red pieces (top of board)
      if (i < 3) {
        let piece = new Piece(pos, red);
        row.push(piece);
        red.pieces.push(piece);
        white_cell = true;
      } else if (i > 4) { // create black pieces (bottom of board)
        let piece = new Piece(pos, black);
        row.push(piece);
        black.pieces.push(piece);
        white_cell = true;
      } else { // create empty cells
        let empty = new Empty(pos);
        row.push(empty);
        white_cell = true;
      }
    }
    board.push(row);
    white_cell = !white_cell;
  }
  // Loop through all pieces and set their available moves
  calcAvailableMoves();
}


function checkWinner() {
  if (black.pieces.length < 1) {
    return red;
  } else if (red.pieces.length < 1) {
    return black;
  } else {
    for (let i = 0; i < black.pieces.length; i++) {
      if (black.pieces[i].available.length > 0 || black.pieces[i].force.length > 0) {
        return null;
      }
    }
    for (let i = 0; i < red.pieces.length; i++) {
      if (red.pieces[i].available.length > 0 || red.pieces[i].force.length > 0) {
        return null;
      }
    }
  }
}

function calcAvailableMoves() {
  for (let i = 0; i < black.pieces.length; i++) {
    black.pieces[i].calcAvailMoves();
  }
  for (let i = 0; i < red.pieces.length; i++) {
    red.pieces[i].calcAvailMoves();
  }
}

function switchPlayer() {
  if (currentPlayer.color == "black") {
    currentPlayer = red;
  } else {
    currentPlayer = black;
  }
}

let selected;
function mousePressed() {
  try {
	  let x = floor(mouseX / w);
	  let y = floor(mouseY / h);
	  // if human's turn and nothing is selected
	  if (currentPlayer.type == "human" && selected == null) {
		// first check if what we clicked is a valid piece
		if (board[x][y] instanceof Piece && board[x][y].player.type == currentPlayer.type) {
		  // if a jump is available, only allow jumpable pieces to be selected
		  if (currentPlayer.canJump()) {
			if (board[x][y].force.length > 0) {
			  selected = selectPiece(board[x][y]);
			} else {
			  console.log("Black can jump.");
			}
		  } else {
			selected = selectPiece(board[x][y]);
		  }
		}
		// else if a piece is selected
	  } else if (currentPlayer.type == "human" && selected) {
		// first check if we are just deselecting
		if (selected.position.x == x && selected.position.y == y) {
		  board[x][y] = selected;
		  selected = null;
		} else if (selected.force.length > 0) {
		  selected.jump(x, y);
		} else if (selected.available.length > 0) {
		  selected.move(x, y);
		}
		else {console.log("edge case found investigate mousePressed()")}
	  }
  }
  catch(e) {
  }
}

function selectPiece(piece) {
  if (piece.player.canJump() && piece.force.length > 0) {
    let empty = new Empty(createVector(piece.position.x, piece.position.y));
    board[piece.position.x][piece.position.y] = empty;
    return piece;
  } else if (piece.available.length > 0) {
    let empty = new Empty(createVector(piece.position.x, piece.position.y));
    board[piece.position.x][piece.position.y] = empty;
    return piece;
  } else {
    return null
  }
}

function draw() {
  // Draw the game board
  // white board cells are the non-playable cells
  let white_cell = true;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (white_cell == true) {
        // Draw white square
        fill(255);
        rectMode(CORNER);
        rect(i * w, j * h, w, h);
        white_cell = false;
      } else {
        fill(100);
        rectMode(CORNER);
        rect(i * w, j * h, w, h);
        white_cell = true;
      }
    }
    white_cell = !white_cell;
  }

  // Draw the pieces
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if ((board[i][j]) instanceof Empty || board[i][j] instanceof Filler) {
        continue
      } else if (board[i][j].type == 'man') {
        let y = j * w + w / 2;
        let x = i * h + h / 2;
        let piece = board[i][j];
        fill(piece.player.color);
        ellipse(x, y, w / 2);
      } else if (board[i][j].type == 'king') {
        let y = j * w + w / 2;
        let x = i * h + h / 2;
        let piece = board[i][j];
        fill(piece.player.color);
        rectMode(CENTER);
        rect(x, y, w * 0.6, h * 0.6);
      }
    }
  }

  if (selected) {
    fill(0);
    if (selected.type == "man") {
      ellipse(mouseX, mouseY, w /2);
    } else if (selected.type == "king") {
      rectMode(CENTER);
      rect(mouseX, mouseY, w * 0.6, h * 0.6);
    }

  }

  if (currentPlayer.type == "ai") {
    // now the AI goes
    bestMove(currentPlayer);
    // and then switch currentPlayer
    switchPlayer();
  }

   let result = checkWinner();
   if (result != null) {
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'draw') {
      resultP.html("Draw!")
    } else {
      resultP.html(`${result.color} wins!`);
    }
    noLoop();
  }
}
