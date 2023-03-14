import React from 'react';
import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

import Chart from 'chart.js/auto';


import { Bar } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    LinearScale,
    Tooltip,
    Legend
)

const BarChart = () => {

    // Datasets!
    const data = {
        labels: ['Jan', 'Feb', "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept","Oct", "Nov", "Dec"],
        datasets:[
            {
                label: 'Monthly',
                data: [2,7,1,4,10,15,12,18,12,11,24,10],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
            }
        ]
    }

    // Options!
    const options = {

    }

  return (
    <div>
    <Bar
        data={data}
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 25,
            },
          },
        }}
      />
    </div>
  )
}

export default BarChart;