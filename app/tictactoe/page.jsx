"use client"
import { useState } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null); // To store player's choice (X or O)
  const [botSymbol, setBotSymbol] = useState(null); // To store bot's symbol (opposite of playerSymbol)
  const [gameStarted, setGameStarted] = useState(false);

  // Start the game after player chooses their symbol
  const startGame = (symbol) => {
    setPlayerSymbol(symbol);
    setBotSymbol(symbol === "X" ? "O" : "X"); // Set bot's symbol to the opposite of player's choice
    setCurrentPlayer(symbol); // Set the initial player symbol
    setGameStarted(true); // Game has started
  };

  const handleClick = (index) => {
    if (board[index] !== "" || !gameStarted || currentPlayer !== playerSymbol) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      alert(`Player ${currentPlayer} wins!`);
      resetGame();
    } else if (!newBoard.includes("")) {
      alert("It's a tie!");
      resetGame();
    } else {
      setCurrentPlayer(botSymbol); // Switch to bot's turn
      setTimeout(() => botMove(newBoard), 2000); // Bot moves after a 2 second delay
    }
  };

  const botMove = (newBoard) => {
    const bestMove = findBestMove(newBoard, botSymbol); // Find the best move for the bot
    newBoard[bestMove] = botSymbol;
    setBoard(newBoard);

    if (checkWinner(newBoard)) {
      alert(`Player ${botSymbol} (Bot) wins!`);
      resetGame();
    } else if (!newBoard.includes("")) {
      alert("It's a tie!");
      resetGame();
    } else {
      setCurrentPlayer(playerSymbol); // Switch back to player's turn
    }
  };

  // Logic to determine the best move for the bot
  const findBestMove = (board, bot) => {
    let move = blockOrWin(board, bot);
    if (move !== -1) return move;

    return strategicMove(board);
  };

  const blockOrWin = (board, player) => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      const line = [board[a], board[b], board[c]];

      if (line.filter(cell => cell === player).length === 2 && line.filter(cell => cell === "").length === 1) {
        return [a, b, c].find(index => board[index] === "");
      }
    }

    return -1;
  };

  const strategicMove = (board) => {
    if (board[4] === "") return 4;
    const corners = [0, 2, 6, 8];
    for (let i = 0; i < corners.length; i++) {
      if (board[corners[i]] === "") return corners[i];
    }
    return board.indexOf("");
  };

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningCombinations.some(
      ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer(playerSymbol);
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen text-gray-900 p-5">
      {!gameStarted ? (
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-6">Choose Your Symbol</h1>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-xl mx-2"
            onClick={() => startGame("X")}
          >
            Play as X
          </button>
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold text-xl mx-2"
            onClick={() => startGame("O")}
          >
            Play as O
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg text-gray-800">Tic Tac Toe</h1>
          <div className="grid grid-cols-3 gap-4 p-5 bg-gray-100 rounded-xl shadow-2xl">
            {board.map((cell, index) => (
              <div
                key={index}
                className={`w-28 h-28 text-white flex items-center justify-center text-4xl font-extrabold cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg rounded-lg ${cell === "X" ? "bg-green-500" : cell === "O" ? "bg-red-500" : "bg-gray-200"}`}
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          <button
            className="mt-10 px-8 py-3 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg shadow-xl hover:from-red-500 hover:to-red-300 transform transition-transform duration-300 hover:scale-110 font-bold text-lg"
            onClick={resetGame}
          >
            Reset Game
          </button>
          <p className="mt-6 text-lg font-bold">Current Turn: <span className={`text-2xl ${currentPlayer === 'X' ? 'text-green-500' : 'text-red-500'}`}>{currentPlayer}</span></p>
        </>
      )}
    </div>
  );
};

export default TicTacToe;
