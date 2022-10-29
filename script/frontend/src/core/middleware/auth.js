import store from '../../store/store';

export default async ({to, next, router }) => {
  console.log("--auth-mid--");
  await store.dispatch('getUserInfo'); // get user info if necessary
  if (store.getters.isAuth) next();
  else next({ name: 'login' });
}