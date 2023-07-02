const checkboxSelection = (state = [], action) => {
  switch(action.type){
    case 'ADD':
      return [...state, action.value];
    case 'REMOVE':
      return state.filter((value) => value !== action.value);
    case "GET":
      return state;
    default: 
      return state;
  }
}

export default checkboxSelection;