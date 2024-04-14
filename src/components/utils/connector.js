const origConnector = require('axios');
let connector = {};

connector.getCookies = function(){
  return document.cookie.split('=')[1];
};

connector.isAuthenticated = function(result){
    if(result.data['notAuthorized']){
        window.location.pathname = '/rejected';
    }
};

connector.post = function(url, body, options){
    return new Promise((resolve, reject) => {
        options = {
            headers: {
                "x-access-token": options?.accessToken || connector.getCookies(),
            }
        };
        origConnector.post(url, body, options).then((result) => {
            this.isAuthenticated(result);
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
         this.isAuthenticated(result);
         resolve(result);
     }).catch((err) => {
         reject(err);
     })
  });
};

connector.patch = function(url, body, options){
    return new Promise((resolve, reject) => {
       options = {
           headers: {
               "x-access-token": options?.accessToken || connector.getCookies(),
           }
       };
       origConnector.patch(url, body, options).then((result) => {
           this.isAuthenticated(result);
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
             "x-access-token": options?.accessToken || connector.getCookies(),
         }
     };
     origConnector.delete(url, options).then((result) => {
         this.isAuthenticated(result);
         resolve(result);
     }).catch((err) => {
         reject(err);
     })
  });
};

export default connector;