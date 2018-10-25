import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  coinState: [],
  marketCap: {},
  coinsStart: 1,
  dropdown: {
    options: [
      {id:1, name: 'USD'},
      {id:2, name: 'RUB'},
      {id:3, name: 'BTC'},
      {id:4, name: 'ETH'},
      {id:5, name: 'LTC'},
      {id:6, name: 'BCH'},
      {id:7, name: 'XRP'},
    ],
    selected: {id:1, name: 'USD'},
  },
  isLoading: {
    content: false,
    coins: false,
  },
  descending: false,
  sortBy: '',
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
  sortBy: state => state.sortBy,
  descending: state => state.descending,
  };

const mutations = {
  UPDATE_COINS(state, payload){
    state.coinState = payload;
  },
  UPDATE_MARKET_CAP(state, payload){
    state.marketCap = payload;
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
  CHANGE_DESC(state,payload) {
    state.descending = payload;
  },
  CHANGE_SORTBY(state, payload){
    state.sortBy = payload;
  }
};

const actions = {
  getCoins({commit}, val='USD'){
    return axios.get('/api/listings', {
      params: {
        val: val
      }
    }).then((response) => {
        commit('UPDATE_COINS', response.data.data);
    })
  },
  getCoinsNextPrev({commit, dispatch}, pos){
    commit('SET_LOADING_COINS', true);
    return axios.get(`/api/listings`, {
      params: {
        pos: pos
      }
    })
      .then((response) => {
        commit('UPDATE_COINS', response.data.data);
        commit('UPDATE_START_POSITION', pos);
        commit('UPDATE_VAL', {id:1, name: 'USD'});
        commit('CHANGE_SORTBY', '');
        commit('SET_LOADING_COINS', false);
        dispatch('getQuote', 'BTC');
    })
  },
  getMarketData({commit}){
    return axios.get(`/api/market`)
      .then((response) => {
        commit('UPDATE_MARKET_CAP', response.data.data);
    })
  },
  getQuote({commit, state}, val){
    let newState = JSON.parse(JSON.stringify(state.coinState));
    const pos = state.coinsStart;
    return axios.get(`/api/listings`, {
      params: {
        val: val,
        pos: pos
      }
    }).then((response) => {
          response.data.data.map((item) => {
            let element = newState.find((el) => el.name === item.name);
            element.quote[val] = item.quote[val];
          });
          commit('UPDATE_COINS', newState);
      });
  },
  changeVal({commit, dispatch, state}, val){
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
  sortedData({commit, state}, param){
    let sortedCoins;
    const sortBy = state.sortBy;

    if (param !== sortBy && sortBy !== '') commit('CHANGE_DESC', false);

    commit('CHANGE_SORTBY', param);
    const coins = JSON.parse(JSON.stringify(state.coinState));
    const descending = !state.descending;

    if (param.indexOf('quote') !== -1){
      param = param.split('.')[1];
      const currency = state.dropdown.selected.name;
      sortedCoins = coins.sort((a, b) => {
       return descending
         ? (a.quote[currency][param] > b.quote[currency][param] ? 1 : -1)
         : (a.quote[currency][param] < b.quote[currency][param] ? 1 : -1);
       });
    } else {
       sortedCoins = coins.sort((a, b) => {
        return descending
          ? (a[param] > b[param] ? 1 : -1)
          : (a[param] < b[param] ? 1 : -1);
      });
    }
    commit('UPDATE_COINS', sortedCoins);
    commit('CHANGE_DESC', descending);
  },
};


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
