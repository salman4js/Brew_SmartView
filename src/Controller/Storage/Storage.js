// Set the session storage!
export function setStorage(key, value){
    sessionStorage.setItem(key, value);
}


// Get the specific session storage values!
export function getStorage(key){
    const result = sessionStorage.getItem(key);
    return result;
}


// Store into the session storage multiple values!
export function defaultStorage(data){
    for (const key in data){
        setStorage(key, data[key]);
    }
}


// Clear the session storage!
export function clearStorage(){
    const result = sessionStorage.clear();
    return result;
}