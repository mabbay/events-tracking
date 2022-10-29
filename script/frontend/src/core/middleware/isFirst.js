export default function auth({to, next, router }) {
  console.log('pass checkout store');
  // if (!window.localStorage.getItem('isfirst') || window.localStorage.getItem('isfirst') == 1 ) {
  //   switch (to.name) {
  //     case 'stores-create': return router.push({ name: 'checkout-store' });
  //     case 'market-create': return router.push({ name: 'checkout-market' });
  //   }
    
  // }else return next();
  return next();
}