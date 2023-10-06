const axios = require("axios");
const checkinUtils = require('../../../NewDashboard/property.container/checkin.view/checkin.form.utils');
const Variables = require("../../../Variables");

// Add refund amount into the refundTracker!
export async function addRefundTracker(data){
  const result = axios.post(`${Variables.Variables.hostId}/${data.lodge}/addrefundtracker`, data);
  return result;
};

export async function checkinPrebookGuest(data){
  const result = await checkinUtils.checkInFormValue(data);
  return result;
};