import React, {useState} from 'react';
import PanelView from '../SidePanelView/panel.view';
import MetadataFields from '../fields/metadata.fields.view';

const VoucherContent = (props) => {
  
  // Cheat code state handler!
  const [cheatCode, setCheatCode] = useState([
    {
      value: undefined,
      placeholder: "Advanced filter cheat code",
      name: 'cheatCode',
      attribute: 'textField'
    }
  ])
  
  // Render cheat code input field!
  function _renderCheatCode(){
    return(
      <MetadataFields data = {cheatCode} />
    )
  }
  
  return(
    <div className = "sidepanel-wrapper">
      <div className = "flex-1">
        <PanelView data = {props.data} childView = {() => props.childView()} />
      </div>
      <div className = "flex-2">
        <div className = "cheat-code">
          {_renderCheatCode()}
        </div>
      </div>
    </div>
  )
}

export default VoucherContent;