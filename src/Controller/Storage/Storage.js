// Set the session storage!
export function setStorage(key, value){
    sessionStorage.setItem(key, value);
}

// Get the specific session storage values!
export function getStorage(key){
    return sessionStorage.getItem(key);
}

// Store into the session storage multiple values!
export function defaultStorage(data){
    for (const key in data){
        setStorage(key, data[key]);
    }
}

// Clear particular item from the storage!
export function removeItemStorage(key){
    return sessionStorage.removeItem(key);
}

// Clear the session storage!
export function clearStorage(name){
    document.cookie = name +'=; path=/';
    return sessionStorage.clear();
}