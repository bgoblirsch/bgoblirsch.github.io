function randomMove() {
  // pick first available move
  // first loop through all pieces and try jumping each
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] == 'r') {
        let originx = j;
        let originy = i;
        if (validMove(originx, originy, originx - 2, originy + 2).bool) {
          aiJump(originx, originy, originx - 2, originy + 2);
          return;
        } else if (validMove(originx, originy, originx + 2, originy + 2).bool) {
          aiJump(originx, originy, originx + 2, originy + 2);
          return;
        }
      }
    }
  }

  // then try moves instead
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] == 'r') {
        // forward left
        if (validMove(j, i, j - 1, i + 1).bool) {
          move(j, i, j - 1, i + 1);
          return;
        // forward right
      } else if (validMove(j, i, j + 1, i + 1).bool) {
          move(j, i, j + 1, i + 1);
          return;
        }
      }
    }
  }
}
