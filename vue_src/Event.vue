<template>
  <tr @click="eventDetailRequired(eventData.id)">
    <td>{{ date }}</td>
    <td>{{ type }}</td>
    <td>{{ eventData.mailbox_address }}</td>
    <td>{{ eventData.host }}</td>
  </tr>
</template>

<script>
import eventMixin from './EventMixin.js';
export default {
  mixins: [eventMixin],
  props: {
    'eventData': {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    eventDetailRequired(mailboxEventId) {
      this.$emit('mailbox-event-selected', mailboxEventId);
    },
  },
};
</script>
