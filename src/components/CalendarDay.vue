<template>
    <!-- Here we can directly apply the 'format' moment method because the 'day' is ALREADY a 'moment' Object.
    Then we're BINDING(using the ':' SHORTHAND version of 'v-bind:') the 'class' attribute of this 'div' element
    to the 'classObject' COMPUTED property defined below that we'll add the 'day' class ALWAYS for each element
    and the 'today' class ONLY for the CURRENT day we're in(and that is why we used 'this.$moment()') -->
    <div :class="classObject" @click="captureClick">
        {{ day.format("D") }}
        <ul class="event-list">
            <li v-for="(event, index) in events" :key='index'>{{ event.description }}</li>
        </ul>
    </div>
</template>
<script>
export default {
  props: ["day"],
  /* Remember that we use COMPUTED properties because they're REACTIVE, so if the value of the property gets 
  somehow UPDATED, then ALL the Components that use this computed property will be AUTOMATICALLY updated with the 
  NEW value */
  computed: {
    events() {
      return this.$store.state.events.filter(event =>
        event.date.isSame(this.day, "day")
      );
    },
    classObject() {
      let eventFormDate = this.$store.state.eventFormDate;
      let eventFormActive = this.$store.state.eventFormActive;
      let today = this.day.isSame(this.$moment(), "day");
      return {
        day: true,
        today,
        /* Here below we're going to apply the 'past' class for ALL the days that are the BEFORE the CURRENT 
        day(that's the reason of 'this.$moment()'). We resolved the 'isSame' problem of the 'isSameOrBefore' moment
        method by adding the '&& !today' code because we DON'T want this 'past' class to be added in the CURRENT
        day also but ONLY for the days BEFORE the current day */
        past: this.day.isSameOrBefore(this.$moment(), "day") && !today,
        active: eventFormDate.isSame(this.day, "day") && eventFormActive
      };
    }
  },
  methods: {
    /* When we're dealing with "Event Handling" methods(like this 'captureClick' here below) and we pass 'event' as
    argument THAT 'event' is going to be EXACTLY the information that we need, in our case is the 'MouseEvent' Object
    that contains ALL the informations like the x and y position on the screen and so on */
    captureClick(event) {
      /* Now, since we NEED those information to get passed from this 'CalendarDay' Component to the 'EventForm'
      Component, we're going to create a new MUTATION in our store, so that we can easily have access to these
      information anywhere */
      this.$store.commit("eventFormPos", {
        x: event.clientX,
        y: event.clientY
      });
      this.$store.commit("eventFormActive", true);
      this.$store.commit("eventFormDate", this.day);
    }
  }
};
</script>

