import checkboxSelection from './table.checkbox.selection';
import {combineReducers} from 'redux';

// Combine reducers!
const allReducers = combineReducers({
   checkboxSelection: checkboxSelection
})

export default allReducers;