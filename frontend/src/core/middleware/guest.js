export default function auth({to, next, router }) {
    console.log('pass guest');
    let token  = window.localStorage.getItem('x-auth-token') ? window.localStorage.getItem('x-auth-token') : null;
    if (token) {
      console.log('auth');
      return router.push({ name: 'dashboard' });
    }else return next();
  }