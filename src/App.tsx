import { useCallback, useRef, useState } from "react";
import "./App.css";

const getSize = (fullSize: number) => {
  const reducedSize = fullSize * 0.7;
  return Math.round(reducedSize / cellSize);
};

const cellSize = 10;
const numRows = getSize(window.innerHeight);
const numCols = getSize(window.innerWidth * 1.2);

const neighbours = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, -1],
];

const makeGrid = (empty = true) => {
  const newGrid = [];
  for (let i = 0; i < numRows; i++) {
    newGrid.push(Array.from(Array(numCols), () => 0));
  }
  return newGrid;
};

function App() {
  const [grid, setGrid] = useState(makeGrid());
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runCycle = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((prevGrid) => {
      let copyGrid = JSON.parse(JSON.stringify(prevGrid));

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbourCount = 0;

          neighbours.forEach(([x, y]) => {
            const neighbourI = i + x;
            const neighbourJ = j + y;
            if (
              neighbourI >= 0 &&
              neighbourI < numRows &&
              neighbourJ >= 0 &&
              neighbourJ < numCols
            ) {
              neighbourCount += prevGrid[neighbourI][neighbourJ];
            }
          });

          if (neighbourCount < 2 || neighbourCount > 3) {
            copyGrid[i][j] = 0;
          } else if (prevGrid[i][j] === 0 && neighbourCount === 3) {
            copyGrid[i][j] = 1;
          }
        }
      }
      return copyGrid;
    });

    setTimeout(runCycle, 100);
  }, []);

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <button
        className="margin2"
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runCycle();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        className="margin2"
        onClick={() => {
          setGrid(makeGrid());
        }}
      >
        Clear
      </button>
      <button
        className="margin2"
        onClick={() => {
          const randomGrid = [];
          for (let i = 0; i < numRows; i++) {
            randomGrid.push(
              Array.from(Array(numCols), () => Math.round(Math.random()))
            );
          }
          setGrid(randomGrid);
        }}
      >
        Random
      </button>
      <div
        style={{
          justifyContent: "center",
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
        }}
      >
        {grid.map((rows, rowsi) =>
          rows.map((cols, colsi) => (
            <div
              key={`${rowsi}-${colsi}`}
              onClick={() => {
                let copyGrid = JSON.parse(JSON.stringify(grid));
                copyGrid[rowsi][colsi] = grid[rowsi][colsi] ? 0 : 1;
                setGrid(copyGrid);
              }}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[rowsi][colsi] ? "red" : "blue",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
