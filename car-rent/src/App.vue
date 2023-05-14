<template>
  <nav>
    <div id="logo">
      <router-link to="/">
        <img :src="logo" alt="Logo">
      </router-link>
    </div>
    <div id="pageMenu">
      <router-link to="/">Home</router-link>
      <router-link to="/contactUs">Ota Yhteyttä</router-link>
      <router-link to="/about">Meistä</router-link>
      <router-link to="/signIn">Kirjaudu</router-link>
    </div>
  </nav>
  <div v-if="displayNav">
    <OrderNav :vehicleRegNumber="vehicleRegNumber"
              :orderStartTime="orderStartTime"
              :orderEndTime="orderEndTime"
    ></OrderNav>
  </div>
  <router-view/>
  <footer>
    <h1>TcgStore</h1>
    <div class="footer-container">
      <div class="footer-heading">
        <h2>Navigointi</h2>
        <a href="index.html"> Pääsivulle</a>
        <a href="articles.html"> Blogi</a>
        <a href="bikes.html"> Kaikki autot</a>
        <a href="#">Ilmoita virheesta</a>
      </div>
      <div class="footer-heading">
        <h2>Tietoa meistä</h2>
        <a href="creators.html"> Tekijät</a>
        <a href="licenses.html"> Lisenssit ja käyttöehdot</a>
        <a href="contactUs.html"> Ota yhteyttä</a>
      </div>
    </div>
    <p class="copyright">COPYRIGHT &copy; Meidän ryhmä</p>
  </footer>
</template>
<script>

  import OrderNav from '@/components/OrderNav.vue'

  export default {
    components: {
      OrderNav
    },
    props: {

    },
    computed:{
      displayNav() {
        return this.$store.state.displayOrderNav;
      }
    },
    data() {
      return {
        logo: require('@/assets/images/logo.png'),
        order: [],
        cars: [],
        orderStartTime: '',
        orderEndTime: '',
        //order: false, // if true, the order nav is showed
        search: true, // if true, the search form and car listing are showed
        vehicleRegNumber: '',
      }
    },
    created() {

    }
  }

</script>
