window.requestPath = 'https://whmcs.host/module.php?stuff=foo';

import axios from 'axios';
import actions from '../vue_src/actions';

import flushPromises from 'flush-promises';

const events = [
  {id: '1A', latest_assessment: 'probably_malicious'},
  {id: '1B', latest_assessment: 'probably_benign'},
  {id: '1C', latest_assessment: 'probably_benign'},
  {id: '1D', latest_assessment: 'probably_malicious'},
  {id: '1E', latest_assessment: 'probably_malicious'},
];

const metadata = {
  offset: 20,
  records: 10,
  more_records: true,
};

const context = {
  commit: jest.fn(),
  getters: {
    panes: [],
  },
};

describe('actions', () => {
  let actualGet;
  let actualPost;
  const response = {
    data: {
      mailbox_events: events,
      metadata,
    },
  };
  beforeEach(() => {
    actualGet = axios.get;
    actualPost = axios.post;
  });
  afterEach(() => {
    axios.get = actualGet;
    axios.post = actualPost;
  });
  describe('fetchProbablyMaliciousEvents', () => {
    beforeEach(() => {
      axios.get = jest.fn(() => Promise.resolve(response));
    });
    it('fetches the list of events from the backend', () => {
      actions.fetchProbablyMaliciousEvents(context, {viewKey: 'selectedPaneView'});
      expect(axios.get).toHaveBeenCalledWith(`${window.requestPath}&ajax=true&action=fetch_probably_malicious_events`);
    });
    it('mutates the collection of events as well as the specified paneView', async () => {
      expect.assertions(3);
      actions.fetchProbablyMaliciousEvents(context, {viewKey: 'selectedPaneView'});
      await flushPromises;
      expect(context.commit.mock.calls.length).toBe(2);
      expect(context.commit.mock.calls[0]).toEqual(['updateEvents', {events}]);
      expect(context.commit.mock.calls[1]).toEqual([
        'updatePaneView',
        {events, metadata, viewKey: 'selectedPaneView'},
      ]);
    });
  });
  describe('fetchConfirmedMaliciousEvents', () => {
    beforeEach(() => {
      axios.get = jest.fn(() => Promise.resolve(response));
    });
    it('fetches the list of events from the backend', () => {
      actions.fetchConfirmedMaliciousEvents(context, {viewKey: 'selectedPaneView'});
      expect(axios.get).toHaveBeenCalledWith(`${window.requestPath}&ajax=true&action=fetch_confirmed_malicious_events`);
    });
    it('mutates the collection of events as well as the specified paneView', async () => {
      expect.assertions(3);
      actions.fetchConfirmedMaliciousEvents(context, {viewKey: 'selectedPaneView'});
      await flushPromises;
      expect(context.commit.mock.calls.length).toBe(2);
      expect(context.commit.mock.calls[0]).toEqual(['updateEvents', {events}]);
      expect(context.commit.mock.calls[1]).toEqual(['updatePaneView', {events, metadata, viewKey: 'selectedPaneView'}]);
    });
  });
  describe('fetchAssociatedMailboxEvents', () => {
    const selectedId = '1C';
    const forForwardRecipientResponse = {
      data: {
        mailbox_events: [events[2]],
      },
    };
    const forIpActorResponse = {
      data: {
        mailbox_events: [events[1]],
      },
    };
    const forMailboxResponse = {
      data: {
        mailbox_events: [events[0]],
      },
    };
    beforeEach(() => {
      axios.get = jest.fn((url) => {
        if (url.includes('for_mailbox')) {
          return Promise.resolve(forMailboxResponse);
        } else if (url.includes('for_ip_actor')) {
          return Promise.resolve(forIpActorResponse);
        } else {
          return Promise.resolve(forForwardRecipientResponse);
        }
      });
    });
    it('fetches events associated by mailbox, ip address and forward recipient', () => {
      actions.fetchAssociatedMailboxEvents(context, selectedId);
      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(axios.get).toHaveBeenCalledWith(
        `${window.requestPath}&ajax=true&action=fetch_events_for_mailbox&mailbox_event_id=1C`
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${window.requestPath}&ajax=true&action=fetch_events_for_ip_actor&mailbox_event_id=1C`
      );
      expect(axios.get).toHaveBeenCalledWith(
        `${window.requestPath}&ajax=true&action=fetch_events_for_forward_recipient&mailbox_event_id=1C`
      );
    });
    it('updates events with the received events', async () => {
      expect.assertions(6);
      actions.fetchAssociatedMailboxEvents(context, selectedId);

      await flushPromises;

      expect(context.commit).toHaveBeenCalledWith('updateEvents', {events: forMailboxResponse.data.mailbox_events});
      expect(context.commit).toHaveBeenCalledWith('updateAssociatedByMailboxAddressEventIds', {
        mailboxEventId: selectedId,
        associatedEvents: forMailboxResponse.data.mailbox_events,
      });

      expect(context.commit).toHaveBeenCalledWith('updateEvents', {events: forIpActorResponse.data.mailbox_events});
      expect(context.commit).toHaveBeenCalledWith('updateAssociatedByIpActorEventIds', {
        mailboxEventId: selectedId,
        associatedEvents: forIpActorResponse.data.mailbox_events,
      });

      expect(context.commit).toHaveBeenCalledWith('updateEvents', {
        events: forForwardRecipientResponse.data.mailbox_events,
      });
      expect(context.commit).toHaveBeenCalledWith('updateAssociatedByForwardRecipientEventIds', {
        mailboxEventId: selectedId,
        associatedEvents: forForwardRecipientResponse.data.mailbox_events,
      });
    });
  });
  describe('updateMailboxEvent', () => {
    window.authenticityToken='99luftballons';
    const response = {
      data: {
        mailbox_event: {id: '1C', latest_assessment: 'foo_bar_baz'},
      },
    };

    beforeEach(() => {
      axios.post = jest.fn(() => Promise.resolve(response));
      context.dispatch = jest.fn();
    });

    it('makes the call to the backend', () => {
      actions.updateMailboxEvent(context, {
        mailboxEventId: '1C', mailboxEvent: {assessment: 'foo_bar_baz'},
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        `${window.requestPath}&ajax=true&action=update_mailbox_event&mailbox_event_id=1C`,
        {
          authenticity_token: '99luftballons',
          mailbox_event: {assessment: 'foo_bar_baz'},
        }
      );
    });

    it('updates the event data with the data returned from the call', async () => {
      expect.assertions(2);
      actions.updateMailboxEvent(context, {
        mailboxEventId: '1C', mailboxEvent: {assessment: 'foo_bar_baz'},
      });

      await flushPromises;

      expect(context.commit).toHaveBeenCalledTimes(1);
      expect(context.commit).toHaveBeenCalledWith(
        'updateEvents', {events: [{id: '1C', latest_assessment: 'foo_bar_baz'}]}
      );
    });

    it('updates the panes', async () => {
      expect.assertions(3);

      context.getters.panes = [
        {seedAction: ['foo', {f: 'oo'}], viewKey: 'fooKey'},
        {seedAction: ['bar', {b: 'ar'}], viewKey: 'barKey'},
      ];

      actions.updateMailboxEvent(context, {
        mailboxEventId: '1C', mailboxEvent: {assessment: 'foo_bar_baz'},
      });

      await flushPromises;

      expect(context.dispatch).toHaveBeenCalledTimes(2);
      expect(context.dispatch).toHaveBeenCalledWith('foo', {f: 'oo', viewKey: 'fooKey'});
      expect(context.dispatch).toHaveBeenCalledWith('bar', {b: 'ar', viewKey: 'barKey'});
    });
  });
});
