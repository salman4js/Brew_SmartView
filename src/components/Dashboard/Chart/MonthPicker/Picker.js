import React from 'react'

const Picker = () => {

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
                    <select name="month" className="form-control" >
                        <option value="">Select a month</option>
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='col'>
                    <select name="year" className="form-control">
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