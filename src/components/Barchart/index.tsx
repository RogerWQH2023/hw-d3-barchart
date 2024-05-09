import { useEffect, useRef, useState } from "react";
import {
  clearChart,
  defaultBarchartOptions,
  DrawChart,
  UpdateChart,
} from "./core";
import type { BarchartOptions } from "./core";
/**
 *
 * @param props
 * fill为填充的颜色，dataX为X轴的数据，dataY为数据轴（y轴）的数据
 * @returns
 */
const Barchart = (
  props: {
    barchartOptions: BarchartOptions;
  } = { barchartOptions: defaultBarchartOptions }
) => {
  const { barchartOptions } = props;
  const barchartAppRef = useRef<HTMLDivElement>(null);
  const [cWidth, setCWidth] = useState(100);
  const [cHeight, setCHeight] = useState(100);

  //加入监听容器长宽变化的监听器，当容器长款发生变化时更改state
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        //console.log(`Size changed. New width: ${width}, New height: ${height}`);
        setCWidth(width);
        setCHeight(height);
      }
    });

    if (barchartAppRef.current) {
      resizeObserver.observe(barchartAppRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  //创建svg，只在开始时运行一次，之后全使用UpdateChart进行更新
  //当组件卸载时，自动析构
  useEffect(() => {
    DrawChart(barchartAppRef.current, cWidth, cHeight, barchartOptions);
    return () => {
      clearChart(barchartAppRef.current);
    };
  }, []);

  //组件更新的副作用。当长/宽或传入属性发生变化时使用UpdateChart进行更新
  useEffect(() => {
    UpdateChart(barchartAppRef.current, cWidth, cHeight, barchartOptions);
  }, [cWidth, cHeight, props]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(230,230,230)",
      }}
      className={".barchartContainer"}
      ref={barchartAppRef}
    ></div>
  );
};
export default Barchart;
