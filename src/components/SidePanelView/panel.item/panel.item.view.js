import React, {useState} from 'react';
import './panel.item.view.css';

const PanelItemView = (props) => {

  // Mouse Over state handler!
  const [inlineAction, setInlineAction] = useState({
    mouseOver: false,
  });

  function _onInlineMenuClick(_id, event){
    event.stopPropagation();
    props._renderCustomInlineMenu(_id);
  }
  
  // Render inline menu!
  function _inlineMenu(){
    return(
      <span className = "inline-menu" onClick = {(event) => _onInlineMenuClick(props._id, event)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-clipboard-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"/>
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
      </span>
    )
  }
  
  // Highlight the selected item1
  function getStyle(){
    if(props.selectedItem !== undefined){
      return{
        backgroundColor: props.selectedItem[props.selectedItem.length - 1] === props._id ? "#ddd" : "#f1f1f1"
      }
    } 
  }

  // On select item!
  async function selectItem(){
    props.onClick(props.passingProps || props._id);
  }
  
  // trigger mouse over event!
  function _triggerMouseOver(){
    setInlineAction(prevState => ({...prevState, mouseOver: true}))
  }
  
  // trigger mouse out event!
  function _triggerMouseOut(){
    setInlineAction(prevState => ({...prevState, mouseOver: false}))
  }

  return(
    <div className = "file-items" onClick = {() => selectItem()} 
      onMouseOver = {() => _triggerMouseOver()} onMouseOut = {() => _triggerMouseOut()}
      style = {getStyle()}>
       <span className = "brew-title-workspace side-align" style = {{color: props.colorCode || 'black'}}>
          {props.showIndentationArrow && '> '}{props.data}
         {props.allowSubData && props.subData && (
             ' (' + props.subData + ')'
         )}
       </span>
       {props.onMouseOverInlineAction && props.showInlineMenu && inlineAction.mouseOver && (
         props.customInlineMenu ? (props._renderCustomInlineMenu && props._renderCustomInlineMenu()) :  _inlineMenu()
       )}
       {!props.onMouseOverInlineAction && props.showInlineMenu && (
         props.customInlineMenu ? (props._renderCustomInlineMenu && props._renderCustomInlineMenu()) :  _inlineMenu()
       )}
    </div>
  )
}

export default PanelItemView;