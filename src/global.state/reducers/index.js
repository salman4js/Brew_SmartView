import checkboxSelection from './table.checkbox.selection';
import globalMessage from './global.message.handler';
import {combineReducers} from 'redux';

// Combine reducers!
const allReducers = combineReducers({
   checkboxSelection: checkboxSelection,
   globalMessage: globalMessage
})

export default allReducers;