import React from 'react'

const Picker = (props) => {

    // Months attributes
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // Years attributes
    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2019 },
        (_, index) => (currentYear - index).toString()
    );


    return (
        <div style = {{padding: '20px'}}>
            <div className="row">
                <div className="col">
                    <select name="month" className="form-control" onChange = {(e) => props._month(months.indexOf(e.target.value))}>
                        <option value="">Select a month</option>
                        {months.map((month, key) => (
                            <option key={key} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='col'>
                    <select name="year" className="form-control" onChange = {(e) => props._year(e.target.value)}>
                        <option value="">Select a year</option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Picker;