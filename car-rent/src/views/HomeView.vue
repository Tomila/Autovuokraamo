<template>
  <div>
    <div id="afterNavImage">
      <img :src="afterNavImage" alt="Image">
    /*  <img :src="commercial_Right" alt="commercial"> */
    </div>
    <SearchForm></SearchForm>
  </div>
</template>

<script>
  // @ is an alias to /src
  import SearchForm from '@/components/SearchForm.vue'


  export default {
    name: 'HomeView',

    components: {
      SearchForm
    },

    data() {
      return {
        afterNavImage: require('@/assets/images/cars-1449530.jpg'),
        orderStartTime: '',
        orderEndTime: ''
      };
    },

    methods: {

    },
    created() {
      this.$store.commit('setOrderNav', 0) // Disabling order navigator bar
    },
  }
</script>


