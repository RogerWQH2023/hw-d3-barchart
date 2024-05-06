import { useState } from "react";
import "./App.css";
import Barchart from "./components/Barchart";

const SampleData = [
  {
    name: "All Negative",
    unitX: "unit/X0",
    unitY: "unit/Y0",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [-10, -50, -100, -150, -200, -250, -300],
  },
  {
    name: "All Positive",
    unitX: "unit/X1",
    unitY: "unit/Y1",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [10, 50, 100, 150, 200, 250, 300],
  },
  {
    name: "Positive and Negative",
    unitX: "unit/X2",
    unitY: "unit/Y2",
    dataX: ["A", "B", "C", "D", "E", "F", "G"],
    dataY: [-10, 50, -100, 150, -200, 250, 300],
  },
  {
    name: "Longer Data",
    unitX: "unit/X3",
    unitY: "unit/Y3",
    dataX: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
    dataY: [10, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
  },
  {
    name: "Shorter Data",
    unitX: "unit/X4",
    unitY: "unit/Y4",
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
            return (
              <option key={`option-${item.name}`} value={index}>
                {item.name}
              </option>
            );
          })}
        </select>
        <br />
        <div style={{ width: "100%", overflowX: "scroll" }}>
          <span style={{ marginRight: 10 }}>
            <b>UnitX: </b>
            {SampleData[cDataIndex].unitX}
          </span>
          <span>
            <b>UnitY: </b>
            {SampleData[cDataIndex].unitY}
          </span>
          <table border={1}>
            <tbody>
              <tr>
                <th>DataX:</th>
                {SampleData[cDataIndex].dataX.map((item, index) => {
                  return <td key={`controll-td-0-${index}`}>{item}</td>;
                })}
              </tr>
              <tr>
                <th>DataY:</th>
                {SampleData[cDataIndex].dataY.map((item, index) => {
                  return <td key={`controll-td-1-${index}`}>{item}</td>;
                })}
              </tr>
            </tbody>
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
          unitX={SampleData[cDataIndex].unitX}
          unitY={SampleData[cDataIndex].unitY}
          dataX={SampleData[cDataIndex].dataX}
          dataY={SampleData[cDataIndex].dataY}
        />
      </div>
    </>
  );
}

export default App;
