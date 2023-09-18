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

  const getBoardData = () => {
    const boardData = [];

    for (const row of board) {
      for (const cell of row) {
        boardData.push(cell.getValue());
      }
    }

    return boardData;
  }

  const updateBoard = (row, column, marker) => {
    return board[row][column].updateValue(marker);
  };

  const _isGameOver = () => {
    const cells = [];
    board.map((row) => {
      row.map((cell) => cells.push(cell));
    });

    return cells.every((cell) => cell.getValue() !== "");
  };

  const _winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  const findWinner = () => {
    for (let i = 0; i < _winningCombinations.length; i++) {
      const position1 = grid[_winningCombinations[i][0]];
      const position2 = grid[_winningCombinations[i][1]];
      const position3 = grid[_winningCombinations[i][2]];

      const cell1 = board[position1.row][position1.column];
      const cell2 = board[position2.row][position2.column];
      const cell3 = board[position3.row][position3.column];

      const allMatch = [cell1, cell2, cell3].every((val) => {
        return val.getValue() !== "" && val.getValue() === cell1.getValue();
      });
      if (allMatch) {
        const winner = cell1.getValue();
        console.log(`The winner is player ${winner}`);
        return winner;
      }
    }

    if (_isGameOver()) return "draw";
    else return null;
  };

  return {
    findWinner,
    getBoardData,
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

      if (isNaN(cell) || cell < 1 || cell > 9) {
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

const displayController = () => {
  const updateIndicator = () => {
    const indicators = document.querySelectorAll(".playing-indicator");
    indicators.forEach((indicator) => indicator.classList.toggle("active"));
  };

  const getPlayerPosition = () => {
    const items = document.querySelectorAll(".cell");
    return new Promise((resolve) => {
      const handleClick = (e) => {
        items.forEach((item) => {
          item.removeEventListener("click", handleClick);
        });
        console.log({ e });
        resolve(e.target.dataset.cell);
      };

      items.forEach((item) => {
        item.addEventListener("click", handleClick);
      });
    });
  };

  const updateBoard = () => {
    const board = gameboard.getBoardData();
    const cells = document.querySelectorAll(".cells");
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  return { getPlayerPosition, updateBoard, updateIndicator };
};
