<template>
    <!-- These 'top' and 'left' AFTER the ':' symbol refers to the two COMPUTED properties 'top' and 'left' we've
    here below. Same thing for the 'active' prop -->
    <div id="event-form" :class="{ active: active }" :style="{ top: top, left: left}">
        <h4>Add an event</h4>
        <p>{{ date.format("dddd, MMM Do") }}</p>
        <div class="text">
            <!-- The 'v-model' allow us to BIND this INPUT element to the 'description' data property of this
            'EventForm' Component. So now when we write something in this input, the 'description' property(that
            starts as an EMPTY string) will be AUTOMATICALLY populated with WHAT we've written inside the input,
            so it will reflect INSTALTY what we type inside this 'input' element. With the @keyup.enter="create"
            code we're saying that when the 'keyup' event OCCURS, check to see IF the key in question(so the key
            that was PRESSED) was the ENTER key of the keyboard and if this is the case THEN trigger the 'create'
            method -->
            <input v-focus type="text" v-model="description" placeholder="Dinner at Pancho's" @keyup.enter="create">
        </div>
        <div class="buttons">
            <button @click="create">Create</button>
        </div>
        <!-- This '&#10005;' below is the HTLM ENTITY for the 'x' symbol that we're using for our button here 
        below that will CLOSE the form pretty much -->
        <button id="close-button" @click="close">&#10005;</button>
    </div>
</template>
<script>
export default {
  data() {
    return {
      description: ""
    };
  },
  methods: {
    close() {
      this.$store.commit("eventFormActive", false);
    },
    create() {
      /* We're going to actually add our form on the Calendar ONLY if we've typed something inside the 'input',
      so IF the 'this.description.length > 0', in this way we PREVENT the creating of EMPTY form */
      if (this.description.length > 0) {
        /* The 'dispatch' method allow us to CALL this 'addEvent' ACTION that we've created in our store, and since
        the 'addEvent' action also returns a PROMISE, we can chain a 'then' method */
        this.$store.dispatch("addEvent", this.description).then(_ => {
          // Here we're going to CLEAR the 'input' field and CLOSE the form ONLY when the Promise RESOLVE
          this.description = "";
          this.$store.commit("eventFormActive", false);
        });
      }
    }
  },
  computed: {
    date() {
      return this.$store.state.eventFormDate;
    },
    active() {
      return this.$store.state.eventFormActive;
    },
    top() {
      return `${this.$store.state.eventFormPosY}px`;
    },
    left() {
      return `${this.$store.state.eventFormPosX}px`;
    }
  },
  // Here below we're creating a CUSTOM Directive named 'focus' that will AUTOMATICALLY put the 'input' in focus
  directives: {
    focus: {
      /* We're using the 'update' HOOK so that ANY time Vue renders OR re-renders this 'EventForm' Component, this
      'update' Hook is FIRED */
      update(el) {
        el.focus();
      }
    }
  }
};
</script>

