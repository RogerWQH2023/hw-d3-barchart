import { useState } from "react";
import "./App.css";
import Barchart from "./components/Barchart";

const SampleData = [
  {
    name: "All Negative",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [-10, -50, -100, -150, -200, -250, -300],
  },
  {
    name: "All Positive",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [10, 50, 100, 150, 200, 250, 300],
  },
  {
    name: "Positive and Negative",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [-10, 50, -100, 150, -200, 250, 300],
  },
  {
    name: "Longer Data",
    dataX: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
    dataY: [10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
  },
  {
    name: "Shorter Data",
    dataX: ["A", "B", "C"],
    dataY: [100, 300, 500],
  },
];

function App() {
  const [cWidth, setCWidth] = useState(400);
  const [cHeight, setCHeight] = useState(300);
  const [cFill, setCFill] = useState("#e66465");
  const [cDataIndex, setCDataIndex] = useState(2);

  return (
    <>
      <div id="controller">
        <label>Width:</label>
        <br />
        <input
          id="input-width"
          type="range"
          value={cWidth}
          min={100}
          max={800}
          step={1}
          onInput={(e: any) => {
            setCWidth(e.target.value);
          }}
        />
        <label> {cWidth}px</label>
        <br />
        <label>Height:</label>
        <br />
        <input
          id="input-height"
          type="range"
          value={cHeight}
          min={100}
          max={800}
          step={1}
          onInput={(e: any) => {
            setCHeight(e.target.value);
          }}
        />
        <label> {cHeight}px</label>
        <br />
        <label>Color:</label>
        <input
          id="input-color"
          type="color"
          value={cFill}
          onChange={(e: any) => {
            setCFill(e.target.value);
          }}
        />
        <br />
        <label>Sample Data:</label>
        <select
          value={cDataIndex}
          id="input-dataSelect"
          onChange={(e) => {
            setCDataIndex(Number(e.target.value));
          }}
        >
          {SampleData.map((item, index) => {
            return <option value={index}>{item.name}</option>;
          })}
        </select>
        <br />
        <div style={{ width: "100%", overflowX: "scroll" }}>
          <table border={1}>
            <tr>
              <th>DataX:</th>
              {SampleData[cDataIndex].dataX.map((item) => {
                return <td>{item}</td>;
              })}
            </tr>
            <tr>
              <th>DataY:</th>
              {SampleData[cDataIndex].dataY.map((item) => {
                return <td>{item}</td>;
              })}
            </tr>
          </table>
        </div>
      </div>
      <div
        id="container"
        key="barchart-container"
        style={{ width: `${cWidth}px`, height: `${cHeight}px` }}
      >
        <Barchart
          fill={cFill}
          dataX={SampleData[cDataIndex].dataX}
          dataY={SampleData[cDataIndex].dataY}
        />
      </div>
    </>
  );
}

export default App;
