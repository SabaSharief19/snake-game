import React, { useState, useEffect } from "react";
import "./App.css";

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, gameOver]);

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    let head = { ...newSnake[0] };

    // Move the snake in the current direction
    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;

    // Collision Detection (Game Over)
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || 
        newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
      setScore(score + 10);
    } else {
      newSnake.pop();
    }

    newSnake.unshift(head);
    setSnake(newSnake);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (event.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    if (event.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    if (event.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!startX || !startY) return;

    let diffX = e.touches[0].clientX - startX;
    let diffY = e.touches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && direction !== "LEFT") setDirection("RIGHT");
      else if (diffX < 0 && direction !== "RIGHT") setDirection("LEFT");
    } else {
      if (diffY > 0 && direction !== "UP") setDirection("DOWN");
      else if (diffY < 0 && direction !== "DOWN") setDirection("UP");
    }

    setStartX(null);
    setStartY(null);
  };

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="game-container">
      <h1 className="game-title"><span className="snake-icon">🐍</span> Snake Game</h1>
      <h2>Score: {score}</h2>
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <button className="restart-button" onClick={restartGame}>
            Play Again
          </button>
        </div>
      )}
      <div
        className="game-board"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 20 }).map((_, col) => {
            const isSnake = snake.some(segment => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
              ></div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
