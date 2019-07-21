import Vue from 'vue';
import mutations from '../vue_src/mutations';

describe('mutations', () => {
  let oldSet;
  let state;
  beforeEach(() => {
    oldSet = Vue.set;
    state = {
      events: [
        {id: '1A', latest_assessment: 'probably_malicious'},
        {id: '1B', latest_assessment: 'probably_benign'},
        {id: '1C', latest_assessment: 'probably_benign'},
        {id: '1D', latest_assessment: 'probably_malicious'},
        {id: '1E', latest_assessment: 'probably_malicious'},
      ],
      probablyMaliciousEventIds: ['1A', '1D'],
    };
  });
  afterEach(() => {
    Vue.set = oldSet;
  });
  it('updates the state of an event', () => {
    Vue.set = jest.fn((object, property, value) => oldSet(object, property, value));
    mutations.setEventAssessment(state, {id: '1B', assessment: 'confirmed_malicious'});

    expect(state.events[1].latest_assessment).toBe('confirmed_malicious');
    expect(Vue.set).toBeCalled();
  });
  it('updates the collection of events', () => {
    mutations.updateEvents(state, {
      events: [
        {id: '1C', latest_assessment: 'confirmed_benign', foo: 'bar-baz'},
        {id: '1F', latest_assessment: 'probably_benign'},
        {id: '1G', latest_assessment: 'confirmed_benign'},
      ],
    });
    expect(state.events).toStrictEqual([
      {id: '1A', latest_assessment: 'probably_malicious'},
      {id: '1B', latest_assessment: 'probably_benign'},
      {id: '1C', latest_assessment: 'confirmed_benign', foo: 'bar-baz'},
      {id: '1D', latest_assessment: 'probably_malicious'},
      {id: '1E', latest_assessment: 'probably_malicious'},
      {id: '1F', latest_assessment: 'probably_benign'},
      {id: '1G', latest_assessment: 'confirmed_benign'},
    ]);
  });
  it('updates the collection of event ids that are probably malicious', () => {
    mutations.updateProbablyMaliciousEventIds(state, {
      events: [
        {id: '1C', latest_assessment: 'confirmed_benign', foo: 'bar-baz'},
        {id: '1F', latest_assessment: 'probably_benign'},
        {id: '1G', latest_assessment: 'confirmed_benign'},
      ],
    });
    expect(state.probablyMaliciousEventIds).toEqual(['1C', '1F', '1G']);
  });
  it('sets which event is selected', () => {
    mutations.setSelectedEventId(state, '1A');
    expect(state.selectedEventId).toBe('1A');
  });
  it('updates the set of IDs for events associated by mailbox address', () => {
    state = {
      associatedEventIds: {
        '1C': {
          byMailboxAddress: ['7A', '7B', '7C'],
        },
        '1D': {
          byMailboxAddress: ['7A', '7B', '7C'],
        },
      },
    };

    mutations.updateAssociatedByMailboxAddressEventIds(state, {
      mailboxEventId: '1C',
      associatedEvents: [
        {id: '3A'},
        {id: '3B'},
        {id: '3C'},
      ],
    });
    expect(state.associatedEventIds['1C'].byMailboxAddress).toStrictEqual(['3A', '3B', '3C']);
  });
  it('updates the set of IDs for events associated by IP address', () => {
    state = {
      associatedEventIds: {
        '1C': {
          byIpAddress: ['7A', '7B', '7C'],
        },
        '1D': {
          byIpAddress: ['7A', '7B', '7C'],
        },
      },
    };

    mutations.updateAssociatedByIpActorEventIds(state, {
      mailboxEventId: '1C',
      associatedEvents: [
        {id: '3A'},
        {id: '3B'},
        {id: '3C'},
      ],
    });
    expect(state.associatedEventIds['1C'].byIpAddress).toStrictEqual(['3A', '3B', '3C']);
  });

  it('updates the set of IDs for events associated by forward recipient', () => {
    state = {
      associatedEventIds: {
        '1C': {
          byForwardRecipient: ['7A', '7B', '7C'],
        },
        '1D': {
          byForwardRecipient: ['7A', '7B', '7C'],
        },
      },
    };

    mutations.updateAssociatedByForwardRecipientEventIds(state, {
      mailboxEventId: '1C',
      associatedEvents: [
        {id: '3A'},
        {id: '3B'},
        {id: '3C'},
      ],
    });
    expect(state.associatedEventIds['1C'].byForwardRecipient).toStrictEqual(['3A', '3B', '3C']);
  });

  it('initialises the associatedEventIds state for a given mailbox event ID', () => {
    state = {
      associatedEventIds: {
      },
    };

    mutations.initialiseAssociatedEventIds(state, {mailboxEventId: '1C'});
    expect(state.associatedEventIds).toStrictEqual({
      '1C': {
        byForwardRecipient: [],
        byIpAddress: [],
        byMailboxAddress: [],
      },
    });
  });
});
