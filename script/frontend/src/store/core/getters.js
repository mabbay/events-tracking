export default ({ entity, module }) => {
  // const Module = module.charAt(0).toUpperCase() + module.slice(1);
  // const Entity = entity.charAt(0).toUpperCase() + entity.slice(1);
  //! I think [xxx] not needed here, because methods name are static
  return {
    ["list"](state) {
      // state[module].paginate = state.paginate;
      return state[module];
    },
    ["item"](state) {
      return state[entity];
    },
  };
};
