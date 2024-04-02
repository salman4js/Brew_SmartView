const defaultChatConstants = {
  OUTPUT_CONSTANTS: {
    noIdeaResponse: 'Sorry, I don`t have any information about that.',
    noRoomExists: 'Room no doesn`t exist.'
  },
  NO_IDEA_RES_CONSTANTS: {
    no_room_exists: 'noRoomExists'
  },
  OBJECT_DETAILS: {
    available_obj_details: {
      requiredDetails: ['isOccupied', 'extraBedPrice', 'price', 'suiteName', 'roomStatus', 'floorNo'],
      textFormer: (details) => `This room is currently in ${details.roomStatus} state,\nprice of this room is ${details.price} and is on ${details.floorNo} floor\nwith ${details.suiteName} type.`
    },
    occupied_obj_details: {
      requiredDetails: ['isOccupied', 'extraBedPrice', 'price', 'suiteName', 'roomStatus', 'floorNo', 'username', 'phonenumber', 'dateofcheckin', 'dateofcheckout'],
      textFormer: (details) => `This room is currently in ${details.roomStatus} state,\nprice of this room is ${details.price} and is on ${details.floorNo} floor\nwith ${details.suiteName} room type.\nGuest Details:\nGuest Name: ${details.username}\nGuest Phone number: ${details.phonenumber}\nDate of checkin: ${details.dateofcheckin}\nDate of checkout: ${details.dateofcheckout}`
    }
  },
  OCCUPIED_STATUS_CONSTANT: 'afterCheckin',
  DETAILS_MESSAGE: {
    available: 'Go to room state',
    occupied: 'Go to bill preview',
    enabledRoute: ['dashboard-container']
  }
};

export default defaultChatConstants;
