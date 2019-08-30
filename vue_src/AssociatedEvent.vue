<template>
  <tr>
    <td>{{ date }}</td>
    <td>{{ type }}</td>
    <td>{{ assessment }}</td>
    <td>{{ eventData.mailbox_address }}</td>
    <td>{{ eventData.ip_actor.ip_address }}</td>
    <td>{{ eventData.ip_actor.country_code }}</td>
    <td>{{ eventData.forward_recipient }}</td>
    <td>
      <span
        class="glyphicon glyphicon-warning-sign spoor-clickable"
        spoor-control="setToProbablyMalicious"
        @click="setToProbablyMalicious"
        v-if="displayAssessmentControls()"
      />
    </td>
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
  methods: {
    displayAssessmentControls() {
      return !(['probably_malicious', 'confirmed_malicious'].includes(this.eventData.latest_assessment));
    },
    setToProbablyMalicious() {
      this.$store.dispatch('updateMailboxEvent', {
        mailboxEventId: this.eventData.id,
        mailboxEvent: {assessment: 'probably_malicious'},
      });
    },
  },
};
</script>
