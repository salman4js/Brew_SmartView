const connector = require('../utils/connector').default;
const Variables = require('../Variables');

// Get payment tracker details for specific rooms!
export async function getPaymentTracker(lodgeId, data){
  return await connector.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymenttracker`, data);
}

// Get payment details for receipt generation!
export async function getPaymentDetails(lodgeId, data){
  return await connector.post(`${Variables.Variables.hostId}/${lodgeId}/getpaymentdetails`, data);
}

// Delete single payment tracker instance!
export async function deletePaymentTracker(lodgeId, data){
  return await connector.post(`${Variables.Variables.hostId}/${lodgeId}/deletesinglepayment`, data);
};

// Get all tha payment tracker regardless of the prebook and checkout status!
export async function getAllPaymentTracker(data){
  return await connector.post(`${Variables.Variables.hostId}/${data.lodgeId}/getallpaymenttracker`, data);
}