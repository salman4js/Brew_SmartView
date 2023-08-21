import React, {useState, useEffect} from 'react';
import PanelView from '../../SidePanelView/panel.view';

const SidepanelWrapper = (props) => {

  // Sidepanel state handler!
  const [sidepanel, setSidepanel] = useState({
    height: undefined,
    header: "Rooms List"
  });
  
  // Update sidepanel height!
  function updateSidePanelHeight(value){
    setSidepanel(prevState => ({...prevState, height: value}))
  };
  
  // Update the sidepanel height when props.data.height changes!
  useEffect(() => {
    updateSidePanelHeight(props.data.height)
  }, [props.data.height])
  
  
  return <PanelView data = {sidepanel} />
}

export default SidepanelWrapper;