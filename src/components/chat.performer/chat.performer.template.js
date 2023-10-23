// Template helpers for chat performers handled here!

export function templateHelpers(messageContent, event){
  return messageContent.map((options, index) => {
    return(
        <pre className = {options.className} style = {{overflow: 'hidden'}}>
          {options.message}
          {options.details && (
            <div className = 'chat-performer-more-details' onClick = {() => event.moreDetails(index)}>
              {options.details}
            </div>
          )}
        </pre>
    );
  });
};