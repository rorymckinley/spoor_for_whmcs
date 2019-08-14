<template>
  <div>
    <EventList
      :title="title"
      :seed-action="seedAction"
      @refresh-list="refreshList"
    />
    <EventDetail
      v-if="eventSelected"
      :event-data="selectedEventData"
      @mailbox-event-update="updateMailboxEvent"
    />
    <AssociatedEventsContainer v-if="eventSelected" />
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
    seedAction: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    selectedEventData() {
      return this.$store.getters.selectedEventData;
    },
    eventSelected() {
      return this.$store.getters.selectedEventId;
    },
  },
  methods: {
    updateMailboxEvent(mailboxEventId, data) {
      this.$store.dispatch('updateMailboxEvent', {
        mailboxEventId,
        mailboxEvent: data,
      });
    },
    refreshList() {
      this.$store.dispatch(...this.seedAction);
    },
  },
};
</script>
