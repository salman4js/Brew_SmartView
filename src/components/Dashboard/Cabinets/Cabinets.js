import React, { useState } from 'react';
import Values from './CabinetsValue/Values';
import Spinner from '../../Loader/Spinner';

const Cabinets = (props) => {

    // Loader handler
    const [loader, setLoader] = useState(false);

    // Search handler!
    const [search, setSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    // Handle search dialog
    function handleSearch() {
        setSearch(!search);
    }

    function changeLoader(data) {
        setLoader(data);
    }

    return (
        <div className="col-4">
            <div class="card card-container" style = {{paddingBottom: '10px'}}>
                <div class="card-header text-handler text-center" style={{ fontWeight: "bold", fontSize: '18px' }}>
                    {
                        search === true ? (
                            <input className = "form-control-sm" placeholder = "Search Favourites" value = {searchValue} name = {searchValue} onChange = {(e) => setSearchValue(e.target.value)} />

                        ) : (
                            props.cabinetHeader
                        )
                    }
                    {props.methodCall === "favourites" && (
                        <div className="search-icon" onClick={() => handleSearch()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="currentColor" class="bi bi-search-heart" viewBox="0 0 16 16">
                                <path d="M6.5 4.482c1.664-1.673 5.825 1.254 0 5.018-5.825-3.764-1.664-6.69 0-5.018Z" />
                                <path d="M13 6.5a6.471 6.471 0 0 1-1.258 3.844c.04.03.078.062.115.098l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1.007 1.007 0 0 1-.1-.115h.002A6.5 6.5 0 1 1 13 6.5ZM6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="card-body-container">
                    <ul class="list-group list-group-flush">
                        {
                            props.methodCall === "checkout" && (
                                loader ? (
                                    <Spinner width = {'120px'} height = {'120px'} />
                                ) : (
                                    props.data.map((options, key) => {
                                        if (options.roomno !== undefined) {
                                            return (
                                                <Values roomno={options.roomno} data={options} helperPanel={(data, id) => props.helperPanel(data, id)} id={props.methodCall} loaderState={(data) => changeLoader(data)} loader={loader} />
                                            )
                                        } else {
                                            return (
                                                <Values roomno={options.username} data={options} helperPanel={(data, id) => props.helperPanel(data, id)} id={props.methodCall} loaderState={(data) => changeLoader(data)} loader={loader} />

                                            )
                                        }
                                    })
                                )
                            )
                        }
                        {
                            props.methodCall === "prebook" && (
                                props.data.map((options, key) => {
                                    return (
                                        <Values roomno={options.roomno} data={options} helperPanel={(data, id) => props.helperPanel(data, id)} id={props.methodCall} loaderState={(data) => changeLoader(data)} loader={loader} />
                                    )
                                })
                            )
                        }
                        {
                            props.methodCall === "favourites" && (
                               props.data.filter((options) => {
                                    return options.phonenumber.toLowerCase().includes(searchValue.toLowerCase()) || options.secondphonenumber.toLowerCase().includes(searchValue.toLowerCase()) || options.username.toLowerCase().includes(searchValue.toLowerCase()) || options.aadharcard.toLowerCase().includes(searchValue.toLowerCase());
                               }).map((item,key) => {
                                    return (
                                        <Values roomno={item.username} secphonenumber = {item.secondphonenumber} data={item} helperPanel={(data, id) => props.helperPanel(data, id)} id={props.methodCall} loaderState={(data) => changeLoader(data)} loader={loader} />
                                    )
                               })
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Cabinets;