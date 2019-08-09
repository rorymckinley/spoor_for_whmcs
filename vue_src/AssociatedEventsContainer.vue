<template>
  <div class="panel-group" id="associated_events" role="tablist" aria-multiselectable="true">
    <AssociatedEventListing
      id-component="associated_by_mailbox"
      title="Events Associated by Mailbox Address"
      :events="eventsAssociatedByMailbox"
    />
    <AssociatedEventListing
      id-component="associated_by_ip"
      title="Events Associated by IP Address"
      :events="eventsAssociatedByIpAddress"
    />
    <AssociatedEventListing
      id-component="associated_by_forward_recipient"
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
  computed: {
    eventsAssociatedByMailbox() {
      return this.$store.getters.eventsAssociatedByMailbox;
    },
    eventsAssociatedByIpAddress() {
      return this.$store.getters.eventsAssociatedByIpAddress;
    },
    eventsAssociatedByForwardRecipient() {
      return this.$store.getters.eventsAssociatedByForwardRecipient;
    },
  },
};
</script>
