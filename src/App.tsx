import { useCallback, useRef, useState } from "react";
import "./App.css";

const numRows = 10;
const numCols = 10;

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

function App() {
  const [grid, setGrid] = useState(
    Array(numRows)
      .fill(0)
      .map(() => Array(numCols).fill(0))
  );

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runCycle = useCallback(() => {
    if (!runningRef.current) return;
    console.log(grid, "here");

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

    setTimeout(runCycle, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          console.log(grid, "check");
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runCycle();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rowsi) =>
          rows.map((cols, colsi) => (
            <div
              key={`${rowsi}-${colsi}`}
              onClick={() => {
                let copyGrid = [...grid];
                copyGrid[rowsi][colsi] = grid[rowsi][colsi] ? 0 : 1;
                setGrid(copyGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowsi][colsi] ? "red" : "blue",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
