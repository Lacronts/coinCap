<template lang="html">
  <div class="coinItem">
    <router-link :to="'/'+coin.symbol">
      <div class="row h-100 align-items-center">
        <div class="col-2 col-sm-1 text-secondary">
          {{coin.cmc_rank}}
        </div>
        <div class="col px-0 text text-left font-weight-bold">
          <img :src="'https://s2.coinmarketcap.com/static/img/coins/32x32/'+coin.id+'.png'" alt="">
          {{coin.name}}
        </div>
        <div class="col d-none d-lg-block text-body">
          {{coin.symbol}}
        </div>
        <div v-if="getVal==='USD'" class="col d-none d-lg-block text-body">
          {{formatCurrency(coin.quote[getVal].market_cap)}}
        </div>
        <div v-else class="col d-none d-lg-block text-body">
          {{coin.quote[getVal].market_cap.toFixed(2)}} {{getVal}}
        </div>
        <div v-if="getVal==='USD'" class="col text font-weight-bold">
        {{formatCurrency(coin.quote[getVal].price)}}
        </div>
        <div v-else class="col text font-weight-bold">
          {{coin.quote[getVal].price.toFixed(6)}} {{getVal}}
        </div>
        <div class="col d-none d-md-block text font-weight-bold">
          {{formatNumber(coin.total_supply)}} {{coin.symbol}}
        </div>
        <div class="col-sm-1 d-none d-md-block" :class="[isValuePositive(coin.quote[getVal].percent_change_1h < 0) ? 'text-danger' : 'text-success']">
          {{(coin.quote[getVal].percent_change_1h) ? coin.quote[getVal].percent_change_1h.toFixed(2) : 'Нет данных'}}
        </div>
        <div class="col-sm-1 d-none d-lg-block" :class="[isValuePositive(coin.quote[getVal].percent_change_24h < 0) ? 'text-danger' : 'text-success']">
          {{(coin.quote[getVal].percent_change_24h) ? coin.quote[getVal].percent_change_24h.toFixed(2) : 'Нет данных'}}
        </div>
        <div class="col-sm-1 d-none d-lg-block" :class="[isValuePositive(coin.quote[getVal].percent_change_7d < 0) ? 'text-danger' : 'text-success']">
          {{(coin.quote[getVal].percent_change_7d) ? coin.quote[getVal].percent_change_7d.toFixed(2) : 'Нет данных'}}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import utils from '@/utils';

export default {
  name: 'CoinCapItem',
  props: {
    coin: Object,
  },
  created() {
     this.formatCurrency = utils.formatCurrency;
     this.isValuePositive = utils.isValuePositive;
     this.formatNumber = utils.formatNumber;
  },
  computed: {
    ...mapGetters([
      'getVal',
      'isLoading'
    ])
  }
}
</script>

<style lang="css">
.row .text{
  color: #2a5885;
}
.coinItem{
  border: 1px solid rgba(34,36,38,.1);
  height: 3rem;
  transition: all 0.05s ease-in-out;
}
.coinItem:hover{
  transform: scale(1.01);
}
.coinItem a{
  color: inherit;
}
</style>
