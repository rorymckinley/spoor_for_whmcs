import axios from 'axios';

export default {
  fetchProbablyMaliciousEvents(context) {
    axios
      .get(`${requestPath}&ajax=true&action=fetch_probably_malicious_events`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updateProbablyMaliciousEventIds', {events: response.data.mailbox_events});
      });
  },
  fetchAssociatedMailboxEvents(context, mailboxEventId) {
    axios
      .get(`${requestPath}&ajax=true&action=fetch_events_for_mailbox&mailbox_event_id=${mailboxEventId}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updateAssociatedByMailboxAddressEventIds', {
          mailboxEventId,
          associatedEvents: response.data.mailbox_events,
        });
      });
    ;

    axios
      .get(`${requestPath}&ajax=true&action=fetch_events_for_ip_actor&mailbox_event_id=${mailboxEventId}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updateAssociatedByIpActorEventIds', {
          mailboxEventId,
          associatedEvents: response.data.mailbox_events,
        });
      });

    axios
      .get(`${requestPath}&ajax=true&action=fetch_events_for_forward_recipient&mailbox_event_id=${mailboxEventId}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updateAssociatedByForwardRecipientEventIds', {
          mailboxEventId,
          associatedEvents: response.data.mailbox_events,
        });
      });
  },
  updateMailboxEvent(context, {mailboxEventId, mailboxEvent}) {
    axios
      .post(
        `${requestPath}&ajax=true&action=update_mailbox_event&mailbox_event_id=${mailboxEventId}`,
        {authenticity_token: window.authenticityToken, mailbox_event: mailboxEvent}
      )
      .then((response) => {
        context.commit('updateEvents', {events: [response.data.mailbox_event]});
        context.dispatch('fetchProbablyMaliciousEvents');
      });
  },
};