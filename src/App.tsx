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
  const [cDisplayLabel, setCDisplayLabel] = useState(true);
  const [cDisplayTooltip, setCDisplayTooltip] = useState(true);
  const [cDataIndex, setCDataIndex] = useState(2);
  const [cWidth2, setCWidth2] = useState(500);
  const [cHeight2, setCHeight2] = useState(450);
  const [cFill2, setCFill2] = useState("#469BDD");
  const [cDisplayLabel2, setCDisplayLabel2] = useState(true);
  const [cDisplayTooltip2, setCDisplayTooltip2] = useState(true);
  const [cDataIndex2, setCDataIndex2] = useState(3);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="controller">
          <label>Width:</label>
          <br />
          <input
            className="input-width"
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
            className="input-height"
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
            className="input-color"
            type="color"
            value={cFill}
            onChange={(e: any) => {
              setCFill(e.target.value);
            }}
          />
          <br />
          <label>Display Label:</label>
          <input
            type="checkbox"
            className="input-label-checkbox"
            checked={cDisplayLabel}
            onChange={(e) => {
              setCDisplayLabel(!cDisplayLabel);
            }}
          />
          <br />
          <label>Display Tooltip:</label>
          <input
            type="checkbox"
            className="input-tooltip-checkbox"
            checked={cDisplayTooltip}
            onChange={(e) => {
              setCDisplayTooltip(!cDisplayTooltip);
            }}
          />
          <br />
          <label>Sample Data:</label>
          <select
            value={cDataIndex}
            className="input-dataSelect"
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
        <div className="controller">
          <label>Width:</label>
          <br />
          <input
            className="input-width"
            type="range"
            value={cWidth2}
            min={100}
            max={800}
            step={1}
            onInput={(e: any) => {
              setCWidth2(e.target.value);
            }}
          />
          <label> {cWidth2}px</label>
          <br />
          <label>Height:</label>
          <br />
          <input
            className="input-height"
            type="range"
            value={cHeight2}
            min={100}
            max={800}
            step={1}
            onInput={(e: any) => {
              setCHeight2(e.target.value);
            }}
          />
          <label> {cHeight2}px</label>
          <br />
          <label>Color:</label>
          <input
            className="input-color"
            type="color"
            value={cFill2}
            onChange={(e: any) => {
              setCFill2(e.target.value);
            }}
          />
          <br />
          <label>Display Label:</label>
          <input
            type="checkbox"
            className="input-label-checkbox"
            checked={cDisplayLabel2}
            onChange={(e) => {
              setCDisplayLabel2(!cDisplayLabel2);
            }}
          />
          <br />
          <label>Display Tooltip:</label>
          <input
            type="checkbox"
            className="input-tooltip-checkbox"
            checked={cDisplayTooltip2}
            onChange={(e) => {
              setCDisplayTooltip2(!cDisplayTooltip2);
            }}
          />
          <br />
          <label>Sample Data:</label>
          <select
            value={cDataIndex2}
            className="input-dataSelect"
            onChange={(e) => {
              setCDataIndex2(Number(e.target.value));
            }}
          >
            {SampleData.map((item, index) => {
              return (
                <option key={`option2-${item.name}`} value={index}>
                  {item.name}
                </option>
              );
            })}
          </select>
          <br />
          <div style={{ width: "100%", overflowX: "scroll" }}>
            <span style={{ marginRight: 10 }}>
              <b>UnitX: </b>
              {SampleData[cDataIndex2].unitX}
            </span>
            <span>
              <b>UnitY: </b>
              {SampleData[cDataIndex2].unitY}
            </span>
            <table border={1}>
              <tbody>
                <tr>
                  <th>DataX:</th>
                  {SampleData[cDataIndex2].dataX.map((item, index) => {
                    return <td key={`controll2-td-0-${index}`}>{item}</td>;
                  })}
                </tr>
                <tr>
                  <th>DataY:</th>
                  {SampleData[cDataIndex2].dataY.map((item, index) => {
                    return <td key={`controll2-td-1-${index}`}>{item}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          className="container"
          key="barchart-container"
          style={{ width: `${cWidth}px`, height: `${cHeight}px` }}
        >
          <Barchart
            fill={cFill}
            unitX={SampleData[cDataIndex].unitX}
            unitY={SampleData[cDataIndex].unitY}
            displayLabel={cDisplayLabel}
            displayTooltip={cDisplayTooltip}
            dataX={SampleData[cDataIndex].dataX}
            dataY={SampleData[cDataIndex].dataY}
          />
        </div>
        <div
          className="container"
          key="barchart-container2"
          style={{ width: `${cWidth2}px`, height: `${cHeight2}px` }}
        >
          <Barchart
            fill={cFill2}
            unitX={SampleData[cDataIndex2].unitX}
            unitY={SampleData[cDataIndex2].unitY}
            displayLabel={cDisplayLabel2}
            displayTooltip={cDisplayTooltip2}
            dataX={SampleData[cDataIndex2].dataX}
            dataY={SampleData[cDataIndex2].dataY}
          />
        </div>
      </div>
    </>
  );
}

export default App;
