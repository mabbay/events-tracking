const getters = {
  getInit: state => {
    return state.init;
  },
  currency: state => {
    let data = null;
    let initData = state.init;
    if (typeof initData.options != 'undefined') {
        let options = initData.options;
        let indexOption = -1;
        options.forEach((element ,key) => {
          if (element.key == "store_currencies") indexOption = key;
        });
        if (indexOption != -1 && typeof options[indexOption].value  != 'undefined' ) {
          options[indexOption].value.forEach(element => {  if (element.default) data = element.code; });
          if (options[indexOption].value.length > 0 && !data) data = options[indexOption].value[0]['code'];
        }
    }
    return data;
  }
}

export default getters
