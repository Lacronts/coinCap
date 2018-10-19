import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  coinState: [],
  marketCap: {},
  test:[],
  coinsStart: 1,
  dropdown: {
    options: [
      {id:1, name: 'USD'},
      {id:2, name: 'BTC'},
      {id:3, name: 'ETH'},
      {id:4, name: 'LTC'},
      {id:5, name: 'BCH'},
      {id:6, name: 'XRP'},
    ],
    selected: {id:1, name: 'USD'},
  },
  isLoading: {
    content: false,
    coins: false,
  },
};

const getters = {
  getCoins: state => state.coinState,
  getDropdown: state => state.dropdown,
  getVal: state => state.dropdown.selected.name,
  isLoading: state => state.isLoading.content,
  isLoadingCoins: state => state.isLoading.coins,
  market: state => state.marketCap,
  getCoinsStart: state => state.coinsStart,
  coinDetails: state => coin => {
    return state.coinState.find((item) => item.symbol === coin);
    },
  };

const mutations = {
  UPDATE_COINS(state, payload){
    state.coinState = payload;
  },
  UPDATE_MARKET_CAP(state, payload){
    state.marketCap = payload;
  },
  TEST_COINS(state, payload){
    state.test = payload;
  },
  UPDATE_VAL(state, payload){
    state.dropdown.selected = payload;
  },
  SET_LOADING(state, payload) {
    state.isLoading.content = payload;
  },
  SET_LOADING_COINS(state, payload) {
    state.isLoading.coins = payload;
  },
  UPDATE_START_POSITION(state, payload) {
    state.coinsStart = payload;
  },
};

const actions = {
  getCoins({commit}, val='USD'){
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${val}`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
      .then((response) => {
        commit('UPDATE_COINS', response.data.data);
    })
  },
  getCoinsNextPrev({commit, dispatch, state}, pos){
    commit('SET_LOADING_COINS', true);
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${pos}`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
      .then((response) => {
        commit('UPDATE_COINS', response.data.data);
        commit('UPDATE_START_POSITION', pos);
        commit('UPDATE_VAL', {id:1, name: 'USD'});
        commit('SET_LOADING_COINS', false);
        dispatch('getQuote', 'BTC');
    })
  },
  getMarketData({commit}){
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
      .then((response) => {
        commit('UPDATE_MARKET_CAP', response.data.data);
    })
  },
  getQuote({commit, state}, val){
    let newState = JSON.parse(JSON.stringify(state.coinState));
    const pos = state.coinsStart;
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${val}&start=${pos}`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
        .then((response) => {
          response.data.data.map((item, index) => {
            newState[index].quote[val] = item.quote[val];
          });
          commit('UPDATE_COINS', newState);
      });
  },
  changeVal({commit, dispatch, state}, val){
    if (!state.coinState.length) {
      commit('SET_LOADING', true);
      return dispatch('getCoins', 'USD')
      .then(()=> {
        commit('UPDATE_VAL', {id:1, name: 'USD'});
        commit('SET_LOADING', false);
      });
    }
    if (!state.isLoading.content && !state.coinState[0].quote.hasOwnProperty(val.name)) {
      commit('SET_LOADING_COINS', true);
      return dispatch('getQuote', val.name)
      .then(()=> {
        commit('UPDATE_VAL', val);
        commit('SET_LOADING_COINS', false);
      });
    }
    commit('UPDATE_VAL', val);
  },
  sortedData(param){

  },
};


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
