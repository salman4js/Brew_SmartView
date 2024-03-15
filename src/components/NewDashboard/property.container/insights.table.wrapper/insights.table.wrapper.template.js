import React from 'react';
import Chart from 'chart.js/auto';
import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

class InsightsTableWrapperTemplate {
    constructor(options) {
        this.options = options;
        this._registerChartJs();
    };

    _registerChartJs(){
        ChartJS.register(BarElement, LinearScale, Tooltip, Legend);
    };

    _renderInsightsView(){
        return (
            <div>
                <Bar
                    data={this.options.data.weeklyData}
                    height={this.options.height}
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
    };
}

export default InsightsTableWrapperTemplate;