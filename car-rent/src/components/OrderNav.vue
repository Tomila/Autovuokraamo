<template>

  <div id="navContainer">
    <div class="navStepContainer">
      <h2>1. Tilauksen päivämäärät</h2>
      <div class="navStepInfo" v-if="showNavStep(1)">
        <p>Ajoneuvon nouto: {{getOrderStartDate}} {{getOrderStartTime}}</p>
        <p>Ajoneuvon palautus: {{getOrderEndDate}} {{getOrderEndTime}}</p>
      </div>
    </div>
    <div class="navStepContainer">
      <h2>2. Ajoneuvon valinta</h2>
      <div class="navStepInfo" v-if="showNavStep(2)">
        <p>Ajoneuvon tyyppi: {{getOrderVehicleType}}</p>
        <p>Ajoneuvon malli: {{getOrderVehicleModel}}</p>
      </div>
    </div>
    <div class="navStepContainer">
      <h2>3. Tilaajan tiedot</h2>
      <div class="navStepInfo" v-if="showNavStep(4)">
        <p>Tilaajan nimi: {{getOrderFirstName}} {{getOrderLastName}}</p>
        <p>Tilaajan e-mail: {{getOrderEmail}}</p>
      </div>
    </div>
    <div class="navStepContainer">
      <h2>4. Tilauksen yhteenveto</h2>
      <div class="navStepInfo" v-if="showNavStep(4)">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "OrderNav",

  props: {

},
  computed: {
    getOrderStartDate(){
      return this.$store.state.order.orderStartDate;
    },
    getOrderEndDate(){
      return this.$store.state.order.orderEndDate;
    },
    getOrderStartTime(){
      return this.$store.state.order.orderStartTime;
    },
    getOrderEndTime(){
      return this.$store.state.order.orderEndTime;
    },
    getOrderVehicleType(){
      return this.$store.state.order.vehicleType;
    },
    getOrderVehicleModel(){
      return this.$store.state.order.vehicleModel;
    },
    getOrderFirstName(){
      return this.$store.state.order.firstName;
    },
    getOrderLastName(){
      return this.$store.state.order.lastName;
    },
    getOrderEmail(){
      return this.$store.state.order.email;
    },
  },
  methods: {
    showNavStep(step){
      return this.$store.state.orderStep >= step
    }
  }

}
//console.log(this.$store.state.order);
</script>

<style scoped>
  #navContainer{
    padding: 20px 20px;
    display: flex;
    flex-wrap: wrap;
  }
  .navStepContainer{
    margin: 0 auto;
    padding: 0px 0px;
    text-align: left;
  }
  .navStepInfo{
    padding: 0px 20px;

  }
</style>