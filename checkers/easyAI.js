let itercount;
let maxDepth = 10;

function bestMove(player) {
  // Right now, if score is never higher than best score, piece never gets set which causes an error
  // I think you need to set a default for score or if it doesn't exist
  let piece;
  let moveto;
  let bestScore = -Infinity;
  let canjump = canPlayerJump(player);
  let canmove = canPlayerMove(player);

  // try jumping all pieces if player can jump
  if (canjump) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j].toLowerCase() == player && canPieceJump(j,i)) {
          // try jumping forward left
          if (validMove(j, i, j - 2, i + 2).bool) {
            let history_index = history.length;
            aiJump(j, i, j - 2, i + 2);
            makeKing();
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);
            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j - 2;
              let movey = i + 2;
              moveto = { movex, movey };
            }
          }
          // try forward right
          if (validMove(j, i, j + 2, i + 2).bool) {
            let history_index = history.length;
            aiJump(j, i, j + 2, i + 2);
            makeKing();
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);
            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j + 2;
              let movey = i + 2;
              moveto = { movex, movey };
            }
          }
          // back left
          if (validMove(j, i, j - 2, i - 2).bool) {
            let history_index = history.length;
            aiJump(j, i, j - 2, i - 2);
            makeKing();
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);

            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j - 2;
              let movey = i - 2;
              moveto = { movex, movey };
            }
          }
          // back right
          if (validMove(j, i, j + 2, i - 2).bool) {
            let history_index = history.length;
            aiJump(j, i, j + 2, i - 2);
            makeKing();
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);

            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j + 2;
              let movey = i - 2;
              moveto = { movex, movey };
            }
          }
        }
      }
    }
    // after the loop, jump to best piece + move
    console.log("made a jump");

    aiJump(piece.j, piece.i, moveto.movex, moveto.movey);
    makeKing();
  } else if (canmove) {
    // else try moving all pieces
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j].toLowerCase() == player && canPieceMove(j, i)) {
          // try moving forward left
          if (validMove(j, i, j - 1, i + 1).bool) {
            let history_index = history.length;
            move(j, i, j - 1, i + 1);
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);
            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j - 1;
              let movey = i + 1;
              moveto = { movex, movey };
            }
          }
          // try moving forward right
          if (validMove(j, i, j + 1, i + 1).bool) {
            let history_index = history.length;
            move(j, i, j + 1, i + 1);
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);
            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j + 1;
              let movey = i + 1;
              moveto = { movex, movey };
            }
          }
          // try back left
          if (validMove(j, i, j - 1, i - 1).bool) {
            let history_index = history.length;
            move(j, i, j - 1, i - 1);
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);

            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j - 1;
              let movey = i - 1;
              moveto = { movex, movey };
            }
          }
          if (validMove(j, i, j + 1, i - 1).bool) {
            let history_index = history.length;
            move(j, i, j + 1, i - 1);
            let score = minimax(board, 0, false);
            board = copyBoard(history[history_index - 1]);
            history = history.slice(0, history_index);
            if (score > bestScore) {
              bestScore = score;
              piece = { j, i };
              let movex = j + 1;
              let movey = i - 1;
              moveto = { movex, movey };
            }
          }
        }
      }
    }
    console.log("making a move");
    move(piece.j, piece.i, moveto.movex, moveto.movey);
  } else {

  }
}

function eval(board) {
  let result = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] == 'r') {
        result++;
      } else if (board[i][j] == 'b') {
        result--;
      } else if (board[i][j] == 'R') {
        result += 10;
      } else if (board[i][j] == 'B') {
        result -= 10;
      }
    }
  }
  return result;
}

function minimax(board, depth, isMaximizing) {
  // if the game is over, return infinity for win and opposite for loss
  if (gameOver()) {
    if (winner() == "black") {
      return -1000000;
    } else if (winner() == "red") {
      return 1000000;
    }
  }
  if (depth > maxDepth) {
    let result = eval(board);
    if (isMaximizing && canPlayerJump('r')) {
      result += 2;
    } else if (!isMaximizing && canPlayerJump('b')) {
      result -= 2;
    }
    // console.log("max depth; returned score: ", result);
    return result;
  }
  if (isMaximizing) {
    let bestScore = -9999;
    let canjump = canPlayerJump('r');
    let canmove = canPlayerMove('r');
    if (canjump) {
      // try all possible jumps
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j].toLowerCase() == 'r' && canPieceJump(j,i)) {
            // try jumping forward left
            if (validMove(j, i, j - 2, i + 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j - 2, i + 2);
              makeKing();
              let score = minimax(board, depth + 1, false);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // try forward right
            if (validMove(j, i, j + 2, i + 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j + 2, i + 2);
              makeKing();
              let score = minimax(board, depth + 1, false);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // back left
            if (validMove(j, i, j - 2, i - 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j - 2, i - 2);
              makeKing();
              let score = minimax(board, depth + 1, false);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // back right
            if (validMove(j, i, j + 2, i - 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j + 2, i - 2);
              makeKing();
              let score = minimax(board, depth + 1, false);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
          }
        }
      }
      // console.log("maximizer returned: ", bestScore)
      return bestScore;
    } else if (canmove) {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          // try all possible moves
          if (board[i][j].toLowerCase() == 'r' && canPieceMove(j, i)) {
            // try forward left
            if (validMove(j, i, j - 1, i + 1).bool) {
              let history_index = history.length;

              move(j, i, j - 1, i + 1);
              let score = minimax(board, depth + 1, false);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // try forward right
            if (validMove(j, i, j + 1, i + 1).bool) {
              let history_index = history.length;
              move(j, i, j + 1, i + 1);
              let score = minimax(board, depth + 1, false);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // back left
            if (validMove(j, i, j - 1, i - 1).bool) {
              let history_index = history.length;
              move(j, i, j - 1, i - 1);
              let score = minimax(board, depth + 1, false);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
            // back right
            if (validMove(j, i, j + 1, i - 1).bool) {
              let history_index = history.length;
              move(j, i, j + 1, i - 1);
              let score = minimax(board, depth + 1, false);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = max(score, bestScore);
            }
          }
        }
      }
      // console.log("maximizer returned: ", bestScore)
      return bestScore;
    } else {
      return -100;
    }
  } else {
    let bestScore = 9999;
    let canjump = canPlayerJump('b');
    let canmove = canPlayerMove('b');
    if (canjump) {
      // try all possible jumps
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j].toLowerCase() == 'b' && canPieceJump(j, i)) {
            // try jumping forward left
            if (validMove(j, i, j - 2, i - 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j - 2, i - 2);
              makeKing();
              let score = minimax(board, depth + 1, true);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = min(score, bestScore);
            }
            // try forward right
            if (validMove(j, i, j + 2, i - 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j + 2, i - 2);
              makeKing();
              let score = minimax(board, depth + 1, true);

              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = min(score, bestScore);
            }
            // back left
            if (validMove(j, i, j - 2, i + 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j - 2, i + 2);
              makeKing();
              let score = minimax(board, depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = min(score, bestScore);
            }
            // back right
            if (validMove(j, i, j + 2, i + 2).bool) {
              let history_index = history.length;
              aiJump(j, i, j + 2, i + 2);
              makeKing();
              let score = minimax(board, depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);

              bestScore = min(score, bestScore);
            }
          }
        }
      }
      // console.log("minimizer returned: ", bestScore)
      return bestScore;
    } else if (canmove) {
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          // try all possible moves
          if (board[i][j].toLowerCase() == 'b' && canPieceMove(j, i)) {
            // try moving forward left
            if (validMove(j, i, j - 1, i - 1).bool) {
              let history_index = history.length;
              move(j, i, j - 1, i - 1);
              let score = minimax(board, depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);
              bestScore = min(score, bestScore);
            }
            // forward right
            if (validMove(j, i, j + 1, i - 1).bool) {
              let history_index = history.length;
              move(j, i, j + 1, i - 1);
              let score = minimax(copyBoard(board), depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);
              bestScore = min(score, bestScore);
            }
            // back left
            if (validMove(j, i, j - 1, i + 1).bool) {
              let history_index = history.length;
              move(j, i, j - 1, i + 1);
              let score = minimax(board, depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);
              bestScore = min(score, bestScore);
            }
            // back right
            if (validMove(j, i, j + 1, i + 1).bool) {
              let history_index = history.length;
              move(j, i, j + 1, i + 1);
              let score = minimax(board, depth + 1, true);
              board = copyBoard(history[history_index - 1]);
              history = history.slice(0, history_index);
              bestScore = min(score, bestScore);
            }
          }
        }
      }
      // console.log("minimizer returned: ", bestScore)
      return bestScore;
    } else { // no moves available
      return 100;
    }
  }
}
