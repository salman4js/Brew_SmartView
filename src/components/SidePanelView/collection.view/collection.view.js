import React, {useState} from 'react';
import PanelItemView from '../panel.item/panel.item.view';
import CollectionPanelView from './collection.panel.view/collection.panel.view';
import { getStorage, setStorage } from '../../../Controller/Storage/Storage';

const CollectionView = (props) => {

  // State handler for expand and collapse action!
  const [isExpanded, setIsExpanded] = useState(props.options?.isExpanded || false);
  
  // Expand Action!
  function expandCollapseAction(){
    setIsExpanded(!isExpanded);
    props?.options?.onClickCallBack && props?.options?.onClickCallBack(isExpanded); // Sending the current mode i.e. expanded or not.
    setUserPreference(props.data, !isExpanded);
  };
  
  // Get user preference for expansion!
  function getUserPreference(){
    if(props.ignoreTreePref){ // By default ignoreTreePref flag will be false!
      return isExpanded;
    } else {
      return JSON.parse(getStorage(props.data))
    }
  };
  
  // Enable sub child view!
  function _showSubChildView(){
    var userPreference = getUserPreference(); // User preference for expansion!
    // By the time when sub child view renders, isExpanded flag would be already set to true, So sending the opposite value to the
    // caller to let the other view know if the collection view has been expanded or not.
    return(
      userPreference && (
        <CollectionPanelView showCollectionChildView = {() => props.showCollectionChildView(!isExpanded)}  />
      )
    )
  };
  
  // Show child view!
  function _showChildView(){
    return <PanelItemView data = {props.data} onClick = {() => expandCollapseAction()} customInlineMenu = {props.options?.customInlineMenu}
    onMouseOverInlineAction = {props.options?.onMouseOverInlineAction} showInlineMenu = {props.options?.showInlineMenu} _renderCustomInlineMenu = {() => props.options?.inlineAction()}/>
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