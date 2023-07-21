import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setStorage} from '../../Controller/Storage/Storage'
import {addValue, removeValue, getValue} from '../../global.state/actions/index';

// Checkbox selection handler
export function useCheckboxSelection(){
  var checkboxSelector = useSelector(state => state.checkboxSelection);
  setStorage("selectedItem", JSON.stringify(checkboxSelector));
  return checkboxSelector;
}

// GlobalMessage handler!
export function useGlobalMessage(){
  var globalMessage = useSelector(state => state.globalMessage);
  return globalMessage
}
