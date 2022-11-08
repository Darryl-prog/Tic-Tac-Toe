const DOMElement = (function () {
    const object = {};
    object.form = document.querySelector('form');
    object.gameDisplay = document.querySelector('.tic-tac-toe');
    object.cell = document.querySelectorAll(".cell");
    object.displayMessage = document.querySelector('p');
    object.displayGameMode = document.querySelector('h2');
    object.player1Input = document.querySelector('#player1Name');
    object.player2Input = document.querySelector('#player2Name');
    object.radioInputVsPlayer = document.querySelector('#pvp');
    object.radioInputvsComputerEasy = document.querySelector('#pve1');
    object.radioInputvsComputerHard = document.querySelector('#pve2');
    object.submitButton = document.querySelector((`button[type='submit']`));
    object.resetButton = document.querySelector('#resetButton');
    object.newGameButton = document.querySelector('#newGameButton');
    object.tictactoe = document.querySelector('.tic-tac-toe');
    return object;
})();

const submitButtonDisabled = (function () {
    DOMElement.submitButton.disabled = true;
})();

const events = (function () {
    window.addEventListener("load", function () {
        setTimeout(() => { document.querySelector('form').style.display = 'block'; }, 650);

    });

    DOMElement.player1Input.addEventListener('input', function () {
        if (this.value.length && DOMElement.player2Input.value.length)
            DOMElement.submitButton.disabled = false;
        else
            DOMElement.submitButton.disabled = true;
    })

    DOMElement.player2Input.addEventListener('input', function () {
        if (this.value.length && DOMElement.player1Input.value.length)
            DOMElement.submitButton.disabled = false;
        else
            DOMElement.submitButton.disabled = true;
    })

    DOMElement.radioInputVsPlayer.addEventListener('click', function () {
        if (!DOMElement.player2Input.value.length) {
            DOMElement.submitButton.disabled = true;
        }
        DOMElement.player2Input.disabled = false;
    })

    DOMElement.radioInputvsComputerEasy.addEventListener('click', function () {
        DOMElement.player2Input.disabled = true;
        DOMElement.player2Input.value = 'Computer AI (Easy)';
        if (DOMElement.player1Input.value.length) {
            DOMElement.submitButton.disabled = false;
        }
    })

    DOMElement.radioInputvsComputerHard.addEventListener('click', function () {
        DOMElement.player2Input.disabled = true;
        DOMElement.player2Input.value = 'Computer AI (Hard)';
    })
})();

const winningCondition = (function () {
    const object = {};
    object.array = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    return object;
})();

const formEvent = function () {
    DOMElement.form.addEventListener('submit', function (e) {
        e.preventDefault();
        this.style.display = 'none';
        setTimeout(() => { DOMElement.gameDisplay.style.display = 'block'; }, 650);
        const getData = Object.fromEntries(new FormData(this));
        const data = getData;

        DOMElement.resetButton.addEventListener('click', function () {
            DOMElement.cell.forEach(function (cell) {
                cell.textContent = '';
                cell.classList.remove('not-allowed');
            })
            DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
            DOMElement.displayMessage.style.color = 'black';
            data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            data.round = 0;
            data.isGameOver = false;
        })

        initializeGame(data);
        resetGame(data);
        newGame(data);
    })
}();

const resetCellData = function (data) {
    DOMElement.cell.forEach(function (cell) {
        cell.textContent = '';
        cell.classList.remove('not-allowed');
    })
    DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
    DOMElement.displayMessage.style.color = 'black';
    data.currentPlayer = "X";
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.round = 0;
    data.isGameOver = false;
    return;
}

const newGame = function () {
    DOMElement.newGameButton.addEventListener('click', function () {
        window.location.reload(true);
    })
    return;
}

const resetGame = function (data) {
    DOMElement.resetButton.addEventListener('click', function () {
        resetCellData(data);
    })
    return;
}

const addPropertiesToData = function (data) {
    data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    data.player1 = "X";
    data.player2 = "O";
    data.currentPlayer = "X";
    data.round = 0;
    data.winnerMark;
    data.isGameOver = false;
    return;
}

const initializeGame = function (data) {
    document.body.classList.add('switch-background');
    addPropertiesToData(data);

    if (data.gameMode === "pvp") {
        DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
        DOMElement.displayGameMode.textContent = "Game Mode: Player vs Player";
        DOMElement.displayGameMode.style.color = "blue";
        DOMElement.cell.forEach(function (cell) {
            cell.addEventListener('click', function (e) {
                //playermove
                playerMove(e.target, data);
                //check if there's a winner
                checkWinner(data);
                //check if tie
                tie(data);
            })
        })
        return;
    }
    else if (data.gameMode === "pve1") {
        DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
        DOMElement.displayGameMode.textContent = "Game Mode: Player vs AI (Easy)";
        DOMElement.displayGameMode.style.color = "blue";
        DOMElement.cell.forEach(function (cell) {
            cell.addEventListener('click', function (e) {
                //playermove
                playerMove(e.target, data);

                //check if there's a winner
                checkWinner(data);

                //computer move
                computerMove(data);

                //check if there's a winner
                checkWinner(data);

                //check if tie
                tie(data);
            })
        })
        return;
    }
    else if (data.gameMode === 'pve2') {
        DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
        DOMElement.displayGameMode.textContent = "Game Mode: Player vs AI (Hard)";
        DOMElement.displayGameMode.style.color = "blue";
        DOMElement.cell.forEach(function (cell) {
            cell.addEventListener('click', function (e) {
                //playermove
                playerMove(e.target, data);

                //computer move
                computerMove(data);

                //check if the AI wins
                computerWins(data);

                //check if tie
                tie(data);

            })
        })
        return;
    }
    return;
}

const playerMove = function (cell, data) {
    if (data.isGameOver === true || data.round > 8) return;
    if (data.board[cell.id] === "X" || data.board[cell.id] === "O") {
        if (data.gameMode === 'pve1' || data.gameMode === 'pve2') {
            throw 'Error, you are trying to place a mark that has already marked.'
        }
        return;
    }
    cell.textContent = data.currentPlayer;
    cell.classList.add('not-allowed');
    data.board[cell.id] = data.currentPlayer;

    if (data.gameMode === 'pvp') {
        data.currentPlayer = data.currentPlayer === "X" ? "O" : "X"
        if (data.currentPlayer === "X")
            DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`;
        else
            DOMElement.displayMessage.textContent = `${data.player2Name}, It's your turn!`;
    }
    else if (data.gameMode === 'pve1') {
        if (data.currentPlayer === "X")
            DOMElement.displayMessage.textContent = `${data.player2Name}, It's your turn!`;
    }
    data.round++;
    return;
}

const computerMove = function (data) {
    if (data.gameMode === 'pve1') {

        if (data.isGameOver === true || data.round > 8) return;

        const filteredArray = data.board.filter(function (el) {
            return typeof el === 'number';
        })
        const filteredArrayLength = data.board.filter(function (el) {
            return typeof el === 'number';
        }).length;

        const randomCellToPlaceByAI = filteredArray[Math.floor(Math.random() * filteredArrayLength)];
        data.board[randomCellToPlaceByAI] = "O";
        DOMElement.displayMessage.textContent = `Computer is thinking. . .`;

        setTimeout(() => { document.querySelector(`.cell-${randomCellToPlaceByAI}`).textContent = "O"; }, 450);
        setTimeout(() => { document.querySelector(`.cell-${randomCellToPlaceByAI}`).classList.add('not-allowed'); }, 450);

        if (!checkWinner(data)) {
            setTimeout(() => { DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`; }, 450);
        } else return;
        data.round++;
        return;
    }

    else if (data.gameMode === 'pve2') {
        if (data.isGameOver === true || data.round > 8) return;
        //get best possible move from minimax algorithm
        const move = minimax(data, "O").index;
        data.board[move] = data.player2;
        DOMElement.displayMessage.textContent = `Computer is thinking. . .`;
        setTimeout(() => { document.querySelector(`.cell-${move}`).textContent = 'O'; }, 300)
        setTimeout(() => { document.querySelector(`.cell-${move}`).classList.add('not-allowed'); }, 300);
        if (!checkWinner(data)) {
            setTimeout(() => { DOMElement.displayMessage.textContent = `${data.player1Name}, It's your turn!`; }, 300);
        } else {
            return;
        }
        data.round++;
        return;
    }
    return;
}

const checkWinner = function (data) {
    let result = false;
    if (data.gameMode === 'pvp' || data.gameMode === 'pve1') {
        winningCondition.array.forEach(function (array) {
            if (data.board[array[0]] === "X" && data.board[array[0]] === data.board[array[1]] && data.board[array[1]] === data.board[array[2]]) {
                DOMElement.displayMessage.textContent = `${data.player1Name} Wins!`;
                DOMElement.displayMessage.style.color = 'green';
                data.isGameOver = true;
                result = true;
                return;
            }
            else if (data.board[array[0]] === "O" && data.board[array[0]] === data.board[array[1]] && data.board[array[1]] === data.board[array[2]]) {
                if (data.gameMode === 'pvp') {
                    DOMElement.displayMessage.textContent = `${data.player2Name} Wins!`;
                    DOMElement.displayMessage.style.color = 'green';
                    data.isGameOver = true;
                    result = true;
                    return;
                }
                else if (data.gameMode === 'pve1') {
                    setTimeout(() => { DOMElement.displayMessage.textContent = `Computer AI Wins!`; }, 450)
                    setTimeout(() => { DOMElement.displayMessage.style.color = 'green'; }, 450);
                    data.isGameOver = true;
                    result = true;
                    return;
                }
            }
        })
    }
    else if (data.gameMode === 'pve2') {
        winningCondition.array.forEach((array) => {
            if (data.board[array[0]] === "X" && data.board[array[1]] === "X" && data.board[array[2]] === "X") {
                data.winnerMark = "X";
                data.isGameOver = true;
                result = true;
                return;
            } else if (data.board[array[0]] === "O" && data.board[array[1]] === "O" && data.board[array[2]] === "O") {
                data.winnerMark = "O";
                data.isGameOver = true;
                result = true;
                return;
            }
        });
    }
    return result;
};

const computerWins = function (data) {
    winningCondition.array.forEach((array) => {
        if (data.board[array[0]] === "O" && data.board[array[1]] === "O" && data.board[array[2]] === "O") {
            setTimeout(() => { DOMElement.displayMessage.textContent = `Computer AI Wins!`; }, 300);
            setTimeout(() => { DOMElement.displayMessage.style.color = 'green'; }, 300);
            data.winnerMark = "O";
            data.isGameOver = true;
            result = true;
        }
    });
    return;
}

const tie = function (data) {
    let result = false;
    if (data.round === 9)
        if (checkWinner(data))
            result = true;
        else {
            DOMElement.displayMessage.textContent = 'Tie Game!';
            DOMElement.displayMessage.style.color = 'red';
            result = true;
        }
    return result;
}

const minimax = function (data, player) {
    //check for the available spaces
    let availableSpaces = data.board.filter(function (el) {
        return typeof el === 'number';
    });

    //"X" is minimizer
    if (checkWinner(data) && data.winnerMark === "X") {
        return {
            score: -100,
        }
    }
    //"O" is maximizer
    else if (checkWinner(data) && data.winnerMark === "O") {
        return {
            score: 100,
        };
    }
    //draw
    else if (availableSpaces.length === 0) {
        return {
            score: 0,
        };
    }

    const potentialMoves = [];
    for (let i = 0; i < availableSpaces.length; i++) {
        let move = {};
        move.index = data.board[availableSpaces[i]];
        data.board[availableSpaces[i]] = player;
        if (player === 'O') {
            move.score = minimax(data, 'X').score;
        } else {
            move.score = minimax(data, 'O').score;
        }

        data.board[availableSpaces[i]] = move.index;

        potentialMoves.push(move);
    }
    let bestMove = 0;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score > bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < potentialMoves.length; i++) {
            if (potentialMoves[i].score < bestScore) {
                bestScore = potentialMoves[i].score;
                bestMove = i;
            }
        }
    }
    data.isGameOver = false;
    return potentialMoves[bestMove];
};

