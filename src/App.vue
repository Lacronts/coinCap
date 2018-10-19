<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="nav-item" to="/">
        <div class="d-flex align-items-center">
          <img class="mr-1" src="./assets/icons/logo.jpg" alt="" width="30" height="30">
          <span class="brand">CustomCoinCup</span>
        </div>
      </router-link>
        <div class="d-flex w-100 justify-content-end flex-nowrap">
          <div class="search">
            <v-select
              :options="getCoins"
              placeholder="Поиск..."
              label="name"
              v-on:input="toCoinDetails"
            >
              <template slot="option" slot-scope="option">
                <img :src="'https://s2.coinmarketcap.com/static/img/coins/16x16/'+option.id+'.png'" alt="">
                <span>{{option.name}}({{option.symbol}})</span>
              </template>
            </v-select>
          </div>
        </div>
    </nav>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import HomePage from './components/HomePage.vue';
import { mapGetters } from 'vuex';
import vSelect from 'vue-select';

export default {
  name: 'app',
  components: {
    HomePage,
    vSelect
  },
  created(){
    window.scrollTo(0,0);
    this.$store.commit('SET_LOADING', true);
    const loadData = async () => {
      const market = this.$store.dispatch('getMarketData');
      await this.$store.dispatch('getCoins');
      await market;
      return;
    }
    loadData().then(() => {
      this.$store.dispatch('getQuote', 'BTC');
      this.$store.commit('SET_LOADING', false);
    });
  },
  computed: {
    ...mapGetters([
      'getCoins',
    ])
  },
  methods: {
    toCoinDetails(val){
      this.$router.push(`/${val.symbol}`)
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.navbar{
  flex-flow: nowrap;
}
.search{
  width:220px;
  height: 30px;
}
.search .v-select{
  height: 100%;
}
.search .v-select .selected-tag{

}
.search .v-select .dropdown-toggle{
  height: 100%;
}
.search .v-select input[type=search]{
  height: 100%;
  padding: 0 0 0 0.5em;
}
.search .v-select .dropdown-toggle::after {
 display: none;
}
nav a{
  color:rgba(34,36,38,.8);
  transition: all 0.1s ease-in-out;
}
nav a:hover{
  text-decoration: none;
  color:linear-gradient(to bottom right,#567ff3,#1153fc);
  transform: scale(1.05);
}
.brand{
  font-size: 1.4rem;
  font-family: monospace;
}
</style>
