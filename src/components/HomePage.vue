<template lang="html">
<div class="home container-fluid text-center">
  <div v-if="!isLoading">
    <div class="row h3 my-4 justify-content-center">
      <div class="total col-12 col-sm-10 col-md-7 py-1">
        <strong class="text-secondary">Рыночная капитализация:
          <span class="d-block text-success">{{formatCurrency(market.quote.USD.total_market_cap)}}</span>
        </strong>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-sm-4">
        Всего валют:
        <p><strong class="text">{{market.active_cryptocurrencies}}</strong></p>
      </div>
      <div class="col-12 col-sm-4">
        BTC доминирование:
      <p><strong class="text">{{market.btc_dominance.toFixed(2)}}%</strong></p>
      </div>
      <div class="col-12 col-sm-4">
        ETH доминирование:
        <p><strong class="text">{{market.eth_dominance.toFixed(2)}}%</strong></p>
      </div>
    </div>
  <div class="val mb-2">
    <dropdown
      :options="getDropdown.options"
      :placeholder="'USD'"
      :selected="getDropdown.selected"
      v-on:updateOption="changeVal"
    >
    </dropdown>
  </div>
  <div class="row header">
    <div class="col-2 col-sm-1">
      #
    </div>
    <div class="col px-0 text-left">
      Коин
    </div>
    <div class="col d-none d-sm-none d-md-none d-lg-block">
      Символ
    </div>
    <div class="col d-none d-sm-none d-md-none d-lg-block">
      Капитал.
    </div>
    <div class="col">
      Цена({{getVal}})
    </div>
    <div class="col d-none d-sm-none d-md-block">
      Монет в обращении
    </div>
    <div class="col-sm-1 d-none d-md-block">
      %1ч
    </div>
    <div class="col-sm-1 d-none  d-lg-block">
      %24ч
    </div>
    <div class="col-sm-1 d-none  d-lg-block">
      %7д
    </div>
  </div>
    <div class="mb-5">
      <coin-cap-item
        v-for="coin in getCoins"
        :key="coin.id"
        :coin="coin"
      >
      </coin-cap-item>
    </div>
  </div>
  <div v-else class="loading">
    <div class="spinner"></div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import CoinCapItem from './CoinCapItem.vue';
import dropdown from 'vue-dropdowns';
import utils from '@/utils';

export default {
  name: 'HomePage',
  components: {
    CoinCapItem,
    dropdown
  },
  created(){
    this.formatCurrency = utils.formatCurrency;
  },
  computed: {
    ...mapGetters([
      'getCoins',
      'getDropdown',
      'getVal',
      'isLoading',
      'market',
    ]),
  },
  methods: {
    changeVal(val){
      this.$store.dispatch('changeVal', val);
    },
  }
}
</script>

<style lang="css">
.home{
  height: 50vh;
}
.row{
  margin: 0;
  align-items: center;
}
.total{
  width: 500px;
  border: 1px solid rgba(0,0,0,.5);
  border-radius:50px;
}
.row.header{
  align-items: center;
  color: white;
  height: 50px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  background: linear-gradient(to right bottom, rgba(42,88,133,.5), rgba(22,88,130,0.9));
}
.loading{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.val{
  display: block;
  align-items: center;
  width:165px;
  height: 48px;
}
.spinner {
    font-size: 10px;
    background-color: transparent;
    border-radius: 50%;
    width: 3em;
    height: 3em;
    margin: 3em;
    animation: spinner 1s infinite ease-in-out;
}
@keyframes spinner {
    0% {
        box-shadow: -3em -3em #000, 3em -3em #CCC, 3em 3em #000, -3em 3em #CCC;
    }
    100% {
        box-shadow: -3em 3em #CCC, -3em -3em #000, 3em -3em #CCC, 3em 3em #000;
    }
}
</style>
