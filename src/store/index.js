import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  coinState: [],
  marketCap: {},
  test:[],
  dropdown: {
    options: [
      {id:1, name: 'USD'},
      {id:2, name: 'BTC'},
      {id:3, name: 'ETH'},
    ],
    selected: {id:1, name: 'USD'},
  },
  isLoading: false,
};

const getters = {
  getCoins: state => state.coinState,
  getDropdown: state => state.dropdown,
  getVal: state => state.dropdown.selected.name,
  isLoading: state => state.isLoading,
  market: state => state.marketCap,
  coinDetails: state => coin => {
    return state.coinState.find((item) => item.symbol === coin);
    },
  };

const mutations = {
  UPDATE_COINS(state, payload){
    state.coinState = payload;
  },
  UPDATE_QUOTE(state, payload){

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
    state.isLoading = payload;
  }
};

const actions = {
  getCoins({commit}, val={name: 'USD'}){
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${val.name}`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
      .then((response) => {
        commit('UPDATE_COINS', response.data.data);
    })
  },
  getMarketData({commit, state}){
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
      .then((response) => {
        commit('UPDATE_MARKET_CAP', response.data.data);
    })
  },
  getQuote({commit, state}, val){
    let newState = JSON.parse(JSON.stringify(state.coinState));
    return axios.get(`http://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=${val}`,{headers: {'X-CMC_PRO_API_KEY':'4d7d35fe-9265-43cc-8344-612758f55d31'}})
        .then((response) => {
          response.data.data.map((item, index) => {
            newState[index].quote[val] = item.quote[val];
          });
          commit('UPDATE_COINS', newState);
      });
  },
  changeVal({commit, dispatch, state}, val){
    if (!state.coinState.length) {
      state.isLoading = true;
      return dispatch('getCoins', 'USD')
      .then(()=> {
        commit('UPDATE_VAL', 'USD');
        state.isLoading = false;
      });
    }
    if (!state.isLoading && !state.coinState[0].quote.hasOwnProperty(val.name)) {
      state.isLoading = true;
      return dispatch('getQuote', val.name)
      .then(()=> {
        commit('UPDATE_VAL', val);
        state.isLoading = false;
      });
    }
    commit('UPDATE_VAL', val);
  }
};


export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})
