// axios
import axios from 'axios'
var qs = require('qs');
let baseURL = (location.hostname == 'business.storeino.com') ? 'https://api-affiliates.storeino.com/' : 'http://localhost:3077';
// const env = localStorage.getItem('environment');
// if(env == 'production') baseURL = 'https://api-affiliates.storeino.com/';
const http = axios.create({
  baseURL: baseURL,
  // headers: {
  //   'x-auth-token': localStorage.getItem('auth-token') //,
  // },
  paramsSerializer: function(params) {
    return qs.stringify(params)
  }
  // You can add your headers here
});

//* can be used to intercept invalid token responses
//* for exemple we can redirect to login when response status code is 401...
// http.interceptors.response.use(function (response) {  
//       return response;
//     }, function (error) {
//     return Promise.reject(error);
// });

export default http;