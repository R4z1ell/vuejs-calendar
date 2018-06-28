<template>
  <div>
    <div id="header">
      <div>
        <img src="../assets/logo.png">
        <h1>Vue.js Calendar</h1>
      </div>
      <div>
        <current-month></current-month>
      </div>
    </div>
    <div id="day-bar">
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
      <div>Sun</div>
    </div>
      <div id="calendar">
        <!-- In this 'v-for' we're looping through the 'weeks' Array that refers to the 'weeks' Computed Property 
        we've below , in our case this 'weeks' Array contains other 5 Arrays inside it -->
        <div v-for="(week, index) in weeks" class="calendar-week" :key='index'>
          <!-- Here instead we're looping inside EACH of those 5 Arrays that we have inside the 'weeks' Array and
          for EACH of these 5 Array we're outputting EACH of their element. The ':day="day"' is just a SHORTHAND 
          version for the 'v-bind:day="day"', that "day" after the equal sign will be BINDED to the 'day' inside the
          '(day, index)' -->
          <calendar-day v-for="(day, index) in week" :day="day" :key='index'></calendar-day>
        </div>
      </div>
      <event-form></event-form>
  </div>  
</template>
<script>
import CalendarDay from "./CalendarDay.vue";
import CurrentMonth from "./CurrentMonth.vue";
import EventForm from "./EventForm.vue";

export default {
  computed: {
    month() {
      return this.$store.state.currentMonth;
    },
    year() {
      return this.$store.state.currentYear;
    },
    days() {
      let days = [];
      // This code below will return the CURRENT day, so something like this for example "2018-02-01T00:00:00.000Z"
      let currentDay = this.$moment(`${this.year}-${this.month}-1`, "YYYY-M-D");
      /* Then with this 'do-while' we're taking the value of 'currentDay' and ADDING 1 day, then we push it inside 
      the 'days' Array and we KEEP adding days as long as the 'currentDay.month()' is EQUAL to 'this.month'(so the
      'month' we've above inside 'data', that is 2), so as long as the month is 2 we keep adding ALL days of that
      month INSIDE the 'days' Array, when the number of the month CHANGE the loop will stop. In this way we'll have
      a 'days' Array FILLED with one 'moment' Object  representing EVERY DAY of Febrary(so the month number 2) */
      do {
        days.push(currentDay);
        currentDay = this.$moment(currentDay).add(1, "days");
        /* Here below we're usin the 'month' METHOD of 'moment' to EXTRACT the month from this 'currenDay' Variable.
        Then we're adding the 1 because 'moment' consider Jenuary as the ZERO month, so to obtain Febrary we have 
        to add the number 1 */
      } while (currentDay.month() + 1 === this.month);

      /* Here we're storing inside this 'currentDay' Variable the FIRST day of the month, so the element with the
      ZERO index position INSIDE the 'days' Array above */
      currentDay = this.$moment(days[0]);

      const SUNDAY = 0;
      const MONDAY = 1;

      /* We SHOULDN'T subtract ANY day if the 'currentDay.day()'(that in this case is the FIRST day of the month) 
      is ALREADY a Monday */
      if (currentDay.day() !== MONDAY) {
        do {
          currentDay = this.$moment(currentDay).subtract(1, "days");
          /* 'unshift' is a JavaScript method that adds one OR more elements to the BEGINNING of an Array, so for
        example if we have an array like this [1, 2, 3] and we do [1,2,3].unshift(4,5); we get a final Array like
        this [4, 5, 1, 2, 3] */
          days.unshift(currentDay);
          /* Below we're using the 'day' METHOD of the 'moment' Libray that will return us the numerical Day of the 
      week, it ASSUMES that "Sunday"(Domenica) is equal to ZERO and "Monday" is ONE, so in our case we KEEP this
      'do-while' as long as the value of this 'currentDay.day()' is DIFFERENT from 1 */
        } while (currentDay.day() !== MONDAY);
      }

      // Inside this 'currentDay' Variable we're storing the LAST day of the month from our 'days' Array above
      currentDay = this.$moment(days[days.length - 1]);

      /* Same thing here, we shouldn't ADD any day if the 'currentDay.day()'(that in this case is the LAST day of 
      the month) is ALREADY a Sunday */
      if (currentDay.day() !== SUNDAY) {
        /* Inside this 'do-while' we keep ADDING days to the 'days' Array until the 'current.day()' is NOT equal to 
      the constant 'SUNDAY' we added above, so if for example the LAST day of Febrary 2018 was Monday, we would 
      keep ADDING days UNTIL we reach Satuarday of the NEXT month and STOP at Sunday */
        do {
          currentDay = this.$moment(currentDay).add(1, "days");
          days.push(currentDay);
        } while (currentDay.day() !== SUNDAY);
      }

      return days;
    },
    weeks() {
      let weeks = [];
      let week = [];

      for (let day of this.days) {
        week.push(day);
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      return weeks;
    }
  },
  components: {
    CalendarDay,
    CurrentMonth,
    EventForm
  }
};
</script>

