import { createStore } from "vuex";


const store = createStore({

  state: {
    orderStep: 1,
    displayOrderNav: 0, // Order navigator bar visibility

    // Order information data
    order: [
      { orderStart: '', orderEnd: '', orderStartDate: '', orderEndDate: '', orderStartTime: '', orderEndTime: '', vehicleId: '', vehicleType: '', vehicleModel: '', vehicleSrc: '', customerId: '', firstName: '', lastName: '', email: '' }
    ]
  },
  mutations: {
    //Toggle navigator bar visibility: 1 is on 2 is off
    setOrderNav(state, payload) {
      state.displayOrderNav = payload
    },

    // Order data setters
    SET_ORDER_STEP: (state, payload) => {
      state.orderStep = payload;
    },
    SET_ORDER_START: (state, orderStart) => {
      state.order.orderStart = orderStart;
    },
    SET_ORDER_END: (state, orderEnd) => {
      state.order.orderEnd = orderEnd;
    },
    SET_ORDER_START_DATE: (state, orderStartDate) => {
      state.order.orderStartDate = orderStartDate;
    },
    SET_ORDER_END_DATE: (state, orderEndDate) => {
      state.order.orderEndDate = orderEndDate;
    },
    SET_ORDER_START_TIME: (state, orderStartTime) => {
      state.order.orderStartTime = orderStartTime;
    },
    SET_ORDER_END_TIME: (state, orderEndTime) => {
      state.order.orderEndTime = orderEndTime;
    },
    SET_ORDER_VEHICLE_ID: (state, vehicleId) => {
      state.order.vehicleId = vehicleId;
    },
    SET_ORDER_VEHICLE_TYPE: (state, vehicleType) => {
      state.order.vehicleType = vehicleType;
    },
    SET_ORDER_VEHICLE_MODEL: (state, vehicleModel) => {
      state.order.vehicleModel = vehicleModel;
    },
    SET_ORDER_VEHICLE_SRC: (state, vehicleSrc) => {
      state.order.vehicleSrc = vehicleSrc;
    },
    SET_ORDER_CUSTOMER_ID: (state, customerId) => {
      state.order.customerId = customerId;
    },
    SET_ORDER_FIRSTNAME: (state, firstName) => {
      state.order.firstName = firstName;
    },
    SET_ORDER_LASTNAME: (state, lastName) => {
      state.order.lastName = lastName;
    },
    SET_ORDER_EMAIL: (state, email) => {
      state.order.email = email;
    }
  },
  getters: {
  },


  actions: {
  },
  modules: {
  },


});

export default store
