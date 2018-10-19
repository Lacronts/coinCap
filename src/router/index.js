import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import HomePage from '../components/HomePage';
import NotFound from '../components/NotFound';
import CoinInfo from '../components/CoinInfo';

Vue.use(VueRouter)

const checkPath = (to, from, next) => {
  const coins = store.getters.getCoins;
  const coin = to.params.coin;

  if (!coins.length){
    store.commit('SET_LOADING', true);
    store.watch(
      (state) => state.coinState,
      () => {
        if (store.getters.coinDetails(coin)) next();
        else next(`sorry/not-found`);
      }
    )
  }
  else {
    if (store.getters.coinDetails(coin)) next();
    else next(`sorry/not-found`);
  }
};

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/:coin',
      name: 'coinInfo',
      component: CoinInfo,
      props: true,
      beforeEnter: checkPath,
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
});

export default router;
