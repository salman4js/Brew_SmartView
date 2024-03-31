import React from 'react';
import './collection.panel.view.css';


const CollectionPanelView = (props) => {
  
  // Show item child view!
  function _showItemChildView(){
    return props.showCollectionChildView();
  }
  
  return(
    <div className = "collection-sub-child-view">
      {_showItemChildView()}
    </div>
  )
}

export default CollectionPanelView;