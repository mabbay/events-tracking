import axios from 'axios';

export default {
    async getWebsitesFromServer(context) {
        return axios.get('/websites/search')
            .then(res => context.commit('setWebsites', res.data.results))
            .catch(err => {throw err});
    },
    getWebsites() {
        return axios({
            url: '/websites/search',
        }).then(res => {
            console.log('--web--success');
            // we could save them temporally 
            return res.data;
        }).catch(err => { console.log('--web--failure'); throw err; });
    },
    async deleteWebsiteOnServer(context, id) {
        return axios.delete(`/websites/delete?id=${id + "rfgedg"}`)
            .then(res => { console.log('deleteWebsiteOnServer', res); context.commit('removeWebsite', res.data) })
            .catch(err => {throw err});
    },
    async editWebsiteOnServer(context, payload) {
        console.log('payload', payload);
        return axios.put(`/websites/update?id=${payload.id}`, { domain: payload.domain})
            .then(res => { console.log('editWebsiteOnServer', res); context.commit('editWebsite', res.data) })
            .catch(err => {throw err});
    },
    async addWebsiteToServer(context, payload) {
        console.log('payload', payload);
        return axios.post(`/websites/create`, { domain: payload.domain})
            .then(res => { console.log('editWebsiteOnServer', res); context.commit('addWebsite', res.data) })
            .catch(err => {throw err});
    }
}
