const globalMessage = (state, action) => {
  switch(action.type){
    case 'SHOW':
      return action;
    case 'KILL':
      return action;
    case 'INITIALIZE':
      return action;
    default: 
      return false;
  }
}

export default globalMessage;