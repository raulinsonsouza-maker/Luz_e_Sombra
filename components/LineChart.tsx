'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      tension?: number
    }[]
  }
}

export default function LineChart({ data }: LineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#2f251b',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(47, 37, 27, 0.92)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
          color: '#5f4a2f',
        },
        grid: {
          color: 'rgba(156, 119, 66, 0.15)',
        }
      },
      x: {
        ticks: {
          color: '#5f4a2f',
        },
        grid: {
          color: 'rgba(156, 119, 66, 0.08)',
        }
      }
    },
  }

  return (
    <div className="w-full p-4 luxury-card">
      <Line data={data} options={options} />
    </div>
  )
}
