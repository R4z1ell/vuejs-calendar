import Vue from "vue";
import store from "./store";

import moment from "moment-timezone";
moment.tz.setDefault("UTC");

Object.defineProperty(Vue.prototype, "$moment", {
  get() {
    return this.$root.moment;
  }
});

import App from "./components/App.vue";

export default function(events) {
  /* This 'assign' method will allow us to COPY the 'state' of our store INSIDE this EMPTY Object we're passing as
  FIRST argument for the 'assign' method. So initially this 'initialState' is going to be an EMPTY Object and THEN 
  we MERGE into this empty Object the 'store.state'(so the 'state' Object of our store with ALL his properties), and
  then we pass an Object with just that one property 'events' that refers to the 'events' ARRAY we have just here
  above, that takes the data from the GLOBAL '__INITIAL_STATE__' Variable we created in the 'server.js' file that
  contains those 'events' and we MAP through EACH of these 'events' and we return an Object that we then pass just
  here below in this 'initialState' variable and FINALLY we pass this data INSIDE the 'replaceState' method below
  to UPDATE our STORE'S state. So NOW if for example we add a NEW event in our Calendar through the form and then we
  hit the 'create' button and we REFRESH the page, our data will NOT be lost and will still be there. This because
  now we're STORING that data INTO our SERVER because when we ADD a new event from our Calendar it goes through a 
  POST request to the "/add_event" ROUTE(that we've setup in our 'server.js') where we PUSH these events we just 
  created INSIDE the 'event' Array(that we also have there in the 'server.js' file). When the page RELOAD our store 
  is also UPDATED with the correct data because NOW they come DIRECTLY from the server, of course if we RESTART our 
  server for whatever reason those data gets lost and we just see the MOCKUP data we've inside the 'events' Array,
  so just those three Objects we've inside the 'events' Array in the 'server.js' file */
  let initialState = Object.assign({}, store.state, { events });
  /* This 'replaceState' below is a Vuex METHOD that allow us to REPLACE the 'state' Object we've INSIDE our store.
  The whole point of this was to be able to EXTRACT the elements of the 'events' Array above INSIDE this file, so
  this 'web.entry.js' file where we're, because is from HERE that we're going to get our data for the SERVER */
  store.replaceState(initialState);

  return new Vue({
    data: {
      moment
    },
    components: {
      App
    },
    store,
    /* The 'render' function allow us to create VIRTUL NODES manually, rather than via a template and THIS is what 
    we'll allow us to use SERVER-SIDE-RENDERING. The 'render' function takes one argument called 'createElement' that
    is a FUNCTION itself that takes THREE arguments, a TAG name, the OPTIONS(where we can add all the various html
    properties we want, like 'id' 'class' and so on) and last an ARRAY of children. EACH Child node will ALSO be the
    RETURN value of a 'createElement' call */
    render(createElement) {
      return createElement("div", { attrs: { id: "app" } }, [
        // The 'createElement' function ALSO returns a V-NODE(a virtual Node)
        createElement("app")
      ]);
    }
  });
}
