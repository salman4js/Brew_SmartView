import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bwt from 'brew-date';
import Panel from '../../Panel/Panel';
import PanelFooter from '../../Panel/PanelFooter';
import Modal from 'react-bootstrap/Modal';
import Variables from '../../Variables';
import Navbar from '../../Navbar';
import BarChart from './BarChart/BarChart';
import Drop from './Dropdown/Drop';
import { Link, useParams } from 'react-router-dom';
import changeScreen from '../../Action';


const Charts = () => {

  // ID instance!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);

  // Dates weekly estimation!
  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();

  // Date picker handler!
  const [open, setOpen] = useState(false);

  // Weekly data state handler!
  const [week, setWeek] = useState({
    label: undefined,
    data: undefined
  })

  // Chart-Dashboard API calls!
  async function batchesApi() {

    // Week bar chart required data!
    const datesBetween = bwt.getBetween("2023/03/10", "2023/03/15");

    const weeklyData = {
      dates: datesBetween
    }

    const week = await axios.post(`${Variables.hostId}/${splitedIds[0]}/weeklyestimate`, weeklyData)
    axios.all([week])
      .then(axios.spread((...responses) => {
        const weekly = responses[0];

        // Weekly Bar Chart data from the API
        if (weekly.data.success) {
          setWeek({
            ...week,
            label: weekly.data.dates,
            data: weekly.data.message
          })
        } else {
          sessionExpired()
        }

      }))

  }

  // Session expired function incase of api call fails!
  function sessionExpired() {
    localStorage.clear();
    changeScreen();
  }

  // Dataset for the bar chart!
  // Datasets!
  const WeeklyData = {
    labels: week.label,
    datasets: [
      {
        label: 'BY DATES',
        data: week.data,
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

  // Handle Date Picker 
  function handleDrop(){
    setOpen(!open);
  }

  // Constructor!
  useEffect(() => {
    batchesApi();
  }, [])

  return (
    <div>
      <Navbar id={id} name={splitedIds[1]} />
      <div className="chart-container">
        {open && (
          <div>
            <Modal
              show = {open}
              onHide = {handleDrop}
            >
              <Modal.Header closeButton>
                  Date Picker
              </Modal.Header>
              <Panel text = "Choose Start & End Dates" className = "text-center" config = "DatePicker" date1 = {(data) => setDate1(data)} date2 = {(data) => setDate2(data)}  />
              <PanelFooter success = "Search" failure = "Cancel" onSuccess = {() => console.log("Success triggered")} onFailure = {() => console.log("Modal has been closed!")} />
            </Modal>
          </div>
        )}
        <div className="chart-view">
          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop()} />
            </div>
            <BarChart data={WeeklyData} />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Weekly Bar Chart!
            </div>
          </div>
          <div className="bar-chart">
            <BarChart data={WeeklyData} />
          </div>
          {/* <div className="bar-chart">
            <BarChart data = {data} />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Charts;