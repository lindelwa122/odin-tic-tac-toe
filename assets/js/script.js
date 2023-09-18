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

    const clear = () => _value = "";

    return { clear, getValue, updateValue };
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

  const clearGameboard = () => {
    for (const row of board) {
      for (const cell of row) {
        cell.clear();
      }
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
        return winner;
      }
    }

    if (_isGameOver()) return "draw";
    else return null;
  };

  return {
    clearGameboard,
    findWinner,
    getBoardData,
    printGameboard,
    updateBoard,
  };
})();

const player = (name, marker) => {
  let _score = 0;

  const updateScore = () => ++_score;
  const getScore = () => _score;

  const getName = () => name;
  const getMarker = () => marker;

  const play = async () => {
    while (true) {
      const cell = await displayController.getPlayerPosition();

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

  return { getMarker, getName, getScore, play, updateScore };
};

const computer = (name, marker) => {
  const prototype = player(name, marker);

  const play = () => {
    while (true) {
      const row = Math.floor(Math.random() * 3);
      const column = Math.floor(Math.random() * 3);

      const updated = gameboard.updateBoard(row, column, marker);

      if (updated) break;
    }
  } 

  return Object.assign({}, prototype, { play });
}

const player1 = player("Jimmy", "X");
const player2 = computer("Katy", "O");

const gameController = ((player1, player2) => {
  const _players = [player1, player2];

  let _currentPlayer = 0;

  let _sumOfPlayersScore = 0;

  const _updateSumOfPlayersScore = () => {
    _sumOfPlayersScore = _players[0].getScore() + _players[1].getScore();
  }

  const _updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer === 0 ? 1 : 0;
  };

  const _getCurrentPlayer = () => _players[_currentPlayer];

  const _reset = () => {
    gameboard.clearGameboard();
    displayController.updateBoard();
  }

  const _updateScore = (marker) => {
    const player = _players.find((player) => player.getMarker() === marker);
    const score = player.updateScore();
    displayController.updateScore(score, marker);
  }

  const play = async () => {
    while (_sumOfPlayersScore < 5) {
      while (true) {
        const player = _getCurrentPlayer();
        _updateCurrentPlayer();
  
        await player.play();
        displayController.updateBoard();
        gameboard.printGameboard();
  
        const winner = gameboard.findWinner();
  
        if (winner === "X") {
          _updateScore("X")
          break;
        } else if (winner === "O") {
          _updateScore("O")
          break;
        } else if (winner === "draw") {
          alert("It's a draw");
          break;
        }
      }
      _updateSumOfPlayersScore();
      _reset();
    }
  };

  return { play };
})(player1, player2);

const displayController = (() => {
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
        resolve(e.target.dataset.cell);
      };

      items.forEach((item) => {
        item.addEventListener("click", handleClick);
      });
    });
  };

  const updateBoard = () => {
    const board = gameboard.getBoardData();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const updateScore = (score, marker) => {
    // containerCN = container class name
    const containerCN = marker === "X" ? "player-profile" : "computer-profile";
    const scoreboard = document.querySelector(`.${containerCN} .score`);
    scoreboard.textContent = score;
  }

  return { getPlayerPosition, updateBoard, updateIndicator, updateScore };
})();

gameController.play();