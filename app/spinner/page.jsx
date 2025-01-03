"use client"
import { useState, useEffect } from 'react';

const ScratchCardGame = () => {
  const [scratched, setScratched] = useState(Array(9).fill(false));
  const [results, setResults] = useState(Array(9).fill(null));
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState("");
  const [bombIndex, setBombIndex] = useState(null);  // Store the bomb index

  const numbers = [5, 10, 15, 20, 30, 35];
  const totalCells = 9;

  const initializeGame = () => {
    const randomizedResults = Array(totalCells)
      .fill(null)
      .map(() => numbers[Math.floor(Math.random() * numbers.length)]);

    // Randomly add a bomb to one of the cells
    const bombLocation = Math.floor(Math.random() * totalCells);
    randomizedResults[bombLocation] = '💣';

    setBombIndex(bombLocation);  // Store the bomb's location
    setResults(randomizedResults);
    setScratched(Array(totalCells).fill(false));
    setWon(false);
    setMessage("");
  };

  const handleScratch = (index) => {
    if (!scratched[index]) {
      const newScratched = [...scratched];
      newScratched[index] = true;
      setScratched(newScratched);

      // If the user hits the bomb
      if (results[index] === '💣') {
        setMessage("Better luck next time! 💥");
        setWon(false);
        return;
      }

      const revealedItems = results.filter((_, i) => newScratched[i]);
      const countMap = revealedItems.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      }, {});

      const matchedNumber = Object.keys(countMap).find(
        (key) => countMap[key] >= 3
      );

      if (matchedNumber) {
        setWon(true);
        setMessage(`Congratulations! You won ${matchedNumber} points! 🎉`);
      } else if (newScratched.every((v) => v)) {
        setMessage("Better luck next time! 😢");
      }
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700">
      <h1 className="text-4xl text-white font-bold mb-6">Tap & Win!</h1>  {/* Updated game name here */}

      <div className="grid grid-cols-3 gap-4 w-64 animate-fade-in">
        {results.map((result, index) => (
          <div
            key={index}
            onClick={() => handleScratch(index)}
            className={`flex items-center justify-center w-20 h-20 rounded-md cursor-pointer transition-transform duration-500 bg-gray-300 shadow-lg transform hover:scale-105 ${
              scratched[index] ? "bg-white" : "hover:bg-gray-400"
            }`}
          >
            {scratched[index] && (
              <span className="text-2xl font-bold animate-appear">
                {result === '💣' ? '💣' : result}
              </span>
            )}
          </div>
        ))}
      </div>

      {message && (
        <div
          className={`mt-6 text-gray-800 font-bold text-xl p-4 rounded-lg shadow-md animate-bounce ${
            won ? "bg-yellow-400" : "bg-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <button
        className="mt-8 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 animate-pop"
        onClick={initializeGame}
      >
        Play Again
      </button>
    </div>
  );
};

export default ScratchCardGame;
