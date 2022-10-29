import http from "@/core/axios" 
const actions = {
    async getInit({ commit }) {
        const { data } = await http.get(`/api/stores/init`);
        commit(`GET_INIT`, data);
        return data;
    },
}
export default actions
