'use client';

import Chart from "chart.js/auto";
import {
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

type ChartDataProps = any;

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
  

export function BarChart({ chartData }: ChartDataProps) {
    return (
      <div className="chart-container self-stretch">
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    );
  }

const Data = [
    {
      id: 1,
      year: 2023,
      userGain: 80000,
      userLost: 823
    },
    {
      id: 2,
      year: 2024,
      userGain: 45677,
      userLost: 345
    },
    {
      id: 3,
      year: 2024,
      userGain: 78888,
      userLost: 555
    },
    {
      id: 4,
      year: 2023,
      userGain: 90000,
      userLost: 4555
    },
    {
      id: 5,
      year: 2024,
      userGain: 4300,
      userLost: 234
    }
  ];

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


export function TotalOrdersCard() {
    const [chartData, setChartData] = useState({
        labels: labels, 
        datasets: [
          {
            label: "2023",
            data: Data.filter(data => data.year === 2023).map((data) => data.userGain),
            backgroundColor: [
              "rgba(75,192,192,1)",
            ],
          },
          {
            label: "2024",
            data: Data.filter(data => data.year === 2024).map((data) => data.userGain),
            backgroundColor: [
                "&quot;#ecf0f1",
            ],
          },
        ]
      });
      
    return (
        <div className="flex flex-1 items-end justify-center self-stretch">
            <BarChart chartData={chartData} />
        </div>
    )
}