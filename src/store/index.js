import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import moment from "moment-timezone";
moment.tz.setDefault("UTC");

/* We're going to use 'axios' to handle our HTTP request when we submit our Form, so when the 'addEvent' MUTATION
is fired. We could have used 'vue-resource' to do this BUT currently 'vue-resource' DOESN'T work with server-side
Rendering and for THIS reason we're using 'axios' */
import Axios from "axios";

export default new Vuex.Store({
  state: {
    currentYear: 2018,
    currentMonth: 6,
    eventFormPosX: 0,
    eventFormPosY: 0,
    eventFormActive: false,
    events: [],
    eventFormDate: moment()
  },
  mutations: {
    // 'mutations' ALWAYS take TWO properties, 'state' and 'payload'(any data that the component wants to send)
    setCurrentMonth(state, payload) {
      state.currentMonth = payload;
    },
    setCurrentYear(state, payload) {
      state.currentYear = payload;
    },
    eventFormPos(state, payload) {
      state.eventFormPosX = payload.x;
      state.eventFormPosY = payload.y;
    },
    eventFormActive(state, payload) {
      state.eventFormActive = payload;
    },
    addEvent(state, payload) {
      state.events.push(payload);
    },
    eventFormDate(state, payload) {
      state.eventFormDate = payload;
    }
  },
  /* 'actions' like 'mutations' are FUNCTIONS defined in the STORE. 'actions' are designed to commit 'mutations' 
  and NOT to directly change the state, they can also be ASYNCHRONOUS and return a PROMISE. An 'action' takes TWO
  arguments just like a 'mutations', in a 'mutations' we get 'state' and 'payload' HERE instead we get 'context' 
  and  'payload'. This 'context' argument is an OBJECT that pretty much includes our whole STORE, giving us access
  to BOTH the 'mutations' AND the 'state' */
  actions: {
    /* The idea behind this 'addEvent' action is that we WON'T actually MUTATE the 'state',so in other words we
    DON'T run the 'context.commit("addEvent", obj)' code we have here below UNTIL we get a successful response 
    from our SERVER */
    addEvent(context, payload) {
      return new Promise((resolve, reject) => {
        let obj = {
          description: payload,
          date: context.state.eventFormDate
        };
        Axios.post("/add_event", obj).then(response => {
          if (response.status === 200) {
            /* So ONLY when we get back a successfull response we're going to commit this 'addEvent' MUTATION that
            will UPDATE our STATE(so this 'addEvent' below refers to the 'addEvent' MUTATION we defined above, that
            will PUSH this 'obj' inside the 'events' ARRAY) */
            context.commit("addEvent", obj);
            resolve();
          } else {
            reject();
          }
        });
      });
    }
  }
});
