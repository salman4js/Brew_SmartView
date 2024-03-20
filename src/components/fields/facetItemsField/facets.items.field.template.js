import CollectionView from "../../SidePanelView/collection.view/collection.view";
function facetsItemsFieldTemplate(options){
    options = options || [];
    return options.map((opts) => {
        if(opts.facetPosition === 'body'){
            return(
                <div className = "facets-items">
                    <CollectionView data = {opts.name} showCollectionChildView = {() => opts.view && opts.view()}/>
                </div>
            )
        }
    });
};

function facetsItemFooterViewTemplate(options){
  return options.map((opts) => {
     if(opts.facetPosition === 'footer'){
         return(
             <>
                 {opts.view && opts.view()}
             </>
         )
     }
  });
};

export function facetBodyFieldPanelTemplate(options){
  return(
      <div style = {{height: options.height + " px"}}>
          {facetsItemsFieldTemplate(options.bodyOptions)}
          {options.isFooterEnabled && (
              <div className = 'facets-items-footerview'>
                  {facetsItemFooterViewTemplate(options.bodyOptions)}
              </div>
          )}
      </div>
  )
};