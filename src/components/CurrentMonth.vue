<template>
    <div>
        <div>{{ formattedDate }}</div>
        <!-- Here we're using the '@:click' that is the SHORTHAND version for 'v-on:click' -->
        <button @click="dec">-</button>
        <button @click="inc">+</button>
    </div>
</template>
<script>
export default {
  methods: {
    dec() {
      if (this.month === 1) {
        /* When the 'month' is 1, so when we're in Jenuary if we try to CLICK on the 'dec' button we're going to
        use the 'setCurrentMonth' mutation to SET the value of the 'currentMonth' to 12, so to DECEMBER. Then we
        ALSO want to CHANGE the year, so we use the 'setCurrentYear' mutation to do so */
        this.$store.commit("setCurrentMonth", 12);
        this.$store.commit("setCurrentYear", this.year - 1);
      } else {
        this.$store.commit("setCurrentMonth", this.month - 1);
      }
      this.$store.commit("eventFormActive", false);
    },
    inc() {
      if (this.month === 12) {
        this.$store.commit("setCurrentMonth", 1);
        this.$store.commit("setCurrentYear", this.year + 1);
      } else {
        this.$store.commit("setCurrentMonth", this.month + 1);
      }
      this.$store.commit("eventFormActive", false);
    }
  },
  computed: {
    formattedDate() {
      return this.$moment(`${this.year}-${this.month}-1`, "YYYY-M-D").format(
        "MMMM YYYY"
      );
    },
    month() {
      return this.$store.state.currentMonth;
    },
    year() {
      return this.$store.state.currentYear;
    }
  }
};
</script>

