<template>
  <div
    id="event_detail_panel"
    class="panel panel-default"
  >
    <div class="panel-heading">
      Event Details
    </div>

    <table class="table">
      <tr>
        <th colspan="2">
          Event
        </th>
        <th colspan="2">
          IP Data
        </th>
      </tr>
      <tr>
        <td>Time</td>
        <td event-detail-item="event_time">
          {{ date }}
        </td>
        <td>Ip Address</td>
        <td event-detail-item="ip_ip_address">
          {{ eventData.ip_actor.ip_address }}
        </td>
      </tr>
      <tr>
        <td>Type</td>
        <td event-detail-item="type">
          {{ type }}
        </td>
        <td>
          City
        </td>
        <td event-detail-item="ip_city">
          {{ eventData.ip_actor.city }}
        </td>
      </tr>
      <tr>
        <td>
          Mailbox Address
        </td>
        <td event-detail-item="mailbox_address">
          {{ eventData.mailbox_address }}
        </td>
        <td>
          Country Code
        </td>
        <td event-detail-item="ip_country_code">
          {{ eventData.ip_actor.country_code }}
        </td>
      </tr>
      <tr>
        <td>
          Host
        </td>
        <td event-detail-item="host">
          {{ eventData.host }}
        </td>
        <td colspan="2">
          Owner
        </td>
      </tr>
      <tr>
        <td>
          Forward Recipient
        </td>
        <td event-detail-item="forward_recipient">
          {{ eventData.forward_recipient }}
        </td>
        <td>
          ISP
        </td>
        <td event-detail-item="ip_isp">
          {{ eventData.ip_actor.owner.isp }}
        </td>
      </tr>
      <tr>
        <td>
          Assessment
        </td>
        <td event-detail-item="assessment">
          <select @change="eventDetailChange">
            <option
              v-for="assessment in eventData.operations.update.valid_assessments"
              :key="assessment"
              :value="assessment"
              :selected="assessment === eventData.latest_assessment"
            >
              {{ humanizeAssessment(assessment) }}
            </option>
          </select>
        </td>
        <td>
          Organisation
        </td>
        <td event-detail-item="ip_organisation">
          {{ eventData.ip_actor.owner.organisation }}
        </td>
      </tr>
      <tr>
        <td event-action-item='update_event'></td><td></td><td></td><td></td>
      </tr>
    </table>
  </div>
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
    eventDetailChange(event) {
      this.$emit('mailbox-event-update', this.eventData.id, {assessment: event.target.selectedOptions[0].value});
    },
  },
};
</script>
