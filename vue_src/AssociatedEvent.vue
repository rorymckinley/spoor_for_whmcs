<template>
  <tr>
    <td>{{ date }}</td>
    <td>{{ type }}</td>
    <td>{{ assessment }}</td>
    <td>{{ eventData.mailbox_address }}</td>
    <td>{{ eventData.ip_actor.ip_address }}</td>
    <td>{{ eventData.ip_actor.country_code }}</td>
    <td>{{ eventData.forward_recipient }}</td>
  </tr>
</template>

<script>
import eventMixin from './EventMixin';
export default {
  mixins: [eventMixin],
  props: {
    'eventData': {
      type: Object,
      default: () => {},
    },
  },
};
</script>
