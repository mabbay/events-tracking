import http from "@/core/axios"
export default ({ entity, module }) => {
  return {
    // Actions for `create`, `update` and `delete` omitted for brevity.
    //..
    //! create was missing
    async create({ commit }, payload) {
      const { data } = await http.post(
        `/api/${module}/create`, payload.body
      );
      return data;
    },
    async search({ commit }, payload = {}) {  
      const { data } = await http.get(`/api/${module}/search`, {
        params: payload,
      });
      commit(`SET${module.toUpperCase()}`, data.results);
      // store info about pagination
      const { total, per_page, current_page, last_page } = data;
      commit('SETPAGINATE', { total, per_page, current_page, last_page });
      return data;
    },
    async getAll({ dispatch }, payload) {
      // console.log(`get-all-${module}`);
      console.log(`get-all-${module}`);
      // why limit 1 ? because all we want from this request is the total number of items
      const { data } = await http.get(`/api/${module}/search`, { params: { ...payload, limit: 1 } });
      return await dispatch('search', { ...payload, limit: data.total });
    },
    //..
    async get({ commit }, payload) {
      const { data } = await http.get(`/api/${module}/get`, {
        params: payload,
      });
      commit(`SET${entity.toUpperCase()}`, data);
      return data;
    },
    async update({ commit }, payload) {
      const { data } = await http.put(
        `/api/${module}/update?id=${payload.id}`,
        payload.body
      );
      //! should add data to module array
      commit(`UPDATE${module.toUpperCase()}`, data);
      return data;
    },
    async delete({ commit }, id) {
      await http.delete(`/api/${module}/delete?id=${id}`)
        .then(() => {
          commit(`DELETE${module.toUpperCase()}`, id);
        });
    },
  };
};
