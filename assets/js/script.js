// usage: converts how the human see the gameboard to how the conputer sees it (in rows and columns)
const grid = {
  1: { row: 0, column: 0 },
  2: { row: 0, column: 1 },
  3: { row: 0, column: 2 },
  4: { row: 1, column: 0 },
  5: { row: 1, column: 1 },
  6: { row: 1, column: 2 },
  7: { row: 2, column: 0 },
  8: { row: 2, column: 1 },
  9: { row: 2, column: 2 },
};

const gameboard = (() => {
  const _cell = () => {
    let _value = "";

    const updateValue = (marker) => {
      if (_value.length === 0) {
        _value = marker;
        return true;
      } else return false;
    };

    const getValue = () => _value;

    return { getValue, updateValue };
  };

  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
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
  };

  const updateBoard = (row, column, marker) => {
    return board[row][column].updateValue(marker);
  };

  const findWinner = () => {
    return null;
  };

  return {
    findWinner,
    printGameboard,
    updateBoard,
  };
})();

const player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  const play = () => {
    while (true) {
      const cell = +prompt(`${name} please choose a cell (1-9)? `);

      if (cell < 1 || cell > 9) {
        console.log("Please choose a number between 1 and 9.");
        continue;
      }

      const { row, column } = grid[cell];
      const updated = gameboard.updateBoard(row, column, marker);

      if (updated) break;
      else console.log(`Cell ${cell} is occupied`);
    }
  };

  return { getMarker, getName, play };
};

const player1 = player("Jimmy", "X");
const player2 = player("Katy", "O");

const gameController = ((player1, player2) => {
  const _players = [player1, player2];

  let _currentPlayer = 0;

  const _updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer === 0 ? 1 : 0;
  };

  const _getCurrentPlayer = () => _players[_currentPlayer];

  const play = () => {
    while (true) {
      const player = _getCurrentPlayer();
      _updateCurrentPlayer();

      player.play();
      gameboard.printGameboard();

      const winner = gameboard.findWinner();
      if (winner) break;
    }
  };

  return { play };
})(player1, player2);
