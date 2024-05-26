import CollectionView from "../../SidePanelView/collection.view/collection.view";
function facetsItemsFieldTemplate(options){
    options = options || [];
    return options.map((opts) => {
        if(opts.facetPosition === 'body'){
            return(
                <div className = "facets-items">
                    <CollectionView data = {opts.name} options = {{customInlineMenu: true, showInlineMenu: true, ignoreTreePref: opts.ignoreTreePref || false,
                    onClickCallBack: (val) => opts.onClickCallBack && opts.onClickCallBack(val) ,inlineAction: () => _renderCustomInlineMenu()}}
                    showCollectionChildView = {(isExpanded) => opts.view && opts.view(isExpanded)}/>
                </div>
            )
        }
    });
};

function _renderCustomInlineMenu(){
    return (
        <span className='inline-menu'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-caret-down-fill" viewBox="0 0 16 16">
            <path
                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
            </svg>
        </span>
    )
};

function facetsItemFooterViewTemplate(options) {
    return options.map((opts) => {
        if (opts.facetPosition === 'footer') {
            return (
                <>
                    {opts.view && opts.view()}
                </>
            )
        }
    });
};

export function facetBodyFieldPanelTemplate(options){
  return(
      <div className='facets-items-wrapper' style = {{height: options.height + " px"}}>
          {facetsItemsFieldTemplate(options.bodyOptions)}
          {options.isFooterEnabled && (
              <div className = 'facets-items-footerview'>
                  {facetsItemFooterViewTemplate(options.bodyOptions)}
              </div>
          )}
      </div>
  )
};