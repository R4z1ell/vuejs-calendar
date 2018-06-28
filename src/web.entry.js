import "./style.scss";

import moment from "moment-timezone";
moment.tz.setDefault("UTC");

let events = window.__INITIAL_STATE__.map(event => {
  return {
    description: event.description,
    date: moment(event.date)
  };
});

import VueCalendar from "./entry";

/* This '$mount' is a Vue method that allow how to MOUNT a Vue instance that DOESN'T have the 'el' option at 
instantiation(and for THIS reason will be "unmounted"). So in our case we're telling Vue to MOUNT this instance
to the 'app' ELEMENT in our template(so our 'app' div we have in the 'index.html' file pretty much). So this WHOLE
file 'web.entry.js' is what is going to run on the BROWSER, it import our sass(so the 'style.scss' above) then gets
the 'events' from our GLOBAL '__INITAL_STATE__' variable, pass these 'events' INSIDE the FUNCTION(that here in this
file we called 'VueCalendar') we're importing from the 'entry.js' file(that basically contains ALL our app) and we
finally MOUNT everything to the DOM. So now we've pretty much extracted ALL the common logic INSIDE the 'entry.js'
file and this 'web.entry.js' file now includes ONLY the stuff that we need for the BROWSER version of the App */
VueCalendar(events).$mount("#app");
