const gameboard = (() => {
  const _cell = () => {
    let _value = '';

    const updateValue = (marker) => {
      if (_value.length === 0) {
        _value = marker;
        return true;
      } else return false;
    }

    const getValue = () => _value;

    return { getValue, updateValue };
  }

  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(_cell());
    }
  }

  const printGameboard = () => {
    const boardCopy = [];

    for (let i = 0; i < rows; i++) {
      boardCopy[i] = [];
      for (let j = 0; j < columns; j++) {
        const cell = board[i][j];
        boardCopy[i].push(cell.getValue());
      }
    }

    console.table(boardCopy);
  }

  const updateBoard = (row, column, marker) => {
    return board[row][column].updateValue(marker);
  }

  const findWinner = () => {
    return null;
  }

  return {
    findWinner,
    printGameboard,
    updateBoard
  }
})();