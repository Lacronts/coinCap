<template lang="html">
<div class="home container-fluid text-center">
  <div v-if="!isLoading">
    <div class="row h3 my-4 justify-content-center">
      <div class="total col-12 col-sm-10 col-md-7 py-1">
        <strong class="text-secondary">Рыночная капитализация:
          <span class="total_price d-block">{{formatCurrency(market.quote.USD.total_market_cap)}}</span>
        </strong>
      </div>
    </div>
    <div class="row mb-2">
      <div class="market col-12 col-sm-4">
        Всего криптовалют:
        <p><strong class="text">{{market.active_cryptocurrencies}}</strong></p>
      </div>
      <div class="market col-12 col-sm-4">
        BTC доминирование:
      <p><strong class="text">{{market.btc_dominance.toFixed(2)}}%</strong></p>
      </div>
      <div class="market col-12 col-sm-4">
        ETH доминирование:
        <p><strong class="text">{{market.eth_dominance.toFixed(2)}}%</strong></p>
      </div>
    </div>
  <div class="btn-group val mb-2">
    <dropdown
      :options="getDropdown.options"
      :selected="getDropdown.selected"
      v-on:updateOption="changeVal"
      class="btn btn-outline-secondary"
    >
    </dropdown>
    <button
      class="btn btn-outline-secondary"
      @click="prevCoins"
      v-if="getCoinsStart > 99">
      Prev 100
    </button>
    <button
      class="btn btn-outline-secondary"
      @click="nextCoins">
      Next 100
    </button>
  </div>
  <div class="row header">
    <div class="title col-2 col-sm-1" @click="sort('cmc_rank')">
      # {{(sortBy === 'cmc_rank') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col px-0 text-left" @click="sort('name')">
      Коин {{(sortBy === 'name') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col d-none d-sm-none d-md-none d-lg-block" @click="sort('symbol')">
      Символ {{(sortBy === 'symbol') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col d-none d-sm-none d-md-none d-lg-block" @click="sort('quote.market_cap')">
      Капитал. {{(sortBy === 'quote.market_cap') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col"  @click="sort('quote.price')">
      Цена({{getVal}}) {{(sortBy === 'quote.price') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col d-none d-sm-none d-md-block" @click="sort('total_supply')">
      Монет в обращении {{(sortBy === 'total_supply') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col-sm-1 d-none d-md-block" @click="sort('quote.percent_change_1h')">
      %1ч {{(sortBy === 'quote.percent_change_1h') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col-sm-1 d-none  d-lg-block" @click="sort('quote.percent_change_24h')">
      %24ч {{(sortBy === 'quote.percent_change_24h') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
    <div class="title col-sm-1 d-none  d-lg-block" @click="sort('quote.percent_change_7d')">
      %7д {{(sortBy === 'quote.percent_change_7d') ?  (descending ? ' \u2191': '\u2193'): ' '}}
    </div>
  </div>
    <div v-if="!isLoadingCoins" class="mb-5">
      <coin-cap-item
        v-for="coin in getCoins"
        :key="coin.id"
        :coin="coin"
      >
      </coin-cap-item>
    </div>
    <div v-else class="loadingCoins">
      <div class="spinner"></div>
    </div>
  </div>
  <div v-else class="loading">
    <div class="spinner"></div>
  </div>
  <div class="arrow buttonToTopHide">
    <i class="fas fa-3x fa-arrow-alt-circle-up"></i>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import CoinCapItem from './CoinCapItem.vue';
import Dropdown from './Dropdown.vue';
import utils from '@/utils';

export default {
  name: 'HomePage',
  components: {
    CoinCapItem,
    Dropdown,
  },
  created(){
    this.formatCurrency = utils.formatCurrency;
    window.addEventListener('scroll', this.arrowShow);
  },
  destroyed () {
    window.removeEventListener('scroll', this.arrowShow);
  },
  computed: {
    ...mapGetters([
      'getCoins',
      'getDropdown',
      'getVal',
      'isLoading',
      'market',
      'getCoinsStart',
      'isLoadingCoins',
      'descending',
      'sortBy',
    ]),
  },
  methods: {
    arrowShow(){
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const arrow = document.querySelector('.arrow');
      if (scrollTop >= 300) {
        arrow.classList.add('buttonToTopShow');
        arrow.classList.remove('buttonToTopHide');
      }
      else {
        arrow.classList.remove('buttonToTopShow');
        arrow.classList.add('buttonToTopHide');
      }
    },
    changeVal(val){
      this.$store.dispatch('changeVal', val);
    },
    nextCoins(){
      let position;
      if (+this.getCoinsStart === 1) position = +this.getCoinsStart + 99;
      else position = +this.getCoinsStart + 100;
      this.$store.dispatch('getCoinsNextPrev', position);

    },
    prevCoins(){
      let position;
      if (+this.getCoinsStart === 100) position = +this.getCoinsStart - 99;
      else position = +this.getCoinsStart - 100;
      this.$store.dispatch('getCoinsNextPrev', position);
    },
    sort(param){
      this.$store.dispatch('sortedData', param);
    }
  }
}
</script>

<style lang="css">
.title{
  cursor: pointer;
}
.home{
  height: 50vh;
}
.total_price {
  color: #4fc08d;
}
.row{
  margin: 0;
  align-items: center;
}
.total{
  width: 500px;
  margin: 1em;
  box-shadow: 0 2px 8px 0 #e1e5ea;
}
.row.header{
  align-items: center;
  color: white;
  height: 50px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to right bottom, #4fc08d, rgba(22,88,130,0.9));
}
.loading{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loadingCoins{
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.val{
  display: flex;
  align-items: center;
  width:100%;
  height: 40px;
}
.val .btn-group{
  min-width: 60px;
}
.val .dropdown-menu{
  min-width: 60px;
}
.val .btn-group .dropdown-toggle{
  min-width: 60px;
  background-image: none;
  padding: .375rem .75rem;
  margin: 0;
}
.btn-group.btn.btn-outline-secondary{
  padding: 0;
}
.val .btn-group .dropdown-toggle:hover{
  background: transparent;
  color: white;
}
.val .btn-group .dropdown-menu > li > a:hover{
  background: #6c757d;
  color: white;
}
.val .btn{
  height: 100%;
}
.buttonToTopShow{
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  opacity: 1;
  transition: .5s;
}
.buttonToTopShow:hover{
  color:#2a5885;
}
.buttonToTopHide{
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  opacity: 0;
  transition: .5s;
}
.spinner {
    font-size: 10px;
    background-color: transparent;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    margin: 2em;
    animation: spinner 1s infinite ease-in-out;
}
.market{
  color: rgba(23,24,27,0.65);
  box-shadow: 0 2px 4px 0 #e1e5ea;
  font-size: 13px;
  font-weight: 600;
}
@keyframes spinner {
    0% {
        box-shadow: -2em -2em #000, 2em -2em #CCC, 2em 2em #000, -2em 2em #CCC;
    }
    100% {
        box-shadow: -2em 2em #CCC, -2em -2em #000, 2em -2em #CCC, 2em 2em #000;
    }
}
</style>
