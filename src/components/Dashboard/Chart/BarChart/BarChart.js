import React from 'react';
import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

import Chart from 'chart.js/auto';


import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    LinearScale,
    Tooltip,
    Legend
)

const BarChart = (props) => {

  if(props.title == "Weekly"){
    return (
      <div>
        <Bar
            data={props.data}
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
  } else if(props.title === "Monthly"){
    return(
      <div>
        <Line
            data={props.data}
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
  
}

export default BarChart;