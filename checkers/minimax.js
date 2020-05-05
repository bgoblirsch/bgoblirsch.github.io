var itercount;

function bestMove(player) {
  // Random pick for now
  let piece;
  let move;
  // create arrays for storing pieces that must and can be moved
  let forced_pieces = [];
  let valid_pieces = [];
  for (let i = 0; i < player.pieces.length; i++) {
    if (player.pieces[i].force.length > 0) {
      forced_pieces.push(player.pieces[i]);
    } else if (player.pieces[i].available.length > 0) {
      valid_pieces.push(player.pieces[i]);
    }
  }
  if (forced_pieces.length > 0) {
    let r = floor(random(forced_pieces.length))
    let random_forced_x = forced_pieces[r].position.x;
    let random_forced_y = forced_pieces[r].position.y;
    piece = board[random_forced_x][random_forced_y];
    r = floor(random(piece.force.length));
    selectPiece(piece);
    piece.jump(piece.force[r].position.x, piece.force[r].position.y);
    switchPlayer();
  } else if (valid_pieces.length > 0) {
    let r = floor(random(valid_pieces.length))
    piece = selectPiece(valid_pieces[r]);
    r = floor(random(piece.available.length));
    move = piece.available[r];
    let x = move.position.x;
    let y = move.position.y;
    piece.move(x, y);
    switchPlayer();
  } else {
    console.log(player.color, " has no remaining moves");
  }

// Tic Tac Toe Logic
//   itercount = 0;
//   let bestScore = -Infinity;
//   let move;
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       if (board[i][j] == '') {
//         board[i][j] = ai;
//         let score = minimax(board, 0, false);
//         board[i][j] = '';
//         if (score > bestScore) {
//           bestScore = score;
//           move = { i, j }
//         }
//       }
//     }
//   }
//   board[move.i][move.j] = ai;
//   console.log(itercount);
//   currentPlayer = human;
// }
//
// let scores = {
//   X: 1,
//   O: -1,
//   tie: 0,

}

// With alpha beta pruning
function minimax(board, depth, alpha, beta, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        itercount++;
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, alpha, beta, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
          alpha = max(alpha, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        itercount++;
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, alpha, beta, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
          beta = min(beta, score);
          if (beta <= alpha) {
            break;
          }
        }
      }
    }
    return bestScore;
  }
}

// No alpha beta pruning
// function minimax(board, depth, isMaximizing) {
//   let result = checkWinner();
//   if (result !== null) {
//     return scores[result];
//   }
//
//   if (isMaximizing) {
//     let bestScore = -Infinity;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         itercount++;
//         if (board[i][j] == '') {
//           board[i][j] = ai;
//           let score = minimax(board, depth + 1, false);
//           board[i][j] = '';
//           bestScore = max(score, bestScore);
//         }
//       }
//     }
//     return bestScore;
//   } else {
//     let bestScore = Infinity;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         itercount++;
//         if (board[i][j] == '') {
//           board[i][j] = human;
//           let score = minimax(board, depth + 1, true);
//           board[i][j] = '';
//           bestScore = min(score, bestScore);
//         }
//       }
//     }
//     return bestScore;
//   }
// }
