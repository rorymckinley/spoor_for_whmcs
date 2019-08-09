<template>
  <div>
    <EventList
      title="Probably Malicious Events"
      @refresh-probably-malicious-list="refreshProbablyMaliciousList"
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
    EventList,
    EventDetail,
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
    refreshProbablyMaliciousList() {
      this.$store.dispatch('fetchProbablyMaliciousEvents');
    },
  },
};
</script>
