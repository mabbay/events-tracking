export default ({ entity, module }) => {

  return { //! create + entity is missing or maybe not
    ["SET" + module.toUpperCase()](state, items) {
      state[module] = items;
    },
    ["SET" + entity.toUpperCase()](state, item) {
      state[entity] = item;
    },
    //! not updating the state
    ["UPDATE" + module.toUpperCase()](state, item) {
      console.log('--- STATE --- UPDATE ---');
      console.log(state[module]);
      console.log('----');
      console.log(item);
      // const itemIndex = state[module]['results'].findIndex((p) => p._id === item._id);
      // Object.assign(state[module]['results'][index], item);
    },
    ["DELETE" + module.toUpperCase()](state, id) {
      console.log('--- STATE --- DELETE ---');
      console.log(state[module]);
      console.log('----');
      console.log(id);
      let _index = state[module]['results'].findIndex((p) => p._id === id);
      state[module]['results'].splice(_index, 1);
    },
    // paginate: { total, per_page, current_page, last_page }
    SETPAGINATE(state, paginate) {
      state.paginate = paginate;
    },
  };
};
