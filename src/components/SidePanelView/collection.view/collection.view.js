import React, {useState} from 'react';
import PanelItemView from '../panel.item/panel.item.view';
import CollectionPanelView from './collection.panel.view/collection.panel.view';
import { getStorage, setStorage } from '../../../Controller/Storage/Storage';

const CollectionView = (props) => {

  // State handler for expand and collapse action!
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Expand Action!
  function expandCollapseAction(){
    setIsExpanded(!isExpanded);
    setUserPreference(props.data, !isExpanded);
  };
  
  // Enable sub child view!
  function _showSubChildView(){
    var userPreference = JSON.parse(getStorage(props.data)); // User preference for expansion!
    return(
      userPreference && (
        <CollectionPanelView showCollectionChildView = {() => props.showCollectionChildView()}  />
      )
    )
  };
  
  // Show child view!
  function _showChildView(){
    return <PanelItemView data = {props.data} onClick = {() => expandCollapseAction()} />
  };
  
  // Persist user preference using props.data in session storage!
  function setUserPreference(value, key){
    setStorage(value, key);
  };
  
  return(
    <>
      {_showChildView()}
      {_showSubChildView()}
    </>
  )
}


export default CollectionView;