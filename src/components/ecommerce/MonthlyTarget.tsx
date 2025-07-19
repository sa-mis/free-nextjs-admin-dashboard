"use client";
import React, { lazy, Suspense } from "react";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = lazy(() => import("react-apexcharts"));

export default function MonthlyTarget() {
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  const series = [65, 35];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Target
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
              type="donut"
              height={310}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
