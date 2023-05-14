<template>
  <!-- Vehicle listing -->
  <div id="carList">
    <ul v-for="car in cars" :key="car.Reg_number" class="card">
      <li>
        <figure>
          <img :src="require(`../assets/cars/${car.Vehicle_src}`)"/>
          <figcaption>{{ car.Vehicle_model }}</figcaption>
        </figure>
        <p>{{ (car.Price * orderDuration).toFixed(2) }} €</p>
        <button @click="makeOrder(car.Vehicle_id)">Tilaa</button>
      </li>
    </ul>
  </div>
</template>

<script>

  export default {
    name: "CarResultsView",
    components: {

    },
    computed: {
      orderDuration(){
        return this.getOrderDuration();
      }
    },
    data() {
      return {
        cars: [],
        orderStartTime: '',
        orderEndTime: '',
        vehicleRegNumber: ''
      }
    },

    methods: {

      // Method calculates&returns the orders duration
      // If dates are incorrect redirects to start page
      getOrderDuration(){
        let orderStart = this.$route.query.orderStartDate + " " + this.$route.query.orderStartTime;
        let orderEnd = this.$route.query.orderEndDate + " " + this.$route.query.orderEndTime;
        let orderTime;
        if((Date.parse(orderEnd)-Date.parse(orderStart))>0){
          orderTime = Date.parse(orderEnd)-Date.parse(orderStart);

        }else{
          this.$router.push('/');
        }
        return orderTime/3600000;
      },
      // Method for checking order's date & time
      checkDates(){
        let startDate = this.$route.query.orderStartDate + " " + this.$route.query.orderStartTime;
        let endDate = this.$route.query.orderEndDate + " " + this.$route.query.orderEndTime;

        if(!startDate||!endDate){
          this.$store.commit('setOrderNav', 0); // Disable order navigator bar
          this.$router.push('/');
        }
      },
      // Fetching vehicles listing data
      async getData(start, end, type) {
        try {
          let response = await fetch("/api/cars?from=" + start + "&to=" + end + "&type=" + type);
          this.cars = await response.json();
        } catch (error) {
          console.log(error);
        }
        this.orderStartTime = start; // Refreshing order information
        this.orderEndTime = end;

      },
      // Method starts order process
      makeOrder(vehicleId){

        this.$store.commit('SET_ORDER_VEHICLE_ID', vehicleId);

        this.$router.push('order' + '?displayOrderNav=true&orderStartDate=' + this.$store.state.order.orderStartDate
                + '&orderEndDate=' + this.$store.state.order.orderEndDate
                + '&orderStartTime=' + this.$store.state.order.orderStartTime
                + '&orderEndTime=' + this.$store.state.order.orderEndTime
                + '&vehicleId=' + vehicleId + '&orderStep=3');
      }
    },
    created() {

      this.checkDates();
      // Saving order  information to Vuex store
      this.$store.commit('SET_ORDER_START', this.$route.query.orderStartDate + " " + this.$route.query.orderStartTime);
      this.$store.commit('SET_ORDER_END', this.$route.query.orderEndDate + " " + this.$route.query.orderEndTime);
      this.$store.commit('SET_ORDER_START_DATE', this.$route.query.orderStartDate);
      this.$store.commit('SET_ORDER_END_DATE', this.$route.query.orderEndDate);
      this.$store.commit('SET_ORDER_START_TIME', this.$route.query.orderStartTime);
      this.$store.commit('SET_ORDER_END_TIME', this.$route.query.orderEndTime);

      // Getting vehicle list data
      this.getData(this.$store.state.order.orderStart, this.$store.state.order.orderEnd, this.$route.query.vehicleType);

      this.$store.commit('SET_ORDER_STEP', 1); // Setting the order step
      this.$store.commit('setOrderNav', 1); // Enabling order navigator bar

    },
    updated() {

    }

  }
</script>
<style>

</style>