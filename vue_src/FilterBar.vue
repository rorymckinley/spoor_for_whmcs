<template>
  <form>
    <div class="form-group">
      <label :for="prefixedId('date_start')">Event Time After</label>
      <input
        :id="prefixedId('date_start')"
        v-model="search.range.start.date"
        type="date"
      >
      <input
        :id="prefixedId('time_start')"
        v-model="search.range.start.time"
        type="time"
      >
      <label :for="prefixedId('date_end')">Event Time Before</label>
      <input
        :id="prefixedId('date_end')"
        type="date"
      >
      <input
        :id="prefixedId('time_end')"
        type="time"
      >
    </div>
    <button
      :id="prefixedId('submit')"
      type="submit"
      class="btn btn-primary"
      @click.prevent="triggerFilterRequest"
    >
      Search
    </button>
  </form>
</template>
<script>
export default {
  props: {
    idPrefix: {
      type: String,
      required: true,
    },
  },
  data: function() {
    return {
      search: {
        range: {
          end: {
            date: '',
            time: '',
          },
          start: {
            date: '',
            time: '',
          },
        },
      },
    };
  },
  methods: {
    prefixedId: function(id) {
      return `${this.idPrefix}_search_bar_${id}`;
    },
    triggerFilterRequest: function() {
      const [year, month, day] = this.search.range.start.date.split('-').map((part) => parseInt(part));
      const [hour, minute] = this.search.range.start.time.split(':').map((part) => parseInt(part));
      this.$emit('filter-request', {
        event_time: {
          start: ((new Date(year, month - 1, day, hour, minute, 0)).getTime() / 1000),
        },
      });
    },
  },
};
</script>
