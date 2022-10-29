import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import state from "./state";

export default ({ entity, module }) => {
  return {
    actions: { ...actions({ entity, module }) },
    mutations: { ...mutations({ entity, module }) },
    getters: { ...getters({ entity, module }) },
    state: { ...state({ entity, module }) },
    namespaced: true,
  };
};
