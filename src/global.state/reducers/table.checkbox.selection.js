const checkboxSelection = (state = [], action) => {
  switch(action.type){
    case 'ADD':
      return [...state, action.value];
    case 'REMOVE':
      return state.filter((value) => value !== action.value);
    case "GET":
      return state;
    case "REMOVEALL":
      return []
    default: 
      return state;
  }
}

export default checkboxSelection;