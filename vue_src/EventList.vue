<template>
  <div
    id="event_listing_panel"
    class="panel panel-default"
  >
    <div class="panel-heading">
      <span>{{ title }}</span>
      <span
        id="refresh_list"
        role="button"
        class="glyphicon glyphicon-refresh"
        @click="refreshList"
      />
    </div>

    <table class="table">
      <tr>
        <th>
          Time
        </th>
        <th>
          Type
        </th>
        <th>
          Mailbox Address
        </th>
        <th>
          Host
        </th>
      </tr>

      <Event
        v-for="event in events"
        :key="event.id"
        :event-data="event"
        @mailbox-event-selected="passthroughSelectedEvent"
      />
    </table>
  </div>
</template>

<script>
import Event from './Event.vue';
export default {
  components: {
    Event,
  },
  props: {
    seedAction: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
    viewKey: {
      type: String,
      default: '',
    },
  },
  computed: {
    events: function() {
      return this.$store.getters.paneViewEvents(this.viewKey);
    },
  },
  methods: {
    refreshList() {
      this.$emit('refresh-list');
    },
    passthroughSelectedEvent(selectedEventId) {
      this.$emit('mailbox-event-selected', selectedEventId);
    },
  },
};
</script>
