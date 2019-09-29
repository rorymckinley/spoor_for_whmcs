import axios from 'axios';

/**
 * Converts a params object into a string
 *
 * @param {string} paramRootName Root name for nested hash
 * @param {object} elements Object containing keys and values for the params
 *
 * @return {string}
 */
function buildParams(paramRootName, elements) {
  const paramEntries = Object.entries(elements);

  return paramEntries.reduce((accumulator, [key, value]) => {
    if (typeof(value) === 'object') {
      accumulator += buildParams(`${paramRootName}[${key}]`, value);
    } else {
      accumulator += `&${paramRootName}[${key}]=${value}`;
    }

    return accumulator;
  }, '');
  // for (const [key, value] of paramEntries) {
  //   if (value === null) {
  //   } else if (typeof(value) === 'object') {
  //     output += buildParams(`${paramRootName}[${key}]`, value);
  //   } else {
  //     output += `&${paramRootName}[${key}]=${value}`;
  //   }
  // }
  // return output;
};

export default {
  fetchProbablyMaliciousEvents(context, {viewKey, records, offset}) {
    axios
      .get(`${requestPath}&ajax=true&action=fetch_probably_malicious_events&offset=${offset}&records=${records}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updatePaneView', {
          events: response.data.mailbox_events, metadata: response.data.metadata, viewKey,
        });
      });
  },
  fetchConfirmedMaliciousEvents(context, {viewKey, records, offset}) {
    axios
      .get(`${requestPath}&ajax=true&action=fetch_confirmed_malicious_events&offset=${offset}&records=${records}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit('updatePaneView', {
          events: response.data.mailbox_events, metadata: response.data.metadata, viewKey,
        });
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
        // TODO  It feels like this function is doing a bit too much here
        for (const pane of context.getters.panes) {
          const [action, options] = pane.seedAction;
          const offset = context.getters.paneViewMetadata(pane.viewKey).offset;
          context.dispatch(
            action,
            Object.assign({}, options, {viewKey: pane.viewKey, records: context.getters.recordsPerPage, offset})
          );
        }
      });
  },
  filterEvents(context, {filter, offset, records, viewKey}) {
    const basePath = `${requestPath}&ajax=true&action=filter_mailbox_events`;
    const pagination = `&offset=${offset}&records=${records}`;

    const filterParams = buildParams('mailbox_events', filter);

    axios
      .get(`${basePath}${filterParams}${pagination}`)
      .then((response) => {
        context.commit('updateEvents', {events: response.data.mailbox_events});
        context.commit(
          'updatePaneView', {events: response.data.mailbox_events, metadata: response.data.metadata, viewKey}
        );
      });
  },
};
