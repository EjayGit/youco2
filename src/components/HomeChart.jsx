"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function JobsChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ['Anna', 'Craig', 'Darren', 'Samual'],
        datasets: [
          {
            label: "kgs CO2 per day",
            data: [15, 25, 40, 30],
            borderColor: "rgb(34, 197, 94)",
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            pointRadius: 4,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            type: "category",
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart w=1/2">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
