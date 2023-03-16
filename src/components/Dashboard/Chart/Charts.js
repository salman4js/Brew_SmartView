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

  // isWeek or isMonth state handler!
  const [panel, setPanel] = useState({
    isWeek: false,
    isMonth: false
  })

  // Dates weekly estimation!
  const [date1, setDate1] = useState(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6));
  const [date2, setDate2] = useState(bwt.getFullDate("yyyy/mm/dd"));

  // Date picker handler!
  const [open, setOpen] = useState(false);

  // Weekly data state handler!
  const [week, setWeek] = useState({
    label: undefined,
    data: undefined
  })

  // Monthly data state handler!
  const [month, setMonth] = useState({
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

    const monthlyData = {
     datesBetween: bwt.getAllDatesOfMonth(new Date().getFullYear(), new Date().getMonth())
    }

    // Weekly Function!
    async function weeklyEstimate(){
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/weeklyestimate`, weeklyData)
    }

    // Monthly Function!
    async function monthlyEstimate(){
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/totaldailycalculator`, monthlyData)
    }

    // API calls
    axios.all([weeklyEstimate(), monthlyEstimate()])
      .then(axios.spread((...responses) => {
        const weekly = responses[0];
        const monthly = responses[1];

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

        // Monthly Line chart data from the API
        if(monthly.data.success){
          setMonth({
            ...month,
            label: monthly.data.label,
            data: monthly.data.dailyCollection
          })
        } else {
          sessionExpired();
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

  // Weekly data Datasets!
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

   // Monthly data Datasets!
   const monthlyData = {
    labels: month.label,
    datasets: [
      {
        label: 'BY DATES',
        data: month.data,
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
  function handleDrop(data){
    if(data === "week"){
      setPanel({
        ...panel,
        isWeek: true,
        isMonth: false
      })
      changeDropState();
    } else if(data === "month") {
      setPanel({
        ...panel,
        isWeek: false,
        isMonth: true
      })
      changeDropState();
    } else {
      changeDropState();
    }

    function changeDropState(){
      setOpen(!open)
    }

  }

  // Weekly estimated function!
  async function weeklyEstimated() {
    if(open){
      handleDrop(); //Close the modal only when the modal is true!
    }
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
  }

  // Calling the weeklyEstimated function only after the states has been updated cause of asynchronous behaviour!
  useEffect(() => {
    if (date1 && date2) {
      weeklyEstimated();
    }
  }, [date1, date2]);


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
              <Panel text = "Choose Start & End Dates" textMonthly = "Choose Month" isWeek = {panel.isWeek} isMonth = {panel.isMonth} className = "text-center" config = "DatePicker" date1 = {(data) => setDate1(data)} date2 = {(data) => setDate2(data)} handleDrop = {() => handleDrop()} getData = {(data) => getData(data)}  />
            </Modal>
          </div>
        )}
        <div className="chart-view">

          {/* Weekly Bar Chart */}
          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop("week")} />
            </div>
            <BarChart data={WeeklyData} title = "Weekly" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Weekly Bar Chart!
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop()} />
            </div>
            <BarChart data={WeeklyData} title = "Weekly" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Monthly Bar Chart!
            </div>
          </div>

          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop("month")} />
            </div>
            <BarChart data={monthlyData} title = "Monthly" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Monthly Bar Chart!
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Charts;