// Room status images!
function _renderImageModel(options){
  if(options === 'inCleaning'){
    return cleaningImage();
  }
  
  if(options === 'afterCheckedout'){
    return dirtyImage();
  }
  
  if(options === 'afterCleaned'){
    return availableImage();
  }
}


function cleaningImage(){
  return(
    <div>
      <img height = '120px' src="data:image/png;base64,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"></img>
    </div>
  )
};

function dirtyImage(){
  return(
    <div>
      <img height = '120px' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADCUlEQVR4nO2ZS2sUQRSFvyS+IKKCCxFUBAWNmdGVYJCICG7E/AKDijsNKLhPdhE0RDcuoouAy4iPP+ADXyCKiQgBRSK4SHxr0EUMMWkpOA1F0dOTnqmuSXQOFDNTdebee+pW16uhjn8XW4Bh4CWwlUWKA8BXIFL5Bhws8592YAi4DKxiAeAUMCMBt4Fb+v4HOOtwVwAngBFxZvU5BrTVKH6WAgMKZA7oBRqBBqBHdabtmobaOeCLlbHzwGbgCDCpzugBmkKKWAvcVVC/gaMJnEMKMLLKa+AM0OxwNwEPxHka6hkrAu/kdBzYncLdAbwV9xewN4VrMtGtzEwqU97wxOnRWpbH1QiJFlipGLUOPKoLcfBoAWQhUnnoBlfHYsclpfaz1hAXLcAHZxj45l70IeR4itOkwPLgHvMhZFeKw+0ZgquGu9OHkGXAtAzGO9Si5bioQEoFVim3Te3TisELhmW03Uq7HYDdg3Z9Ndx94rzAIwZldMDpUbc3R1N6Pyt3QN+Nb284nbJQ2QE2lgisEm6kYnx7Q5zmUmXUOhA16bcPbiTf3rDaOvGFzMicfHvFmHPOzvMZmdWn8ekdN2W8N2EmshewpBkqK7dP7TfyENIt4/0B1pF+tRmf3tEh4/cCbFHuq/5wHkI2yvgPXfnktUVpAL6rfgM5Ib5N7MhxaHWo3vjKDXfkZCYhgDjApPos3Bm1GV+5oS+lN83QeVVidsrKjYALeQrpDLggduYppBBwi1LIU8gSYMpx+MlymiUj8cxXkA2bNyVfueJ5CREtzrh3p1tbxDa9WihYXHOPHHOfEQBX5ewj0FrBFsXUTVgdYYsbV/2VUC927ANPlnWkNWEY2VkdVF1XCCF75GykzMPqruzFBBHuBDCi32mvH7yhWdtscymwPGXrMd8tSsyLLzmM7ZUEwhsFsX+eZ4/5nFGMrUi2g+F6xu1Ilm3LUEghJ6vs/TReV0ghZgy/L/Ngl1sQk3gTwJqQQuIg4nODj/KzzIvVXLFOF2nxAldJmdAiu75WIuqo43/AXyoP9qcBCVKBAAAAAElFTkSuQmCC"></img>
    </div>
  )
};

function availableImage(){
  return(
    <div>
      <img height = '120px' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEvElEQVR4nO1aXU8bRxRd9aGPVfsc9fO5Uh+jfry1PyPPiWAHI1qaqlUj1NI0H97BpCVAUryztrEXY4wBG0iRCFFU1IbKhNBA0pAitRURIRWJVFCrvNzqLLsUAwbHXrwY5kpHWs/euXPO2dnZ0a4VRYYMGXsdgVrx4pmq6Ev8hHGkqSr4hgPOgm8BOW0njCPIRR9lP8aFmsgLfl/Hm00s+AFnwWN+FqzjTPg1VQ9pTB/WVP1HrooZroo/ORNPOBNUIlDjD9REbXuMEMZcGzt4TKsW74MTuLkisqGh4bkmJt7VVOO4xsRZjelxzsSExvS/ihHRXGvQt3U2PgxT+8nItsA5Jy/gM4oyzOYIrnGLu2ochxZoKkh8oFa8Zl3BPAMEaoRF1jgVI7Oxi1LnEzTUnKTRtj4a1wfoRjhNk7FB+qV7iO72DtP99AjNZ4oD+qIGaqHmjXDGGmO0LWWNmfJ3k9lokjgVtTiB2w7G3PZXd7y6qwGciTQ6tNaHqfvrOA0299DYpT6aCGdopmeYfitSTDkAbuA4EUlbnMEdGlo/Cq+ZoIqB3Q1Q9RUkzyavuEsu/f067g9cobn+4RygbWOOm2PDlLVZIP4uZAYQsFNBEL6XGqK7qQzd6Rmg2UQ/3Y6naNpM0q1YD01FE3Szs5smI100Ge6ibMgsCuiLGqiFmqiNMTAWxsTY4AAu4JTf/JH1W6FgA+5BYDJNMxDX1Uu3oj10MxIvWky5AI7gCs7gDg2/9g49uwHZfSDGNRjm3hnwU9Ck8csxutYWo9GWqAUcow3nSiXvSn23DJgQJg03dVLXlxHSPwvRN3W7P6vxTEduvDFs9UWNfET3rL4bBlxvj1qDbSZw8eMoGY1Jip7ro8SFQQs4RhvObUf4enusvPXdMCD4achqj53vp+xIln6fnqPVR4tE/zzZEStLi1Yu+qAvauCKlbW+GwYEfGvt/y4/2pVUPqCvtZv0lbm+GwZwu71Ycg48qe+mAU8fz5cET+pLA0w5A7i8BcSzrQGxL8LUWh8q+sXEfkCzT1BbvWFpKWgG+Fn4da9J7zXw3nF78dXBo5yJh0hq/aSTxvuu0YPZaVpdmit5ZfYK4L4wO03jfWOWJmjTVLEUUENv54jXqvSXOdOXkdDfnqGVh5UrOh+gqb8tY5ugP272hV753wBVv+qIf7q81iF2LkmmvzenSMW3Lc+vm8CZPmaJx3Rwpv3GK7/dxuQgtK0sztHFk/btUKO/g6t/GT9wz3tNrlxtP6TGnPbvFE0VU/jx4M50ThKmzebpdFDasDDaC+KU4ny9WT2AC18+4FZ3FkNluylyGLC+MeL7YHPiJRSvCXgNxTnw+rNWuSENYHlmgPh865vWSgG+WO+kY+P5LQZk7ddHHfbb2UoEuO+kY+P5vAZkDwmkAUzOAJK3AJNrAMlFkMungJCPQS73AcLzjcm+3Qj9bJiU+Ap/YfV+q1soWuoMSpyOWNxLNiBxOuK5oGIB7iUb0GL/b8d6hVwhoVUH33NmQskGcCexwqJgXVwaIOQM4If8FljAwdWW6JYktNmJC0qFRcG6NCbO7vpIUfUzSoVFwboaGrqft5MtxzZhAeeQo1RYHFRdMmTIkCFDcTH+A0Y0CYoO1HzhAAAAAElFTkSuQmCC"></img>
    </div>
  )
}

function arrowImage(){
  return(
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="120" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
    </svg>
  )
};

function getStatusImage(options){
  return(
    <div className = 'row'>
      <div className = 'col text-center'>
        {_renderImageModel(options.currentStatusConstant)}
      </div>
      <div className = 'col text-center'>
        {arrowImage()}
      </div>
      <div className = 'col text-center'>
        {_renderImageModel(options.nextOfNextRoomStatus)}
      </div>
    </div>
  )
};

// Get button color code!
function getClassName(options){
  if(options.currentStatusConstant === 'inCleaning'){
    return 'text-center btn-success';
  }
  
  if(options.currentStatusConstant === "afterCheckedout"){
    return 'text-center btn-primary';
  }
  
  if(options.currentStatusConstant === 'customState'){
    return 'text-center btn-secondary';
  } else {
    return 'text-center btn-danger';
  }
};

// Action button field!
function _renderButtonField(options){
  return(
    <div className = {getClassName(options)} onClick = {() => options.moveToNextState()}>
      {'(' + options.statusInfo.currentStatus + ')'} Move to Next Status {'(' + options.statusInfo.nextRoomStatus + ')'}
    </div>
  )
}


export function templateHelpers(options){
  return(
    <div className = 'container brew-cursor' style = {{color: 'black'}}>
      <div style = {{marginTop: (options.height / 4) + 'px'}}>
        {getStatusImage(options)}
        {_renderButtonField(options)}
      </div>
    </div>
  )
};