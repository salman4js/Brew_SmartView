import React from 'react';
import { getRoomStatusConstants } from '../../../common.functions/common.functions';
import { moveToNextState } from '../../../room.status.utils/room.status.utils';
import { activityLoader } from '../../../common.functions/common.functions.view';
import { templateHelpers } from './room.status.template';

class RoomStatusView extends React.Component {
  
  constructor(props){
    super(props);
      this.state = {
          data: props.data,
          height: props.height,
          isLoading: false
      };
  };
  
  // Template helper function!
  templateHelpers(){
    var statusOptions = this.getStatusOptions();
    if(!this.state.isLoading){
      return templateHelpers(statusOptions);
    } else {
      var opts = {
        color: "black",
        marginTop: (this.state.height / 2.5) + "px",
        textCenter: true
      }
      return activityLoader(opts);
    }
  };
  
  // Loader controller!
  _toggleLoader(value){
    this.setState({isLoading: value});
  };
  
  // Get current status constant!
  getCurrentStatusConstant(){
    return this.state.data.roomModel.roomStatusConstant;
  };
  
  // Get next of next room status!
  getNextOfNextRoomStatus(){
    var roomStatusConstant = getRoomStatusConstants(),
      currentStatusConstant = this.getCurrentStatusConstant(),
      currentStatusIndex = roomStatusConstant.indexOf(currentStatusConstant);
    return roomStatusConstant[currentStatusIndex + 1];
  };
  
  // Get state information!
  getStateInfo(){
    return {
      currentStatus: this.state.data.roomModel.roomStatus,
      nextRoomStatus: this.state.data.roomModel.nextRoomStatus,
    };
  };
  
  // Move the room to the next state!
  async moveToNextState(){
    var params = {lodgeId: this.state.data.roomModel.lodge, 
      roomId: this.state.data.roomModel._id};
    this._toggleLoader(true);
    var result = await moveToNextState(params);
    if(result.data.success){
      this._toggleLoader(false);
      this.props.dashboardController({reloadSidepanel: true, persistStatusView: true, updatedModel: result.data.data});
    }
  };
  
  // Determine the state to get rendered!
  getStatusOptions(){
    var roomStateOptions = {currentStatusConstant: this.getCurrentStatusConstant(),
      nextOfNextRoomStatus: this.getNextOfNextRoomStatus(), height: this.state.height,
      statusInfo: this.getStateInfo(), moveToNextState: this.moveToNextState.bind(this)};
    return roomStateOptions;
  };
  
  // Update room model!
  _updateRoomModel(model){
    this.setState({data: model})
  };
  
  // On update lifecyle method!
  componentDidUpdate(prevProps, prevState){
    if(prevProps.data !== this.props.data){
      this._updateRoomModel(this.props.data);
    }
  };
  
  render(){
    return(
      <div className = 'room-status-view' style = {{height: this.state.height}}>
        {this.templateHelpers()}
      </div>
    )
  }
};

export default RoomStatusView;