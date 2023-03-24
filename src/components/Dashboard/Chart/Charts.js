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
import Spinner from '../../Loader-T/Spinner';

const Charts = () => {

  // ID instance!
  const { id } = useParams();
  const splitedIds = id.split(/[-]/);

  // isWeek or isMonth state handler!
  const [panel, setPanel] = useState({
    isWeek: false,
    isMonth: false,
    isRoom: false
  })

  // Exceed state handler!
  const [showExceed, setShowExceed] = useState(false);

  // Loader State handler!
  const [loader, setLoader] = useState(true);

  // default dates weekly estimation!
  const [date1, setDate1] = useState(bwt.subDates(bwt.getFullDate("yyyy/mm/dd"), 6));
  const [date2, setDate2] = useState(bwt.getFullDate("yyyy/mm/dd"));

  // default dates monthly estimation!
  const [_mdate, set_mdate] = useState({
    _year: new Date().getFullYear(),
    _month: new Date().getMonth()
  });

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

  // Room Type Revenue State handler!
  const [_rev, set_rev] = useState({
    type: undefined,
    rate: undefined,
    total: undefined
  })


  // Chart-Dashboard API calls!
  async function batchesApi(currentDate) {

    // Week bar chart required data!
    const datesBetween = bwt.getBetween(date1, date2);

    const weeklyData = {
      dates: datesBetween
    }

    const monthlyData = {
      datesBetween: bwt.getAllDatesOfMonth(_mdate._year, _mdate._month)
    }

    // Weekly Function!
    async function weeklyEstimate() {
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/weeklyestimate`, weeklyData)
    }

    // Monthly Function!
    async function monthlyEstimate() {
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/totaldailycalculator`, monthlyData)
    }

    // Room Type Revenue Calculation!
    async function roomTypeRev() {
      return await axios.post(`${Variables.hostId}/${splitedIds[0]}/roomtyperev`, currentDate)
    }

    // API calls
    axios.all([weeklyEstimate(), monthlyEstimate(), roomTypeRev()])
      .then(axios.spread((...responses) => {
        const weekly = responses[0];
        const monthly = responses[1];
        const roomType = responses[2];

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
        if (monthly.data.success) {
          setMonth({
            ...month,
            label: monthly.data.label,
            data: monthly.data.dailyCollection
          })
        } else {
          sessionExpired();
        }

        // Room Type Revenue!
        if (roomType.data.success) {
          set_rev({
            type: Object.keys(roomType.data.roomTypeRev),
            rate: Object.values(roomType.data.roomTypeRev),
            total: roomType.data.total
          })
        } else {
          sessionExpired();
        }

      }))

      // When the data is fetched, make the loader to stop!
      setLoader(false);

    return {
      weeklyEstimate,
      monthlyEstimate,
      roomTypeRev
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
          'rgba(119, 159, 64, 0.8)',
          'rgba(118, 159, 64, 0.8)',
          'rgba(100, 159, 64, 0.8)',
          'rgba(45, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(119, 159, 64, 0.8)',
          'rgba(118, 159, 64, 0.8)',
          'rgba(100, 159, 64, 0.8)',
          'rgba(45, 159, 64, 0.8)',
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
          'rgba(149, 159, 64, 0.8)',
          'rgba(129, 159, 64, 0.8)',
          'rgba(138, 159, 64, 0.8)',
          'rgba(111, 159, 64, 0.8)',
          'rgba(120, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(119, 159, 64, 0.8)',
          'rgba(118, 159, 64, 0.8)',
          'rgba(100, 159, 64, 0.8)',
          'rgba(45, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      }
    ]
  }

  // Room type revenue estimation data!
  const roomData = {
    labels: _rev.type,
    datasets: [
      {
        label: 'BY DATES',
        data: _rev.rate,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(149, 159, 64, 0.8)',
          'rgba(129, 159, 64, 0.8)',
          'rgba(138, 159, 64, 0.8)',
          'rgba(111, 159, 64, 0.8)',
          'rgba(120, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(119, 159, 64, 0.8)',
          'rgba(118, 159, 64, 0.8)',
          'rgba(100, 159, 64, 0.8)',
          'rgba(45, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      }
    ]
  }

  // Handle Date Picker 
  function handleDrop(data) {
    if (data === "week") {
      setPanel({
        ...panel,
        isWeek: true,
        isMonth: false,
        isRoom: false
      })
      changeDropState();
    } else if (data === "month") {
      setPanel({
        ...panel,
        isWeek: false,
        isMonth: true,
        isRoom: false
      })
      changeDropState();
    } else if (data === "roomtype") {
      setPanel({
        ...panel,
        isWeek: false,
        isMonth: false,
        isRoom: true
      })
      changeDropState();
    } else {
      changeDropState();
    }

    function changeDropState() {
      setOpen(!open)
    }

    return {
      changeDropState
    }

  }

  // Weekly estimated function!
  async function weeklyEstimated() {
    if (open) {
      handleDrop(); //Close the modal only when the modal is true!
    }
    const data = await batchesApi();
    data.weeklyEstimate();
  }

  // Monthly estimated function!
  async function getMonthData() {
    if (open) {
      handleDrop();
    }
    const data = await batchesApi();
    data.monthlyEstimate();
  }

  // Room Type Revenue!
  async function getRoomType(value) {
    if (open) {
      handleDrop();
    }

    const resultDate = bwt.format(value, "yyyy/mm/dd");

    // Converting it into an object
    const requiredData = {
      date: resultDate
    }

    const data = await batchesApi(requiredData);
    data.roomTypeRev();
  }


  // Make API call based on date picker value!
  function getWeekData(data) {
    const value = {
      _date1: bwt.format(data.date1, "yyyy/mm/dd"),
      _date2: bwt.format(data.date2, "yyyy/mm/dd")
    }

    // Check the difference is lesser than 7 days!
    let diff = bwt.getBetween(value._date1, value._date2);

    if (diff.length <= 7) {
      setDate1(value._date1);
      setDate2(value._date2);
    } else {
      if (open) {
        handleDrop();
      }
      exceedStatus(); // Change the state value!
    }
  }

  // Hide & Show Exceed function!
  function exceedStatus() {
    setShowExceed(!showExceed);
  }

  function _showExceed() {
    return (
      <Modal
        show={_showExceed}
        onHide={exceedStatus}
      >
        <Panel text="Please choose a valid date in range of 7 days!" className="text-center" config="showExceed" />
      </Modal>
    )

  }

  // Calling the weeklyEstimated function only after the states has been updated cause of asynchronous behaviour!
  useEffect(() => {
    if (date1 && date2) {
      weeklyEstimated();
    }
  }, [date1, date2]);


  // Constructor!
  useEffect(() => {
    var currentDate = bwt.getFullDate("yyyy/mm/dd"); // Mandatory value for the room type revenue function!
    const data = {
      date: currentDate
    }
    batchesApi(data);
  }, [])

  return (
    <div>
      <Navbar id={id} name={splitedIds[1]} />
      {
        loader === true ? (
          <Spinner width = "120px" height = "120px" />
        ) : (
          <div className="chart-container">
        {
          showExceed ? (
            _showExceed()
          ) : (
            null
          )
        }
        {open && (
          <div>
            <Modal
              show={open}
              onHide={handleDrop}
            >
              <Modal.Header closeButton>
                Date Picker
              </Modal.Header>
              <Panel text="Choose Start & End Dates" textMonthly="Choose Month" isWeek={panel.isWeek} isMonth={panel.isMonth} isRoom={panel.isRoom}
                className="text-center" config="DatePicker"
                handleDrop={() => handleDrop()} getWeekData={(data) => getWeekData(data)}
                _year={(data) => set_mdate({ ..._mdate, _year: data })} _month={(data) => set_mdate({ ..._mdate, _month: data })}
                getMonthData={(data) => getMonthData(data)} getRoomType={(data) => getRoomType(data)}
              />
            </Modal>
          </div>
        )}
        <div className="chart-view">

          {/* Weekly Bar Chart */}
          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop("week")} />
            </div>
            <BarChart data={WeeklyData} title="Weekly" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Weekly Bar Chart!
            </div>
          </div>

          {/* Monthly Bar Chart */}
          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop("roomtype")} />
            </div>
            <BarChart data={roomData} title="RoomRevenue" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Room Type Analysis Chart - Total Rs.{_rev.total}
            </div>
          </div>

          <div className="bar-chart">
            <div className="bar-chart-input-dropdown" style={{ color: "black" }}>
              <Drop isOpen={() => handleDrop("month")} />
            </div>
            <BarChart data={monthlyData} title="Monthly" />
            <div className="text-center" style={{ color: "black", fontWeight: "bold" }}>
              Monthly Bar Chart!
            </div>
          </div>

        </div>
      </div>
        )
      }

    </div >
  )
}

export default Charts;