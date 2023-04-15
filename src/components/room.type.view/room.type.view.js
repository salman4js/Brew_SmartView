import React, {useState, useEffect} from "react";
import axios from "axios";
import Variables from "../Variables";
import {roomType} from "./src/room.type.model";
import RoomModel from "./src/room.type.model.view";
import TableHead from "../table.view/table.head.view";
import Loading from "../Loading";

const RoomType = (props) => {

    // Loader state handler!
    const [loader, setLoader] = useState(false);

    // Error handler!
    const [error, setError] = useState({
        isError: false,
        errorText: undefined
    })

    // Room Type state handler!
    const [roomData, setRoomData] = useState([]);

    // Get room type list!
    function getRoomType(){
        setLoader(true);
        axios.post(`${Variables.hostId}/${props.lodgeId}/allroomtype`)
            .then(res => {
                if(res.data.success){
                    setRoomData(res.data.message);
                    setLoader(false);
                } else {
                    setError({
                        isError: true,
                        errorText: res.data.message
                    })
                    setLoader(false);
                }
            })
    }

    useEffect(() => {
        getRoomType()
    }, [])

    return(
        <div className = "card text-center" style={{ width: "60vh", height: "393px" }}>
            <div className = "card-header" style = {{color: "black"}}>
                Room Type List
            </div>
            <div className = "card-body" style = {{overflow: "auto"}}>
                {
                    loader ? (
                        <Loading />
                    ) : (
                        <div className = "model-gap">
                            <table style={{ width: "100%", color: "black" }}>
                                <thead>
                                    <tr>
                                        {
                                            roomType.map((item,key) => {
                                                if(!props.isExtra()){
                                                    if(item !== "Extra Bed Price"){
                                                        return(
                                                            <TableHead text = {item} />
                                                        )
                                                    } 
                                                } else {
                                                    return(
                                                        <TableHead text = {item} />
                                                    )
                                                }
                                            })
                                        }
                                    </tr>
                                    {
                                        roomData.map((item,key) => {
                                            return(
                                                <RoomModel isExtra = {props.isExtra()} node = {item} />
                                            )
                                        })
                                    }
                                </thead>
                            </table>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default RoomType;