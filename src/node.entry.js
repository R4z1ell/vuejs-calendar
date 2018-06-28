import VueCalendar from "./entry";

/* For "Server-side-rendering" we DON'T use an HTML template and so we DON'T have to use the code we have inside
the 'web.entry.js' file, so the 'VueCalendar(events).$mount("#app")' code pretty much. Instead on the server we 
just have to EXPORT a Function that RETURNS the 'VueCalendar' Function, this is all that we need to do */
export default function(context) {
  return VueCalendar(context.events);
}
