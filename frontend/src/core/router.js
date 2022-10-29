/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import Vue from 'vue'
import Router from 'vue-router'
import routes from './config/routes';
Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: routes,
})
// function getRoutes(routes){
//   const newRoutes = [];
//   routes.forEach(route => {
//     const childs = [];
//     route.children.forEach(child => {
//       childs.push({
//         path: child.path,
//         name: child.name,
//         meta: child.meta,
//         component: () => import(`../views/${child.component}.vue`)
//       })
//     });
//     newRoutes.push({
//       path: route.path,
//       component: () => import(`../layouts/${route.layout}/${route.component}.vue`),
//       children: childs
//     });
//   });
//   newRoutes.push({
//     path: '*',
//     redirect: '/error-404'
//   });
//   // console.log(newRoutes);
//   return newRoutes;
// }
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = "none";
  }
})

function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return async (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    // context.next(...parameters); //?
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    await subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}
// to get an array of middleware that should be called when navigating to the 'to' Route object 
function getMiddleware(to) {
  //! route.meta.middleware if defined must be an array so this code can work
  let middleware = to.matched.reduce((cum, record) => {
    if (record.meta.middleware) return [...cum, ...record.meta.middleware];
    return cum;
  }, []);
  return Array.from(new Set(middleware)); // remove duplicate
}

router.beforeEach(async (to, from, next) => {
  // console.log('before each', to);
  const middleware = getMiddleware(to);
  // console.log('mid', middleware);
  if (middleware.length > 0) {
    // const middleware = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);
    return await middleware[0]({ ...context, next: nextMiddleware });
  }
  return next();
});


export default router
