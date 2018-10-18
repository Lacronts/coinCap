<template lang="html">
<div class="container text-center">
  <div v-if="!isLoading">
    <div class="row mt-5">
      <div class="col-12">
        <img :src="'https://s2.coinmarketcap.com/static/img/coins/128x128/'+coinDetails.id+'.png'" alt="logo">
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <h2>{{coinDetails.name}} <strong>{{coin}}</strong></h2>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col-12">
        <h3><span class="rank">Rank {{coinDetails.cmc_rank}}</span></h3>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h2>Текущая цена: <strong class="text">{{formatCurrency(coinDetails.quote.USD.price)}}</strong> <span class="BTC_price text-secondary">({{coinDetails.quote.BTC.price.toFixed(6)}} BTC)</span></h2>
        <h5 class="text-secondary">при суммарной стоимости всех монет: {{formatCurrency(coinDetails.quote.USD.market_cap)}}</h5>
      </div>
    </div>
    <div class="row">
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Объем торгов <span class="d-block">(24 часа)</span></h5>
          <span class="d-block text"><strong>{{formatCurrency(coinDetails.quote.USD.volume_24h)}}</strong></span>
          <span class="d-block text-secondary">{{coinDetails.quote.BTC.volume_24h.toFixed(2)}} BTC</span>
        </div>
      </div>
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Количество в обороте:</h5>
          <span class="d-block text"><strong>{{coinDetails.total_supply}} {{coin}}</strong></span>
        </div>
      </div>
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Всего монет({{coin}}):</h5>
          <span class="d-block text"><strong>{{coinDetails.max_supply || 'Нет данных'}}</strong></span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Изменения цены <span class="d-block">(за 1 час):</span></h5>
          <span class="d-block text" :class="[isValuePositive(coinDetails.quote.USD.percent_change_1h < 0) ? 'text-danger' : 'text-success']">
            <strong class="price_change">{{coinDetails.quote.USD.percent_change_1h.toFixed(2)}}%</strong>
          </span>
        </div>
      </div>
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Изменения цены <span class="d-block">(за 24 часа):</span></h5>
          <span class="d-block text" :class="[isValuePositive(coinDetails.quote.USD.percent_change_24h < 0) ? 'text-danger' : 'text-success']">
            <strong class="price_change">{{coinDetails.quote.USD.percent_change_24h.toFixed(2)}}%</strong>
          </span>
        </div>
      </div>
      <div class="mt-3 col-12 col-md-4">
        <div class="info_coin">
          <h5>Изменения цены <span class="d-block">(за 7 дней):</span></h5>
          <span class="d-block text" :class="[isValuePositive(coinDetails.quote.USD.percent_change_7d < 0) ? 'text-danger' : 'text-success']">
            <strong class="price_change">{{coinDetails.quote.USD.percent_change_7d.toFixed(2)}}%</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <div class="spinner"></div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import utils from '@/utils';

export default {
  name: 'coinInfo',
  props: {coin: String},
  created() {
     this.formatCurrency = utils.formatCurrency;
     this.isValuePositive = utils.isValuePositive;
  },
  computed:{
    coinDetails(){
      return this.$store.getters.coinDetails(this.coin);
    },
    ...mapGetters([
      'isLoading',
    ])
  },
}
</script>

<style lang="css">
.coinLoading{
    height: 70vh;
    display: flex;
}
.rank{
  background-color: #FF6600;
  border-radius: 5px;
  padding: 3px;
}

.BTC_price{
  font-size: 0.8em;
}

.row{
  align-items: stretch;
}

.row .info_coin{
  height: 100%;
  box-shadow: 3px 3px 20px 3px rgba(42, 88, 133, 0.5);
  border: 2px solid #2a5885;
  border-radius: 10px;
}

.price_change{
  font-size: 2em;
}
</style>
