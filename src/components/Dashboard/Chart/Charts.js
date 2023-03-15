import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bwt from 'brew-date';
import Panel from '../../Panel/Panel';
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
  const [date1, setDate1] = useState(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 7));
  const [date2, setDate2] = useState(bwt.getFullDate("yyyy/mm/dd"));

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
    const datesBetween = bwt.getBetween(date1, date2);

    const weeklyData = {
      dates: datesBetween
    }

    // Weekly Function!
    async function weeklyEstimate(){
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/weeklyestimate`, weeklyData)
    }
    //const week = await axios.post(`${Variables.hostId}/${splitedIds[0]}/weeklyestimate`, weeklyData)
    axios.all([weeklyEstimate()])
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

      return {
        weeklyEstimate
      }

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
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
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

  // Weekly estimated function!
  async function weeklyEstimated() {
    const data = await batchesApi();
    data.weeklyEstimate();
  }
  

  // Make API call based on date picker value!
  function getData(data){
    const value = {
      date1: bwt.format(data.date1, "yyyy/mm/dd"),
      date2: bwt.format(data.date2, "yyyy/mm/dd")
    }
    setDate1(value.date1);
    setDate2(value.date2);

    // After assigning the date picker value to the state, call the desired weekly estimated function!
    weeklyEstimated();
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
              <Panel text = "Choose Start & End Dates" className = "text-center" config = "DatePicker" date1 = {(data) => setDate1(data)} date2 = {(data) => setDate2(data)} handleDrop = {() => handleDrop()} getData = {(data) => getData(data)}  />
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