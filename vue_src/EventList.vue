<template>
  <div>
    <div
      id="event_listing_panel"
      class="panel panel-default"
    >
      <div class="panel-heading">
        <span>{{ title }} (Records {{ startRecordNumber + 1 }} to {{ endRecordNumber }})</span>
        <span
          id="refresh_list"
          role="button"
          class="glyphicon glyphicon-refresh"
          @click="refreshList"
        />
      </div>

      <table class="table table-striped">
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
    <nav :aria-label="paginationNavigationLabel">
      <ul class="pager">
        <li
          v-show="newerItemsToShow"
          :id="paginationNewerId"
          class="previous"
          @click="fetchNewerEvents"
        >
          <a href="#"><span aria-hidden="true">&larr;</span> Newer</a>
        </li>
        <li
          v-show="olderItemsToShow"
          :id="paginationOlderId"
          class="next"
          @click="fetchOlderEvents"
        >
          <a href="#"><span aria-hidden="true">&rarr;</span> Older</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Event from './Event.vue';
export default {
  components: {
    Event,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
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
    newerItemsToShow: function() {
      return this.$store.getters.paneViewMetadata(this.viewKey).offset > 0;
    },
    olderItemsToShow: function() {
      return this.$store.getters.paneViewMetadata(this.viewKey).more_records;
    },
    paginationNavigationLabel: function() {
      return `${this.id} pagination`;
    },
    paginationNewerId: function() {
      return `${this.id}_newer_page`;
    },
    paginationOlderId: function() {
      return `${this.id}_older_page`;
    },
    startRecordNumber: function() {
      return this.$store.getters.paneViewMetadata(this.viewKey).offset;
    },
    endRecordNumber: function() {
      return this.$store.getters.paneViewMetadata(this.viewKey).offset +
        this.$store.getters.paneViewMetadata(this.viewKey).records;
    },
  },
  methods: {
    fetchNewerEvents() {
      this.$emit('fetch-newer-events-page');
    },
    fetchOlderEvents() {
      this.$emit('fetch-older-events-page');
    },
    refreshList() {
      this.$emit('refresh-list');
    },
    passthroughSelectedEvent(selectedEventId) {
      this.$emit('mailbox-event-selected', selectedEventId);
    },
  },
};
</script>
