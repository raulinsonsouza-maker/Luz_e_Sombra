'use client'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: {
    labels: string[]
    values: number[]
  }
}

export default function RadarChart({ data }: RadarChartProps) {
  if (!data?.labels || !data?.values) return null

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Suas Áreas da Vida',
        data: data.values,
        backgroundColor: 'rgba(156, 119, 66, 0.16)',
        borderColor: 'rgba(156, 119, 66, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(200, 165, 107, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(152, 121, 76, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2, color: '#5f4a2f' },
        pointLabels: { font: { size: 12, weight: 'bold' as const }, color: '#2f251b' },
        grid: { color: 'rgba(156, 119, 66, 0.18)' },
        angleLines: { color: 'rgba(156, 119, 66, 0.15)' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Nota: ${context.parsed.r}/10`
        },
      },
    },
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4 luxury-card">
      <Radar data={chartData} options={options} />
    </div>
  )
}
