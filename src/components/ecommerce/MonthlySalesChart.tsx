"use client";
import React, { lazy, Suspense } from "react";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = lazy(() => import("react-apexcharts"));

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  };

  const series = [
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 75, 80],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Sales
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you've set for each month
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Suspense fallback={<div>Loading chart...</div>}>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={310}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
