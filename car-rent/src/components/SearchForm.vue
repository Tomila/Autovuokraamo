<template>
  <!-- Vehicle search form by date -->

  <div id="searchFormContainer">
    <h2>Syötä päivämääräväli</h2>
    <form @submit="checkForm" action="/car-results">
      <div>
        <input
            type="hidden"
            v-model="displayOrderNav"
            id="displayOrderNav"
            name="displayOrderNav">

        <!-- Form errors -->
        <div class="formErrorRow" v-if="errors.length">
          <p>Ole hyvä ja täytä pakolliset kentät:</p>
          <ul class="error">
            <li v-for="error in errors" v-bind:key="error.message">{{ error }}</li>
          </ul>
        </div>
        <!-- End of form error -->

        <div id="formRow">
          <label for="vehicleType">Ajoneuvon tyyppi:</label>
          <select
              v-model="vehicleType"
              name="vehicleType">
            <option disabled value="">Valitse ajoneuvon tyyppi:</option>
            <option>Henkilöauto</option>
            <option>Pakettiauto</option>
            <option>Minibussi</option>
            <option>Karavaanari</option>
          </select>
        </div>
        <div class="formRow">
          <div class="formColumn">
           <label for="orderStartDate">Alkupäivämäärä:</label>
            <input
                type="date"
                v-model="orderStartDate"
                id="orderStartDate"
                name="orderStartDate">
          </div>
          <div class="formColumn">
            <label for="orderStartTime">Alkuaika:</label>
            <select
                v-model="orderStartTime"
                name="orderStartTime">
              <option disabled value="">Valitse aika</option>
              <option>00:00</option>
              <option>01:00</option>
              <option>02:00</option>
              <option>03:00</option>
              <option>04:00</option>
              <option>05:00</option>
              <option>06:00</option>
              <option>07:00</option>
              <option>08:00</option>
              <option>09:00</option>
              <option>10:00</option>
              <option>11:00</option>
              <option>12:00</option>
              <option>13:00</option>
              <option>14:00</option>
              <option>15:00</option>
              <option>16:00</option>
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
              <option>22:00</option>
              <option>23:00</option>
            </select>
          </div>
        </div>
        <div class="formRow">
          <div class="formColumn">
            <label for="orderEndDate">Loppupäivämäärä:</label>
            <input
                type="date"
                v-model="orderEndDate"
                id="orderEndDate"
                name="orderEndDate">
          </div>
          <div class="formColumn">
            <label for="orderStartDate">Loppuaika:</label>
            <select
                v-model="orderEndTime"
                name="orderEndTime">
              <option disabled value="">Valitse aika</option>
              <option>00:00</option>
              <option>01:00</option>
              <option>02:00</option>
              <option>03:00</option>
              <option>04:00</option>
              <option>05:00</option>
              <option>06:00</option>
              <option>07:00</option>
              <option>08:00</option>
              <option>09:00</option>
              <option>10:00</option>
              <option>11:00</option>
              <option>12:00</option>
              <option>13:00</option>
              <option>14:00</option>
              <option>15:00</option>
              <option>16:00</option>
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
              <option>22:00</option>
              <option>23:00</option>
            </select>
          </div>
        </div>
        <div class="formRow">
          <input type="submit" value="Etsi autoja">
        </div>
      </div>
    </form>
  </div>
</template>

<script>

export default {

  data(){
    return {
      displayOrderNav: 1,  // Value for search form hidden field
      errors: [],          // Form errors
      orderStartDate: '',
      orderEndDate: '',
      orderStartTime: '',
      orderEndTime: '',
      vehicleType: ''
    }

  },
  methods: {
    // checkForm(){
    //   if(!this.orderStartDate||!this.orderEndDate){
    //     alert('Please select dates!')
    //     //await this.$router.push("/")
    //   }
    //
    //   //this.$emit('makeSearch', this.orderStartTime, this.orderEndTime)
    //   //await this.$router.push("/car-results?displayOrderNav=true&orderStartTime=" + this.orderStartTime + "&orderEndTime=" + this.orderEndTime );
    // },
    checkForm: function (e) {
      if (this.orderStartDate && this.orderEndDate) {
        return true;
      }

      this.errors = [];

      if (!this.orderStartDate) {
        this.errors.push('Start date required.');
      }
      if (!this.orderEndDate) {
        this.errors.push('End date required.');
      }

      e.preventDefault();
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#searchFormContainer{
  margin: 0;
  padding: 20px 0;
  background-color: #ccc;

}
form{
  margin: 0 auto;
  max-width: 600px;
}
.formRow{
  display:flex;
  flex-wrap: wrap;

}
.formColumn{
  width: 50%;
  padding: 0;
}

* {box-sizing: border-box;}


label {
  float: left;
}

input[type=text], [type=date], [type=email], textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;

  resize: vertical;
}
input[type=submit]{
  margin: 0 auto;
}
select{
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}

input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #45a049;
}
ul.error{

}
</style>
