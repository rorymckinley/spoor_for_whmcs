<template>
  <div class="panel panel-default">
    <div
      :id="headerId"
      class="panel-heading"
      role="tab"
    >
      <h4 class="panel-title">
        <a
          role="button"
          data-toggle="collapse"
          data-parent="#associated_events"
          :href="contentHref"
          aria-expanded="true"
          :aria-controls="contentId"
        >
          {{ title }}
        </a>
      </h4>
    </div>
    <div
      :id="contentId"
      class="panel-collapse collapse"
      role="tabpanel"
      :aria-labelledby="headerId"
    >
      <div class="panel-body">
        <table class="table">
          <tr>
            <th>Event Time</th>
            <th>Type</th>
            <th>Assessment</th>
            <th>Mailbox Address</th>
            <th>IP Address</th>
            <th>IP Country Code</th>
            <th>Forward Recipient</th>
            <th>&nbsp;</th> <!-- Holds a place open for actions -->
          </tr>

          <AssociatedEvent
            v-for="event in events"
            :key="event.id"
            :event-data="event"
          />
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AssociatedEvent from './AssociatedEvent.vue';
export default {
  components: {
    AssociatedEvent,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
    idComponent: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    contentHref() {
      return `#${this.idComponent}_content`;
    },
    contentId() {
      return `${this.idComponent}_content`;
    },
    headerId() {
      return `${this.idComponent}_header`;
    },
  },
};
</script>
