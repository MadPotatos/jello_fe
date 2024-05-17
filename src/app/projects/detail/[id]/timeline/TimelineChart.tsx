import React from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TimelineChartProps {
  data: any;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  const options: any = {
    chart: {
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        horizontal: true,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: [number, number]) {
        const start = dayjs(val[0]);
        const end = dayjs(val[1]);
        const diff = end.diff(start, "day");
        return `${diff} ${diff > 1 ? "days" : "day"}`;
      },
      style: {
        fontSize: "16px",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          fontSize: "16px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "16px",
        },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
        const start = dayjs(dataPoint.y[0]);
        const end = dayjs(dataPoint.y[1]);
        return `<div class="p-2">
          <div class="text-lg text-sky-500">${dataPoint.x}</div>
          <div>Goal: ${dataPoint.goal}</div>
          <div class="text-gray-500">${start.format(
            "MMM DD, YYYY"
          )} - ${end.format("MMM DD, YYYY")}</div>
        </div>`;
      },
    },
  };

  return (
    <div style={{ overflowY: "auto", maxHeight: "600px" }}>
      <Chart
        options={options}
        series={[{ data }]}
        type="rangeBar"
        height={data.length * 100}
        width={"100%"}
      />
    </div>
  );
};

export default TimelineChart;
