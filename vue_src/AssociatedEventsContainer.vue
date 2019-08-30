<template>
  <div class="panel-group" :id="panelId" role="tablist" aria-multiselectable="true">
    <AssociatedEventListing
      :id-component="mailboxIdComponent"
      title="Events Associated by Mailbox Address"
      :events="eventsAssociatedByMailbox"
    />
    <AssociatedEventListing
      :id-component="ipIdComponent"
      title="Events Associated by IP Address"
      :events="eventsAssociatedByIpAddress"
    />
    <AssociatedEventListing
      :id-component="forwardRecipientIdComponent"
      title="Events Associated by Forward Recipient"
      :events="eventsAssociatedByForwardRecipient"
    />
  </div>
</template>

<script>
import AssociatedEventListing from './AssociatedEventListing.vue';
export default {
  components: {
    AssociatedEventListing,
  },
  props: {
    selectedEventId: {
      type: String,
      default: '',
    },
    prefix: {
      type: String,
      required: true,
    },
  },
  computed: {
    eventsAssociatedByMailbox() {
      return this.$store.getters.eventsAssociatedByMailbox(this.selectedEventId);
    },
    eventsAssociatedByIpAddress() {
      return this.$store.getters.eventsAssociatedByIpAddress(this.selectedEventId);
    },
    eventsAssociatedByForwardRecipient() {
      return this.$store.getters.eventsAssociatedByForwardRecipient(this.selectedEventId);
    },
    forwardRecipientIdComponent() {
      return this.prefixId('associated_by_forward_recipient');
    },
    ipIdComponent() {
      return this.prefixId('associated_by_ip');
    },
    mailboxIdComponent() {
      return this.prefixId('associated_by_mailbox');
    },
    panelId() {
      return this.prefixId('associated_events');
    },
  },
  methods: {
    prefixId(id) {
      return `${this.prefix}_${id}`;
    },
  },
};
</script>
