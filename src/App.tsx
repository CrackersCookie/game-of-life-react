import { useState } from "react";
import "./App.css";

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(
    Array(numRows)
      .fill(0)
      .map(() => Array(numCols).fill(0))
  );

  console.log(grid);

  return (
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
              const copyGrid = grid;
              copyGrid[rowsi][colsi] = grid[rowsi][colsi] ? 0 : 1;
              setGrid([...copyGrid]);
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
  );
}

export default App;
