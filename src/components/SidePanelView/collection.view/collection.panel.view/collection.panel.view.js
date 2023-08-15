import React from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';


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