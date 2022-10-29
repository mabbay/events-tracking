
import StoreinoApp from 'vue/dist/vue';
import axios from './axios'
StoreinoApp.$store = {
    search : async function(module, params){
        let response = await axios.get(`/api/${module}/search`, { params });
        return response.data;
    },
    get : async function(module, params){
        let response = await axios.get(`/api/${module}/get`, { params });
        return response.data;
    }
};
export default StoreinoApp;