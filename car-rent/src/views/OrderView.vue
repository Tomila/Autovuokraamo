<template>
  <div id="orderViewContainer" v-if="displayVehicleInfo">
    <!-- vehicle info -->
    <div v-for="value in car" :key="value.Vehicle_id" id="vehicleInfoContainer">
    <span class="vehicleImageContainer">
      <img v-bind:src="require(`../assets/cars/${value.Vehicle_src}`)" />
    </span>
      <span class="vehicleDataContainer">
        <h2>{{ value.Vehicle_model }}</h2>
        <p>{{ value.Type_name }}</p>
        <p>{{(value.Price*orderDuration).toFixed(2)}} €</p>
    </span>
    </div>

    <!-- Tilauslomake -->
    <div id="orderFormContainer">
      <h2>Tilaajan tiedot</h2>

      <form action="/order">

        <input type="hidden" id="displayOrderNav" name="displayOrderNav" value="true">
        <input type="hidden" id="orderStep" name="orderStep" value="4">
        <input type="hidden" v-model="order.orderStartDate" id="orderStartDate" name="orderStartDate">
        <input type="hidden" v-model="order.orderEndDate" id="orderEndDate" name="orderEndDate">
        <input type="hidden" v-model="order.orderStartTime" id="orderStartTime" name="orderStartTime">
        <input type="hidden" v-model="order.orderEndTime" id="orderEndTime" name="orderEndTime">
        <input type="hidden" v-model="order.vehicleId" id="vehicleId" name="vehicleId">
        <input type="hidden" v-model="order.amount" id="orderAmount" name="orderAmount">

        <input
                type="text"
                v-model="order.firstName"
                class="orderFormTxt"
                name="firstName"
                placeholder="Etunimi">
        <input
                type="text"
                v-model="order.lastName"
                class="orderFormTxt"
                name="lastName"
                placeholder="Sukunimi">
        <input
                type="text"
                v-model="order.personalId"
                class="orderFormTxt"
                name="personalId"
                placeholder="Henkilötunnus">
        <input
                type="text"
                v-model="order.phoneNumber"
                class="orderFormTxt"
                name="phoneNumber"
                placeholder="Puhelinnumero">
        <input
                type="email"
                v-model="order.email"
                class="orderFormLarge"
                name="email"
                placeholder="Sähköpostiosoite">
        <input
                type="text"
                v-model="order.homeAddress"
                class="orderFormLarge"
                name="homeAddress"
                placeholder="Lähiosoite">
        <input
                type="text"
                v-model="order.city"
                class="orderFormTxt"
                name="city"
                placeholder="Postitoimipaikka">
        <input
                type="text"
                v-model="order.postalCode"
                name="postalCode"
                class="orderFormTxt"
                placeholder="Postinumero">
        <textarea
                v-model="order.additionalInfo"
                class="orderFormTxtField"
                name="additionalInfo"
                placeholder="Lisätiedot"></textarea>
        <label>Maksutapa</label>
        <input type="radio" v-model="order.payment" name="payment" value="Tilisiirto">Tilisiirto
        <input type="radio" v-model="order.payment" name="payment" value="Pankkikortti">Pankkikortti
        <input type="radio" v-model="order.payment" name="payment" value="Käteinen">Käteinen
        <br>
        <input type="submit" value="Seuraava">
      </form>
    </div>
  </div>
  <!-- Order summary template -->
  <div v-if="displayOrderSummary">
    <h1>Tilauksen yhteenveto</h1>
    <div id="orderInfoContainer">
      <div id="orderInfo">
        <h4>Tilauksen tiedot</h4>
        <p>Tilauksen alku: {{order.orderStart}}</p>
        <p>Tilauksen loppu: {{order.orderEnd}}</p>
        <p>Tilauksen summa: {{order.amount}}</p>
        <p>Tilauksen auton ID: {{order.vehicleId}}</p>
      </div>
      <div id="customerInfo">
        <h4>Tilaajan tiedot</h4>
        <p>Nimi: {{order.firstName}} {{order.lastName}}</p>
        <p>Henkilötunnus: {{order.personalId}}</p>
        <p>Sähköpostiosoite: {{order.email}}</p>
        <p>Puhelinnumero: {{order.phoneNumber}}</p>
        <p>Lähiosoite: {{order.homeAddress}}</p>
        <p>Postitoimipaikka: {{order.city}}</p>
        <p>Lisätiedot: {{order.additionalInfo}}</p>
        <p>Maksutapa: {{order.payment}}</p>
      </div>
    </div>
    <button @click="sendOrder">Lähetä tilaus</button>
  </div>
  <!-- Order confirmation template -->
  <div v-if="displayOrderConfirmation">
    <h1>Order confirmation</h1>
    <div id="orderConfirmationContainer">
      <button @click="this.$router.push('/')">Pääsivulle</button>
    </div>
  </div>
  <!-- Order confirmation email form -->
  <form ref="form">
    <input type="hidden" name="contact_number">
    <input type="hidden" name="user_email" value="car.rent.websowellus@gmail.com">
  </form>
</template>

<script>

  import axios from "axios";
  import router from "@/router";
  import emailjs from '@emailjs/browser';


  export default {

    name: "orderView",
    components: {},
    props: {},
    computed: {
      // If orderStep=3 => display vehicle info template
      displayVehicleInfo() {
        return this.$route.query.orderStep === '3';
      },
      // If orderStep=4 => display order summary template
      displayOrderSummary() {
        return this.$route.query.orderStep === '4';
      },
      // If orderStep=5 => display order confirmation
      displayOrderConfirmation(){
        return this.$route.query.orderStep === '5';
      },
      getOrderStartDate(){
        return this.$route.query.orderStartDate;
      },
      getOrderEndDate(){
        return this.order.orderEndDate;
      },
      orderDuration(){
        return this.getOrderDuration();
      },
      orderAmount(){
        return this.getOrderAmount();
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
          router.push('/');
        }
        return orderTime/3600000;
      },
      // Method updates order data to vuex store
      getOrderSummary(){
        this.order.orderStart = this.$store.state.order.orderStartDate + " " + this.$store.state.order.orderStartTime;
        this.order.orderEnd = this.$store.state.order.orderEndDate + " " + this.$store.state.order.orderEndTime;
        this.order.orderStartDate = this.$store.state.order.orderStartDate;
        this.order.orderEndDate = this.$store.state.order.orderEndDate;
        this.order.orderStartTime = this.$store.state.order.orderStartTime;
        this.order.orderEndTime = this.$store.state.order.orderEndTime;
        this.order.vehicleId = this.$store.state.order.vehicleId;
        this.order.firstName = this.$store.state.order.firstName;
        this.order.lastName = this.$store.state.order.lastName;
        this.order.personalId = this.$store.state.order.personalId;
        this.order.email = this.$store.state.order.email;
        this.order.phoneNumber = this.$store.state.order.phoneNumber;
        this.order.homeAddress = this.$store.state.order.homeAddress;
        this.order.city = this.$store.state.order.city;
        this.order.additionalInfo = this.$store.state.order.additionalInfo;
        this.order.payment = this.$store.state.order.payment;
        this.order.amount = this.$store.state.order.amount;

        //console.log(this.order);
        return this.order;
      },

      // Method returns vehicle's data by id
      async getVehicleData(vehicleId) {
        try {
          let response = await fetch("/api/car/" + vehicleId);
          this.car = await response.json();

        } catch (error) {
          console.log(error);
        }

        // Updating vehicle data to Vuex store
        this.$store.commit('SET_ORDER_VEHICLE_ID', this.car[0].Vehicle_id);
        this.$store.commit('SET_ORDER_VEHICLE_TYPE', this.car[0].Type_name);
        this.$store.commit('SET_ORDER_VEHICLE_MODEL', this.car[0].Vehicle_model);
        this.$store.commit('SET_ORDER_VEHICLE_SRC', this.car[0].Vehicle_src);
        this.$store.commit('SET_ORDER_VEHICLE_PRICE', this.car[0].Price);
        this.order.amount =  this.car[0].Price*this.getOrderDuration();
        //console.log(this.order.amount);
      },

      // Method placing new order to database and sending confirmation email to a given e-mail
      sendOrder() {

        let date = new Date();
        let today = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();

        axios.post('/api/orders/', {

          Personal_id: this.order.personalId,
          First_name: this.order.firstName,
          Last_name: this.order.lastName,
          Email: this.order.email,
          Phone_Number: this.order.phoneNumber,
          Home_address: this.order.homeAddress,
          City: this.order.city,
          Postal_code: this.order.postalCode,
          Additional_info: this.order.additionalInfo,
          Payment: this.order.payment,
          Vehicle_id: this.order.vehicleId,
          Date_create: today,
          Order_start: this.order.orderStart,
          Order_end: this.order.orderEnd,
          Amount: this.order.amount
        })
                .then(function (response) {
                  //console.log(response);
                  if (response.status === 200) {
                    //console.log("Response 200 OK!");
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
        // Sending e-mail
        emailjs.sendForm('contact_service', 'contact_form', this.$refs.form, 'Uz8pDtV00tzV72fx7')
                .then((result) => {
                  console.log('SUCCESS!', result.text);
                }, (error) => {
                  console.log('FAILED...', error.text);
                });

        // Redirect to order confirmation
        router.push('/order?displayOrderNav=0&orderStep=5');
      }
    },
    data() {
      return {
        // Vehicle data
        car: [],
        // Form data
        form: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          homeAddress: '',
          city: '',
          postalCode: '',
          additionalInfo: '',
          payment: ''
        },
        // Order data
        order:
                {
                  orderStart: '',
                  orderEnd: '',
                  orderStartDate:'',
                  orderEndDate: '',
                  orderStartTime: '',
                  orderEndTime: '',
                  vehicleId: '',
                  firstName: '',
                  lastName: '',
                  personalId: '',
                  email: '',
                  phoneNumber: '',
                  homeAddress: '',
                  city: '',
                  postalCode: '',
                  additionalInfo: '',
                  payment: '',
                  amount: ''
                }
      }
    },
    created() {

      // Get vehicle data on page create
      this.getVehicleData(this.$route.query.vehicleId); // Getting choosed vehicle's data
      //console.log(this.car[0].Vehicle_type)

      // Updating order information to Vuex store
      this.$store.commit('SET_ORDER_START', this.$route.query.orderStartDate + " " + this.$route.query.orderStartTime);
      this.$store.commit('SET_ORDER_END', this.$route.query.orderEndDate + " " + this.$route.query.orderEndTime);
      this.$store.commit('SET_ORDER_START_DATE', this.$route.query.orderStartDate);
      this.$store.commit('SET_ORDER_END_DATE', this.$route.query.orderEndDate);
      this.$store.commit('SET_ORDER_START_TIME', this.$route.query.orderStartTime);
      this.$store.commit('SET_ORDER_END_TIME', this.$route.query.orderEndTime);

      this.$store.commit('SET_ORDER_VEHICLE_ID', this.$route.query.vehicleId);

      this.$store.commit('SET_ORDER_FIRSTNAME', this.$route.query.firstName);
      this.$store.commit('SET_ORDER_LASTNAME', this.$route.query.lastName);
      this.$store.commit('SET_ORDER_PERSONAL_ID', this.$route.query.personalId);
      this.$store.commit('SET_ORDER_EMAIL', this.$route.query.email);
      this.$store.commit('SET_ORDER_PHONE', this.$route.query.phoneNumber);
      this.$store.commit('SET_ORDER_ADDRESS', this.$route.query.homeAddress);
      this.$store.commit('SET_ORDER_CITY', this.$route.query.city);
      this.$store.commit('SET_ORDER_ZIP', this.$route.query.postalCode);
      this.$store.commit('SET_ORDER_INFO', this.$route.query.additionalInfo);
      this.$store.commit('SET_ORDER_PAYMENT', this.$route.query.payment);

      // Updating order step and order navigator visibility
      this.$store.commit('SET_ORDER_STEP', this.$route.query.orderStep); // Setting the order step
      this.$store.commit('setOrderNav', 1); // Enabling order navigator bar

      // Updating order data
      this.order.orderStart = this.$store.state.order.orderStartDate + " " + this.$store.state.order.orderStartTime;
      this.order.orderEnd = this.$store.state.order.orderEndDate + " " + this.$store.state.order.orderEndTime;
      this.order.orderStartDate = this.$store.state.order.orderStartDate;
      this.order.orderEndDate = this.$store.state.order.orderEndDate;
      this.order.orderStartTime = this.$store.state.order.orderStartTime;
      this.order.orderEndTime = this.$store.state.order.orderEndTime;
      this.order.vehicleId = this.$store.state.order.vehicleId;
      this.order.firstName = this.$store.state.order.firstName;
      this.order.lastName = this.$store.state.order.lastName;
      this.order.email = this.$store.state.order.email;
      this.order.phoneNumber = this.$store.state.order.phoneNumber;
      this.order.homeAddress = this.$store.state.order.homeAddress;
      this.order.city = this.$store.state.order.city;
      this.order.postalCode = this.$store.state.order.postalCode;
      this.order.additionalInfo = this.$store.state.order.additionalInfo;
      this.order.payment = this.$store.state.order.payment;
      //this.order.amount = this.$store.state.order.amount;
      this.$store.commit('setOrderNav', this.$route.query.displayOrderNav);
      //console.log(this.order.amount);
      if(this.$route.query.orderStep === '4'){
        this.getOrderSummary();
      }


    },
    updated() {

      this.$store.commit('SET_ORDER_STEP', this.$route.query.orderStep);


      // // Get vehicle order on page refresh
      // if(this.$route.query.orderStep === '4'){
      //   this.getOrderSummary();
      // }
    }
  }
</script>