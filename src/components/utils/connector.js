const origConnector = require('axios');
let connector = {};

connector.getCookies = function(){
  return document.cookie.split('=')[1];
};

connector.post = function(url, body, options){
    return new Promise((resolve, reject) => {
        options = {
            headers: {
                "x-access-token": options?.accessToken || connector.getCookies(),
            }
        };
        origConnector.post(url, body, options).then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
};

connector.get = function(url, options){
  return new Promise((resolve, reject) => {
     options = {
         headers: {
             "x-access-token": options?.accessToken || connector.getCookies(),
         }
     };
     origConnector.get(url, options).then((result) => {
        resolve(result);
     }).catch((err) => {
         reject(err);
     })
  });
};

connector.put = function(url, body, options){
    return new Promise((resolve, reject) => {
       options = {
           headers: {
               "x-access-token": options?.accessToken || connector.getCookies(),
           }
       };
       origConnector.put(url, body, options).then((result) => {
           resolve(result);
       }).catch((err) => {
          reject(err);
       });
    });
};

connector.delete = function(url, options){
  return new Promise((resolve, reject) => {
     options = {
         headers: {
             "x-access-token": options?.accessToken || document.cookie,
         }
     };
     origConnector.delete(url, options).then((result) => {
         resolve(result);
     }).catch((err) => {
         reject(err);
     })
  });
};

export default connector;