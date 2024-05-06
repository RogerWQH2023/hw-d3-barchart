import { useEffect, useRef, useState } from "react";
import {
  min,
  max,
  select,
  scaleLinear,
  scaleBand,
  axisBottom,
  axisLeft,
} from "d3";
/**
 *
 * @param width 图表宽度
 * @param height 图表高度
 * @param fill 图表填充色
 * @param dataX 图表X轴数据
 * @param dataY 图表y轴数据
 */
const DrawChart = (
  width: number,
  height: number,
  fill: string,
  dataX: Array<string>,
  dataY: Array<number>
) => {
  /*
  //（现在数据由参数传入）输入数据，这里dataY作为实际的值，而dataX作为X轴的标签 
  //const dataY = [-10, -50, -100, -150, -200, -250, -300];
  //const dataX = ["A", "B", "C", "D", "E", "F", "G"]; 
  */

  //接下来创建坐标轴的范围（一个数组），决定了我们坐标轴上的最大和最小值
  //如果dataY有负数则最小为该值，否则为0
  //由于需要考虑全是负值的情况，所以dataY有正数则最大为该值，否则为0
  const yDomain = [
    min([0, min(dataY) as number]) as number,
    max([0, max(dataY) as number]) as number,
  ];
  const xDomain = dataX;

  //选中作为容器的元素
  const div = select("#barchatApp");

  const svg = div.append("svg");
  svg.attr("width", width);
  svg.attr("height", height);

  const marginBottom = 30,
    marginTop = 30;
  const marginLeft = 40,
    marginRight = 20;

  // 创建比例尺（使用D3提供的方法进行创建）
  const y = scaleLinear(yDomain, [height - marginBottom, marginTop]);
  const x = scaleBand(xDomain, [marginLeft, width - marginRight]).padding(0.2);

  // 绘制柱形（本质上为矩形）。
  //大致原理：使用.data(dataY)作为Y轴导入数据，使用.enter(),之后的链式调用会变成对dataY中的每个值进行操作。
  //里面的d，其实就是dataY中的当前值。应该是d3的.attr中也可以用一个(data,index)=>{...}的函数来生成值
  //y(d)，其实就是当前的值d，在坐标轴y上所处的位置的y轴坐标。（坐标是从svg原点即左上角开始计算的）
  //由此区分正和负两种值，即可完成计算。
  svg
    .selectAll("g")
    .data(dataY)
    .enter()
    .append("rect")
    .style("fill", fill)
    .attr("x", (d, i) => x(dataX[i]) as number)
    .attr("y", (d) => {
      if (d >= 0) {
        return y(d);
      } else {
        return y(0);
      }
    })
    .attr("width", x.bandwidth())
    .attr("height", (d) => {
      console.log("d:" + d);
      console.log("y(d):" + y(d));
      if (d >= 0) {
        return (
          height -
          y(d) -
          (y(min([0, min(dataY) as number]) as number) - y(0)) -
          marginBottom
        );
      } else {
        return y(d) - y(0);
      }
    });

  /*   //添加数字注记：尚未成功
  svg
    .selectAll("g")
    .data(dataY)
    .enter()
    .append("text")
    .attr("x", (d, i) => x(dataX[i]) as number)
    .attr("y", (d) => {
      if (d >= 0) {
        return y(d);
      } else {
        return y(0);
      }
    })
    .attr("width", x.bandwidth())
    .attr("height", (d) => {
      console.log("d:" + d);
      console.log("y(d):" + y(d));
      if (d >= 0) {
        return (
          height -
          y(d) -
          (y(min([0, min(dataY) as number]) as number) - y(0)) -
          marginBottom
        );
      } else {
        return y(d) - y(0);
      }
    })
    .text((d) => d)
    .attr("font-size", 10)
    .attr("text-anchor", "middle"); */

  svg
    .append("g")
    .attr("transform", `translate(0,${y(0)})`)
    .call(axisBottom(x));

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(axisLeft(y));
};
const clearChart = (element: any) => {
  if (element.current) {
    element.current.innerHTML = "";
  }
};

/**
 *
 * @param props
 * fill为填充的颜色，dataX为X轴的数据，dataY为数据轴（y轴）的数据
 * @returns
 */
const Barchart = (props: {
  fill: string;
  dataX: Array<string>;
  dataY: Array<number>;
}) => {
  const { fill, dataX, dataY } = props;
  const barchatAppRef = useRef<HTMLDivElement>(null);
  const [cWidth, setCWidth] = useState(100);
  const [cHeight, setCHeight] = useState(100);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        console.log(`Size changed. New width: ${width}, New height: ${height}`);
        setCWidth(width);
        setCHeight(height);
      }
    });

    if (barchatAppRef.current) {
      resizeObserver.observe(barchatAppRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    DrawChart(cWidth, cHeight, fill, dataX, dataY);
    return () => {
      clearChart(barchatAppRef);
    };
  }, [cWidth, cHeight, props]);
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(230,230,230)",
      }}
      id="barchatApp"
      ref={barchatAppRef}
    ></div>
  );
};
export default Barchart;
