let itercount;
let maxDepth = 4;

// evaluate the value of a given board state
function eval(board) {
  let result = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] == 'r') {
        result++;
      } else if (board[i][j] == 'b') {
        result--;
      } else if (board[i][j] == 'R') {
        result += 2;
      } else if (board[i][j] == 'B') {
        result -= 2;
      }
    }
  }
  return result;
}

function bestMove(player) {
  // variable to track time it takes for AI to choose its move
  let start = performance.now();
  // Right now, if score is never higher than best score, piece never gets set which causes an error
  // I think you need to set a default for score or if it doesn't exist
  let piece;
  let moveto;
  let bestScore = -Infinity;
  let canjump = canPlayerJump(player);
  let canmove = canPlayerMove(player);

  // if player can jump, try jumping all pieces that can jump
  if (canjump) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j].toLowerCase() == player && canPieceJump(j,i)) {
          // try jumping forward left
          if (validMove(j, i, j - 2, i + 2).bool) {
            let score = makeJump(j, i, j - 2, i + 2, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j - 2, i + 2);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // try forward right
          if (validMove(j, i, j + 2, i + 2).bool) {
            let score = makeJump(j, i, j + 2, i + 2, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j + 2, i + 2);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // back left
          if (validMove(j, i, j - 2, i - 2).bool) {
            let score = makeJump(j, i, j - 2, i - 2, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j - 2, i - 2);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // back right
          if (validMove(j, i, j + 2, i - 2).bool) {
            let score = makeJump(j, i, j + 2, i - 2, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j + 2, i - 2);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
        }
      }
    }
    // after the loop, jump to best piece + move
    // animatePiece(piece.originx, piece.originy, moveto.destx, moveto.desty);
    aiJump(piece.originx, piece.originy, moveto.destx, moveto.desty);
    makeKing();
  } else if (canmove) {
    // else try moving all pieces
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j].toLowerCase() == player && canPieceMove(j, i)) {
          // try moving forward left
          if (validMove(j, i, j - 1, i + 1).bool) {
            let score = makeMove(j, i, j - 1, i + 1, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j - 1, i + 1);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // try moving forward right
          if (validMove(j, i, j + 1, i + 1).bool) {
            let score = makeMove(j, i, j + 1, i + 1, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j + 1, i + 1);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // try back left
          if (validMove(j, i, j - 1, i - 1).bool) {
            let score = makeMove(j, i, j - 1, i - 1, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j - 1, i - 1);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
          // try back right
          if (validMove(j, i, j + 1, i - 1).bool) {
            let score = makeMove(j, i, j + 1, i - 1, 0, -Infinity, Infinity, false);
            if (score > bestScore) {
              let result = checkBestScore(score, bestScore, j, i, j + 1, i - 1);
              piece = result.piece;
              moveto = result.moveto;
              bestScore = result.bestScore;
            }
          }
        }
      }
    }
    // animatePiece(piece.originx, piece.originy, moveto.destx, moveto.desty);
    move(piece.originx, piece.originy, moveto.destx, moveto.desty);
  } else {
    // do nothing (no moves available)
  }
  let end = performance.now();
  console.log("Time taken to choose move: " + Math.round(end - start) + " milliseconds.");
}

function minimax(depth, alpha, beta, isMaximizing) {
  let a = alpha;
  let b = beta;
  // if the game is over, return infinity for win and opposite for loss
  if (gameOver()) {
    if (winner() == "black") {
      return -Infinity;
    } else if (winner() == "red") {
      return Infinity;
    }
  }
  if (depth > maxDepth) {
    let result = eval(board);
    if (isMaximizing && canPlayerJump('r')) {
      result += 1;
    } else if (!isMaximizing && canPlayerJump('b')) {
      result -= 1;
    }
    // console.log("max depth; returned score: ", result);
    return result;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    let canjump = canPlayerJump('r');
    let canmove = canPlayerMove('r');
    if (canjump) {
      // try all possible jumps
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j].toLowerCase() == 'r' && canPieceJump(j,i)) {
            // try jumping forward left
            if (validMove(j, i, j - 2, i + 2).bool) {
              let score = makeJump(j, i, j - 2, i + 2, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // try forward right
            if (validMove(j, i, j + 2, i + 2).bool) {
              let score = makeJump(j, i, j + 2, i + 2, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // back left
            if (validMove(j, i, j - 2, i - 2).bool) {
              let score = makeJump(j, i, j - 2, i - 2, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // back right
            if (validMove(j, i, j + 2, i - 2).bool) {
              let score = makeJump(j, i, j + 2, i - 2, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
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
              let score = makeMove(j, i, j - 1, i + 1, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // try forward right
            if (validMove(j, i, j + 1, i + 1).bool) {
              let score = makeMove(j, i, j + 1, i + 1, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // back left
            if (validMove(j, i, j - 1, i - 1).bool) {
              let score = makeMove(j, i, j - 1, i - 1, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
            }
            // back right
            if (validMove(j, i, j + 1, i - 1).bool) {
              let score = makeMove(j, i, j + 1, i - 1, depth + 1, alpha, beta, false);
              bestScore = max(score, bestScore);
              a = max(alpha, score);
              if (beta <= a) {
                break;
              }
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
    let bestScore = Infinity;
    let canjump = canPlayerJump('b');
    let canmove = canPlayerMove('b');
    if (canjump) {
      // try all possible jumps
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j].toLowerCase() == 'b' && canPieceJump(j, i)) {
            // try jumping forward left
            if (validMove(j, i, j - 2, i - 2).bool) {
              let score = makeJump(j, i, j - 2, i - 2, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // try forward right
            if (validMove(j, i, j + 2, i - 2).bool) {
              let score = makeJump(j, i, j + 2, i - 2, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // back left
            if (validMove(j, i, j - 2, i + 2).bool) {
              let score = makeJump(j, i, j - 2, i + 2, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // back right
            if (validMove(j, i, j + 2, i + 2).bool) {
              let score = makeJump(j, i, j + 2, i + 2, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
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
              let score = makeMove(j, i, j - 1, i - 1, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // forward right
            if (validMove(j, i, j + 1, i - 1).bool) {
              let score = makeMove(j, i, j + 1, i - 1, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // back left
            if (validMove(j, i, j - 1, i + 1).bool) {
              let score = makeMove(j, i, j - 1, i + 1, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
            }
            // back right
            if (validMove(j, i, j + 1, i + 1).bool) {
              let score = makeMove(j, i, j + 1, i + 1, depth + 1, alpha, beta, true);
              bestScore = min(score, bestScore);
              b = max(beta, score);
              if (beta <= a) {
                break;
              }
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

// stores the index of history for the current state of the game then makes a jump
// calls minimax on the result and resets the board back
function makeJump(originx, originy, destx, desty, depth, alpha, beta, isMaximizing) {
  let history_index = history.length;
  aiJump(originx, originy, destx, desty);
  makeKing();
  let score = minimax(depth, alpha, beta, isMaximizing);
  board = copyBoard(history[history_index - 1]);
  history = history.slice(0, history_index);
  return score;
}

// same as makeJump but for moves
function makeMove(originx, originy, destx, desty, depth, alpha, beta, isMaximizing) {
  let history_index = history.length;
  move(originx, originy, destx, desty);
  makeKing();
  let score = minimax(depth, alpha, beta, isMaximizing);
  board = copyBoard(history[history_index - 1]);
  history = history.slice(0, history_index);
  return score;
}

function checkBestScore(score, bestScore, originx, originy, destx, desty) {
  if (score > bestScore) {
    bestScore = score;
    piece = { originx, originy };
    moveto = { destx, desty };
    return { bestScore, piece, moveto };
  } else {
    return bestScore;
  }
}
