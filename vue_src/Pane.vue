<template>
  <div>
    <EventList
      :id="eventListId"
      :title="title"
      :seed-action="seedAction"
      :view-key="viewKey"
      @refresh-list="refreshList"
      @mailbox-event-selected="setSelectedEventId"
      @fetch-newer-events-page="fetchNewerEventsPage"
      @fetch-older-events-page="fetchOlderEventsPage"
    />
    <EventDetail
      v-if="eventSelected"
      :event-data="selectedEventData"
      @mailbox-event-update="updateMailboxEvent"
    />
    <AssociatedEventsContainer
      v-if="eventSelected"
      :prefix="id"
      :selected-event-id="eventSelected"
    />
  </div>
</template>

<script>
import AssociatedEventsContainer from './AssociatedEventsContainer.vue';
import EventDetail from './EventDetail.vue';
import EventList from './EventList.vue';
export default {
  components: {
    AssociatedEventsContainer,
    EventDetail,
    EventList,
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
    eventListId() {
      return `${this.id}_event_list`;
    },
    selectedEventData() {
      return this.$store.getters.selectedEventData(this.id);
    },
    eventSelected() {
      return this.$store.getters.selectedEventId(this.id);
    },
  },
  mounted() {
    this.seedData();
  },
  methods: {
    updateMailboxEvent(mailboxEventId, data) {
      this.$store.dispatch('updateMailboxEvent', {
        mailboxEventId,
        mailboxEvent: data,
      });
    },
    refreshList() {
      this.seedData(this.$store.getters.paneViewMetadata(this.viewKey).offset);
    },
    seedData(offset = 0) {
      const [action, options] = this.seedAction;
      this.$store.dispatch(
        action,
        Object.assign({}, options, {records: this.$store.getters.recordsPerPage, viewKey: this.viewKey, offset})
      );
    },
    setSelectedEventId(selectedEventId) {
      this.$store.commit('setSelectedEventId', {paneId: this.id, selectedEventId});
      this.$store.commit('initialiseAssociatedEventIds', {mailboxEventId: selectedEventId});
      this.$store.dispatch('fetchAssociatedMailboxEvents', selectedEventId);
    },
    fetchNewerEventsPage() {
      const nextOffset = this.$store.getters.paneViewMetadata(this.viewKey).offset - this.$store.getters.recordsPerPage;
      this.seedData(nextOffset);
    },
    fetchOlderEventsPage() {
      const nextOffset = this.$store.getters.paneViewMetadata(this.viewKey).offset + this.$store.getters.recordsPerPage;
      this.seedData(nextOffset);
    },
  },
};
</script>
