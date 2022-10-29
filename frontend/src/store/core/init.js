import schema from "./schema.json";
import core from "./index"; 
export default (store) => { //? no idea
  function registerModule(store, name, core, updatedModule) {
    let newModule = {};
    if (updatedModule) {
      Object.keys(updatedModule.default).forEach((element) => {
        let object = Object.assign(
          core[element],
          updatedModule.default[element]
        );
        newModule[element] = object;
      });
    }
    // dynamic module registration
    store.registerModule(name, Object.assign(core, newModule));
  }

  // schema.forEach((objet) => {
  //   import(`../modules/${objet.module}`)
  //     .then((module) => {
  //       registerModule(
  //         store,
  //         objet.module,
  //         core({ entity: objet.entity, module: objet.module }),
  //         module
  //       );
  //     })
  //     .catch(() => {
  //       registerModule(
  //         store,
  //         objet.module,
  //         core({ entity: objet.entity, module: objet.module })
  //       );
  //     });
  // });

  // register modules
  schema.forEach((objet) => {
    registerModule(
      //??? store ??? 
      store, // store
      objet.module, // name
      core({ entity: objet.entity, module: objet.module }) // core
    );
  });

};
