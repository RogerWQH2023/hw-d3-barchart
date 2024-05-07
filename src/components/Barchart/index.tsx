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
import { v4 as uuidv4 } from "uuid";

//全局转换动画的持续时间
const DEFAULT_DURATION = 300;
//为当前柱状图组件的入口元素设置一个唯一的UUID，用于防止不同柱状图组件之间相互冲突
//由于id的首位不能是数字，所以前面加一个barchart
const generateUUID = () => {
  return "barchartapp-" + uuidv4();
};

/**
 * 绘制柱状图
 * @param width 图表宽度
 * @param height 图表高度
 * @param fill 图表填充色
 * @param unitX X轴单位
 * @param unitY Y轴单位
 * @param displayLabel 是否显示标签
 * @param displayTooltip 是否让柱状图交互显示ToolTip
 * @param dataX 图表X轴数据
 * @param dataY 图表y轴数据
 */
const DrawChart = (
  appUUID: string,
  width: number,
  height: number,
  fill: string,
  unitX: string,
  unitY: string,
  displayLabel: boolean,
  displayTooltip: boolean,
  dataX: Array<string>,
  dataY: Array<number>
) => {
  //（现在数据由参数传入）输入数据，这里dataY作为实际的值，而dataX作为X轴的标签

  //接下来创建坐标轴的范围（一个数组），决定了我们坐标轴上的最大和最小值
  //如果dataY有负数则最小为该值，否则为0
  //由于需要考虑全是负值的情况，所以dataY有正数则最大为该值，否则为0
  const yDomain = [
    min([0, min(dataY) as number]) as number,
    max([0, max(dataY) as number]) as number,
  ];
  const xDomain = dataX;

  //选中作为容器的元素
  const div = select(`#${appUUID}`);

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

  //！！！设置一个g用于存储柱形图（需要先append这个g，然后再select("#id").selectAll("g")才能再这个g里面绘制，我也不知道为什么）
  svg.append("g").attr("class", "svg-bars");

  // 绘制柱形（本质上为矩形）。
  //大致原理：使用.data(dataY)作为Y轴导入数据，使用.enter(),之后的链式调用会变成对dataY中的每个值进行操作。
  //里面的d，其实就是dataY中的当前值。应该是d3的.attr中也可以用一个(data,index)=>{...}的函数来生成值
  //y(d)，其实就是当前的值d，在坐标轴y上所处的位置的y轴坐标。（坐标是从svg原点即左上角开始计算的）
  //由此区分正和负两种值，即可完成计算。
  svg
    .select(".svg-bars")
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
      if (d >= 0) {
        //如果当前数据大于0，则其高度应该为height-y(d)再减去y(0)到y(min)的差距（当y(min)=y(0)时这段为0）,再减去marginBottom
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

  //设置一个g用于存储注记
  svg.append("g").attr("class", "svg-bar-texts");
  if (displayLabel) {
    //添加数字注记
    svg
      .select(".svg-bar-texts")
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
      .text((d) => d)
      .attr("font-size", 10)
      .attr("text-anchor", "middle");
  }

  //增加柱状图交互，显示Tooltip
  const tooltip = div
    .append("div")
    .attr("class", "svg-barchart-tooltip")
    .style("height", "20px")
    .style("position", "absolute")
    .style("padding", "5px")
    .style("background", "#fff")
    .style("border-radius", "3px")
    .style("box-shadow", "1px 1px 1px rgba(0, 0, 0, 0.5)")
    .style("display", "none");
  if (displayTooltip) {
    svg
      .select(".svg-bars")
      .selectAll("rect")
      .data(dataY)
      .on("mouseover", function (event, d) {
        select(this).style("filter", "brightness(1.5)"); // 亮度增加
        tooltip.style("display", "block");
      })
      .on("mousemove", function (event, d) {
        tooltip
          .style("left", Number(event.offsetX) + "px")
          .style("top", Number(event.offsetY) - 40 + "px")
          .html(`${d}`);
      })
      .on("mouseout", function (d) {
        select(this).style("filter", "brightness(1)"); // 亮度恢复
        tooltip.style("display", "none");
      });
  }

  //绘制坐标轴
  //注意需要设置id，之后更新时调用！
  svg
    .append("g")
    .attr("class", "svg-axisBottom")
    .attr("transform", `translate(0,${y(0)})`)
    .call(axisBottom(x));
  svg
    .append("g")
    .attr("class", "svg-axisLeft")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(axisLeft(y));
  //绘制单位（注意要用id标识，之后还要用）
  svg
    .append("text")
    .text(unitY)
    .attr("class", "svg-unitLeft")
    .attr("text-anchor", "middle") //文字水平居中
    .attr("x", marginLeft)
    .attr("y", marginTop - 12)
    .attr("font-size", 10);
  svg
    .append("text")
    .text(unitX)
    .attr("class", "svg-unitBottom")
    .attr("width", 40)
    .attr("text-anchor", "middle") //文字水平居中
    .attr("x", width - marginRight)
    .attr("y", y(0) + 18)
    .attr("font-size", 10);
};
/**
 * 更新柱状图状态
 * @param width 图表宽度
 * @param height 图表高度
 * @param fill 图表填充色
 * @param unitX X轴单位
 * @param unitY Y轴单位
 * @param displayLabel 是否显示标签
 * @param displayTooltip 是否让柱状图交互显示ToolTip
 * @param dataX 图表X轴数据
 * @param dataY 图表y轴数据
 */
const UpdateChart = (
  appUUID: string,
  width: number,
  height: number,
  fill: string,
  unitX: string,
  unitY: string,
  displayLabel: boolean,
  displayTooltip: boolean,
  dataX: Array<string>,
  dataY: Array<number>
) => {
  //接下来创建坐标轴的范围（一个数组），决定了我们坐标轴上的最大和最小值
  //如果dataY有负数则最小为该值，否则为0
  //由于需要考虑全是负值的情况，所以dataY有正数则最大为该值，否则为0
  const yDomain = [
    min([0, min(dataY) as number]) as number,
    max([0, max(dataY) as number]) as number,
  ];
  const xDomain = dataX;

  //选中作为容器的元素
  const div = select(`#${appUUID}`);
  //选中svg元素
  const svg = div.select("svg");

  svg.attr("width", width);
  svg.attr("height", height);

  const marginBottom = 30,
    marginTop = 30;
  const marginLeft = 40,
    marginRight = 20;

  // 创建比例尺（使用D3提供的方法进行创建）
  const y = scaleLinear(yDomain, [height - marginBottom, marginTop]);
  const x = scaleBand(xDomain, [marginLeft, width - marginRight]).padding(0.2);

  // 更新柱形图：注意需要分为.enter()和.exit()两个步骤
  //enter()步骤里面，补齐了缺少的rect
  //exit()步骤里面，删除了多余的rect
  //！！enter和exit并不会同时起效果，如果少了了则enter+append，如果多了则exit+remove。
  //这里因为没法提前知道是哪种情况，所以都写上去了，但是其实只有一个有效果。
  const bars = svg.select(".svg-bars").selectAll("rect");
  bars.data(dataY).enter().append("rect");
  bars.data(dataY).exit().remove();
  //在处理完拓展/删除后，重新选中所有的柱状图，完成更新。
  svg
    .select(".svg-bars")
    .selectAll("rect")
    .data(dataY)
    .transition()
    .duration(DEFAULT_DURATION)
    .style("fill", fill)
    .style("z-index", 1)
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
      if (d >= 0) {
        //如果当前数据大于0，则其高度应该为height-y(d)再减去y(0)到y(min)的差距（当y(min)=y(0)时这段为0）,再减去marginBottom
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

  //更新注记（猜测：有enter才能触发append，有exit才能触发remove）
  //进行注记图元的增删
  const bartexts = svg.select(".svg-bar-texts").selectAll("text");
  if (displayLabel) {
    bartexts.data(dataY).enter().append("text");
    bartexts.data(dataY).exit().remove();
    //更新数字注记
    svg
      .select(".svg-bar-texts")
      .selectAll("text")
      .data(dataY)
      .transition()
      .duration(DEFAULT_DURATION)
      .style("fill", fill)
      .attr("text-anchor", "middle") //文字水平居中
      .attr("alignment-baseline", "middle") //文字垂直居中;
      .attr("x", (d, i) => (x(dataX[i]) as number) + 0.5 * x.bandwidth())
      .attr("y", (d) => {
        if (d >= 0) {
          return y(d) - 5;
        } else {
          return y(d) + 5;
        }
      })
      .text((d) => d)
      .attr("font-size", 10);
  } else {
    bartexts.remove();
  }

  //更新标签
  const tooltip = div.select(".svg-barchart-tooltip");
  //删除原事件
  svg
    .select(".svg-bars")
    .selectAll("rect")
    .on("mouseover", null)
    .on("mouseout", null)
    .on("mousemove", null);
  if (displayTooltip) {
    //新增事件
    svg
      .select(".svg-bars")
      .selectAll("rect")
      .data(dataY)
      .on("mouseover", function (event, d) {
        select(this).style("filter", "brightness(1.5)"); // 亮度增加
        tooltip.style("display", "block");
      })
      .on("mousemove", function (event, d) {
        tooltip
          .style("left", Number(event.offsetX) + "px")
          .style("top", Number(event.offsetY) - 40 + "px")
          .html(`${d}`);
      })
      .on("mouseout", function (d) {
        select(this).style("filter", "brightness(1)"); // 亮度恢复
        tooltip.style("display", "none");
      });
  }

  //更新坐标轴
  svg
    .select(".svg-axisBottom")
    .transition()
    .duration(DEFAULT_DURATION)
    .style("z-index", 2)
    .attr("transform", `translate(0,${y(0)})`)
    .call(axisBottom(x) as any);
  svg
    .select(".svg-axisLeft")
    .transition()
    .duration(DEFAULT_DURATION)
    .style("z-index", 2)
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(axisLeft(y) as any);
  //更新单位
  svg
    .select(".svg-unitLeft")
    .transition()
    .duration(DEFAULT_DURATION)
    .text(unitY)
    .attr("x", marginLeft)
    .attr("text-anchor", "middle") //文字水平居中
    .attr("y", marginTop - 12)
    .attr("font-size", 10);
  svg
    .select(".svg-unitBottom")
    .transition()
    .duration(DEFAULT_DURATION)
    .text(unitX)
    .attr("width", 40)
    .attr("text-anchor", "middle") //文字水平居中
    .attr("x", width - marginRight)
    .attr("y", y(0) + 18)
    .attr("font-size", 10);
};
//根据当前APP的APPUUID来清除所有svg
const clearChart = (appUUID: string) => {
  select(`#${appUUID}`).selectAll("svg").remove();
};

/**
 *
 * @param props
 * fill为填充的颜色，dataX为X轴的数据，dataY为数据轴（y轴）的数据
 * @returns
 */
const Barchart = (props: {
  fill?: string;
  unitX?: string;
  unitY?: string;
  displayLabel?: boolean;
  displayTooltip?: boolean;
  dataX: Array<string>;
  dataY: Array<number>;
}) => {
  const {
    fill = "steelblue",
    unitX = "",
    unitY = "",
    displayLabel = true,
    displayTooltip = true,
    dataX,
    dataY,
  } = props;
  const barchartAppRef = useRef<HTMLDivElement>(null);
  const barchartAppUUID = useRef<string>(generateUUID());
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
    DrawChart(
      barchartAppUUID.current,
      cWidth,
      cHeight,
      fill,
      unitX,
      unitY,
      displayLabel,
      displayTooltip,
      dataX,
      dataY
    );
    return () => {
      clearChart(barchartAppUUID.current);
    };
  }, []);

  //组件更新的副作用。当长/宽或传入属性发生变化时使用UpdateChart进行更新
  useEffect(() => {
    UpdateChart(
      barchartAppUUID.current,
      cWidth,
      cHeight,
      fill,
      unitX,
      unitY,
      displayLabel,
      displayTooltip,
      dataX,
      dataY
    );
  }, [cWidth, cHeight, props]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgb(230,230,230)",
      }}
      id={barchartAppUUID.current}
      ref={barchartAppRef}
    ></div>
  );
};
export default Barchart;
