// usage: converts how the humanMarker see the gameboard to how the conputer sees it (in rows and columns)
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
    const clear = () => {
      _value = "";
    };

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

  const _isGameOver = () => {
    const cells = [];
    board.map((row) => {
      row.map((cell) => cells.push(cell));
    });

    return cells.every((cell) => cell.getValue() !== "");
  };

  const clearGameboard = () => {
    for (const row of board) {
      for (const cell of row) {
        cell.clear();
      }
    }
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

  const getBoardData = () => {
    const boardData = [];

    for (const row of board) {
      for (const cell of row) {
        boardData.push(cell.getValue());
      }
    }

    return boardData;
  };

  const updateBoard = (row, column, marker) => {
    return board[row][column].updateValue(marker);
  };

  return {
    clearGameboard,
    findWinner,
    getBoardData,
    updateBoard,
  };
})();

const player = (type, marker) => {
  let _score = 0;

  const getScore = () => _score;
  const updateScore = () => ++_score;
  const resetScore = () => {
    _score = 0;
  };
  const getMarker = () => marker;
  const getType = () => type;

  const play = async () => {
    while (true) {
      const cell = await displayController.getPlayerPosition();

      const { row, column } = grid[cell];
      const updated = gameboard.updateBoard(row, column, marker);

      if (updated) break;
      else console.error(`Cell ${cell} is occupied`);
    }
  };

  return {
    getMarker,
    getScore,
    getType,
    play,
    resetScore,
    updateScore,
  };
};

const computer = (type, marker) => {
  const prototype = player(type, marker);

  const _winning = (board, marker) => {
    if (
      (board[0] === marker && board[1] === marker && board[2] === marker) ||
      (board[3] === marker && board[4] === marker && board[5] === marker) ||
      (board[6] === marker && board[7] === marker && board[8] === marker) ||
      (board[0] === marker && board[3] === marker && board[6] === marker) ||
      (board[1] === marker && board[4] === marker && board[7] === marker) ||
      (board[2] === marker && board[5] === marker && board[8] === marker) ||
      (board[0] === marker && board[4] === marker && board[8] === marker) ||
      (board[2] === marker && board[4] === marker && board[6] === marker)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const _actions = (state) => {
    return state.filter((cell) => cell !== "O" && cell !== "X");
  };

  const _currentPlayer = (state) => {
    const xCount = state.filter((cell) => cell === "X").length;
    const oCount = state.filter((cell) => cell === "O").length;

    if (xCount < oCount || xCount === oCount) return "X";
    else if (xCount > oCount) return "O";
  };

  const _result = (state, action) => {
    const copy = state.map((item) => item);
    copy[action.index] = action.marker;
    return copy;
  };

  const _terminal = (state) => {
    if (
      _actions(state).length === 0 ||
      _winning(state, "X") ||
      _winning(state, "O")
    )
      return true;
    else return false;
  };

  const _utility = (state) => {
    if (_winning(state, "X")) return -1;
    else if (_winning(state, "O")) return 1;
    else return 0;
  };

  const _maximise = (state) => {
    if (_terminal(state)) {
      return { value: _utility(state) };
    }

    const record = {
      value: -1000000,
      index: -1,
    };

    for (const action of _actions(state)) {
      const a = { index: action, marker: _currentPlayer(state) };
      const newState = _result(state, a);
      const value = Math.max(record.value, _minimise(newState).value);
      if (value !== record.value) {
        record.value = value;
        record.index = action;
      }
    }

    return record;
  };

  const _minimise = (state) => {
    if (_terminal(state)) {
      return { value: _utility(state) };
    }

    const record = {
      value: 1000000,
      index: -1,
    };

    for (const action of _actions(state)) {
      const a = { index: action, marker: _currentPlayer(state) };
      const newState = _result(state, a);
      const value = Math.min(record.value, _maximise(newState).value);
      if (value !== record.value) {
        record.value = value;
        record.index = action;
      }
    }

    return record;
  };

  const _minimax = (state) => {
    const record = _maximise(state);
    return record.index;
  };

  const play = () => {
    const board = gameboard.getBoardData().map((cell, index) => {
      return cell === "" ? index : cell;
    });

    const move = _minimax(board) + 1;
    const { row, column } = grid[move];
    gameboard.updateBoard(row, column, marker);
  };

  return Object.assign({}, prototype, { play });
};

const player1 = player("humanMarker", "X");
const player2 = computer("computer", "O");

const gameController = ((player1, player2) => {
  const _players = [player1, player2];

  let _currentPlayer = 0;
  let _sumOfPlayersScore = 0;

  const _getCurrentPlayer = () => _players[_currentPlayer];

  const _reset = () => {
    const player = _getCurrentPlayer();
    // If the last player is the computer updates indicator
    // because the human will start the next round
    if (player.getType() === "computer") {
      displayController.updateIndicator();
    }

    _currentPlayer = 0;
    gameboard.clearGameboard();
    displayController.updateBoard();
  };

  const _sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const _updateScore = (marker) => {
    const player = _players.find((player) => player.getMarker() === marker);
    const score = player.updateScore();
    displayController.updateScore(score, player.getType());
  };

  const _updateCurrentPlayer = () => {
    _currentPlayer = _currentPlayer === 0 ? 1 : 0;
  };

  const _updateSumOfPlayersScore = () => {
    _sumOfPlayersScore = _players[0].getScore() + _players[1].getScore();
  };

  const newGame = () => {
    for (const player of _players) {
      player.resetScore();
    }
    _sumOfPlayersScore = 0;
    _reset();
    play();
  };

  const play = async () => {
    while (_sumOfPlayersScore < 5) {
      while (true) {
        const player = _getCurrentPlayer();
        _updateCurrentPlayer();

        displayController.updateIndicator();

        await player.play();
        if (player.getType() === "computer") await _sleep(500);

        displayController.updateBoard();

        const winner = gameboard.findWinner();
        if (winner === "X") {
          _updateScore("X");
          break;
        } else if (winner === "O") {
          _updateScore("O");
          break;
        } else if (winner === "draw") {
          break;
        }
      }

      setTimeout(() => {
        // wait for 3 seconds to allow player to view the board before it's cleared
        // allow player to analyze how the lost or won
        _reset();
        _updateSumOfPlayersScore();
      }, 3000);
      // wait for the setTimeout before proceeding
      await _sleep(3000);

      if (_sumOfPlayersScore === 5) {
        displayController.displayWinner(
          _players
            .find((player) => player.getType() === "humanMarker")
            .getScore()
        );
      }
    }
  };

  return { play, newGame };
})(player1, player2);

const displayController = (() => {
  const _resetBtnClickListener = () => {
    const resetBtn = document.querySelector(".reset");

    const clickHandler = () => {
      updateScore(0, "humanMarker");
      updateScore(0, "computer");

      const winnerBoard = document.querySelector(".round-board");
      winnerBoard.textContent = "";

      resetBtn.classList.remove("show");
      resetBtn.removeEventListener("click", clickHandler);

      gameController.newGame();
    };

    resetBtn.addEventListener("click", clickHandler);
  };

  const displayWinner = (playerScore) => {
    const winnerBoard = document.querySelector(".round-board");
    if (playerScore >= 3) {
      winnerBoard.textContent = "You won!";
    } else {
      winnerBoard.textContent = "You lose!";
    }

    // show reset button
    const resetBtn = document.querySelector(".reset");
    resetBtn.classList.add("show");

    _resetBtnClickListener();
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

  const updateIndicator = () => {
    const indicators = document.querySelectorAll(".playing-indicator");
    indicators.forEach((indicator) => indicator.classList.toggle("active"));
  };

  const updateScore = (score, type) => {
    // containerCN = container class name
    const containerCN =
      type === "humanMarker" ? "player-profile" : "computer-profile";

    const scoreboard = document.querySelector(`.${containerCN} .score`);
    scoreboard.textContent = score;
  };

  return {
    displayWinner,
    getPlayerPosition,
    updateBoard,
    updateIndicator,
    updateScore,
  };
})();

gameController.play();
