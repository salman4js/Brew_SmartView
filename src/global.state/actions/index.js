// Remove value from the global state as the de-selected item!
export const removeValue = (value) => {
  return{
    type: "REMOVE",
    value: value
  }
}

// Remove all value from the global state!
export const removeAllValue = (value) => {
  return{
    type: "REMOVEALL",
    value: value
  }
}

// Add value to the global state as the selected item!
export const addValue = (value) => {
  return{
    type: "ADD",
    value: value
  }
}

// Get the selected value from the global state!
export const getValue = () => {
  return{
    type: "GET"
  }
}

// Global message acions handlers!
export const createGlobalMessage = (value) => {
  return{
    type: "SHOW",
    value: value,
    status: "SHOW"
  }
}

export const killGlobalMessage = (value) => {
  return {
    type: "KILL",
    value: value.message,
    status: "NEVER"
  }
}

export const initializeGlobalMessage = () => {
  return {
    type: "INITIALIZE",
    value: null,
    status: "FETCH"
  }
}