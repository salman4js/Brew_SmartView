// Template helpers for chat performers handled here!

export function templateHelpers(messageContent){
  return messageContent.map((options) => {
    return(
        <pre className = {options.className} style = {{overflow: 'hidden'}}>
          {options.message}
          {options.details && (
            <div className = 'chat-performer-more-details'>
              {options.details}
            </div>
          )}
        </pre>
    );
  });
};