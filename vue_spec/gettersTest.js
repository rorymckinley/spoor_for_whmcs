import getters from '../vue_src/getters';

describe('getters', () => {
  it('returns events that are in the list of probably malicious events', () => {
    const state = {
      events: [
        {id: '1A', latest_assessment: 'probably_malicious'},
        {id: '1B', latest_assessment: 'probably_benign'},
        {id: '1C', latest_assessment: 'probably_benign'},
        {id: '1D', latest_assessment: 'probably_malicious'},
        {id: '1E', latest_assessment: 'probably_malicious'},
      ],
      probablyMaliciousEventIds: ['1A', '1D'],
    };

    const events = getters.probablyMaliciousEvents(state);
    expect(events).toStrictEqual([
      {id: '1A', latest_assessment: 'probably_malicious'},
      {id: '1D', latest_assessment: 'probably_malicious'},
    ]);
  });
  it('returns the id of the selected event', () => {
    const state = {
      selectedEventId: '1C',
    };
    expect(getters.selectedEventId(state)).toBe('1C');
  });
  describe('selectedEventData', () => {
    it('returns the data for the selected event', () => {
      const state = {
        events: [
          {id: '1A', latest_assessment: 'probably_malicious'},
          {id: '1B', latest_assessment: 'probably_benign'},
          {id: '1C', latest_assessment: 'probably_benign'},
          {id: '1D', latest_assessment: 'probably_malicious'},
          {id: '1E', latest_assessment: 'probably_malicious'},
        ],
        selectedEventId: '1C',
      };
      getters.selectedEventId = '1C';

      expect(getters.selectedEventData(state, {selectedEventId: '1C'})).toStrictEqual(
        {id: '1C', latest_assessment: 'probably_benign'}
      );
    });
    it('returns an empty object if there is no selected event', () => {
      expect(getters.selectedEventData({}, {})).toStrictEqual({});
      expect(getters.selectedEventData({}, {selectedEventId: null})).toStrictEqual({});
    });
  });
  describe('eventsAssociatedByMailbox', () =>{
    it('returns the events that are associated by mailbox address to the currently selected event', () => {
      const state = {
        events: [
          {id: '1A', latest_assessment: 'probably_malicious'},
          {id: '1B', latest_assessment: 'probably_benign'},
          {id: '1C', latest_assessment: 'probably_benign'},
          {id: '1D', latest_assessment: 'probably_malicious'},
          {id: '1E', latest_assessment: 'probably_malicious'},
          {id: '1F', latest_assessment: 'confirmed_malicious'},
          {id: '1G', latest_assessment: 'confirmed_malicious'},
          {id: '1H', latest_assessment: 'confirmed_malicious'},
        ],
        associatedEventIds: {
          '1C': {
            byMailboxAddress: ['1A', '1B'],
            byIpAddress: ['1D', '1E'],
            byForwardRecipient: ['1F', '1G'],
          },
          '1D': {
            byMailboxAddress: ['1G', '1H'],
            byIpAddress: ['1A', '1B'],
            byForwardRecipient: ['1C', '1G'],
          },
        },
        selectedEventId: '1C',
      };
      // TODO: This bleeds out implementation - find a better way when you have the luxury of time
      getters.selectedEventId = '1C';

      expect(getters.eventsAssociatedByMailbox(state, getters)).toStrictEqual([
        {id: '1A', latest_assessment: 'probably_malicious'},
        {id: '1B', latest_assessment: 'probably_benign'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not properly set up', () => {
      getters.selectedEventId = '1C';
      expect(getters.eventsAssociatedByMailbox({events: [{}], associatedEventIds: {}}, getters)).toEqual([]);
      expect(getters.eventsAssociatedByMailbox({events: [{}], associatedEventIds: {'1C': {}}}, getters)).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      getters.selectedEventId = null;
      expect(getters.eventsAssociatedByMailbox({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
      getters.selectedEventId = undefined;
      expect(getters.eventsAssociatedByMailbox({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
    });
  });
  describe('eventsAssociatedByIpAddress', () =>{
    it('returns the events that are associated by ip address to the currently selected event', () => {
      const state = {
        events: [
          {id: '1A', latest_assessment: 'probably_malicious'},
          {id: '1B', latest_assessment: 'probably_benign'},
          {id: '1C', latest_assessment: 'probably_benign'},
          {id: '1D', latest_assessment: 'probably_malicious'},
          {id: '1E', latest_assessment: 'probably_malicious'},
          {id: '1F', latest_assessment: 'confirmed_malicious'},
          {id: '1G', latest_assessment: 'confirmed_malicious'},
          {id: '1H', latest_assessment: 'confirmed_malicious'},
        ],
        associatedEventIds: {
          '1C': {
            byMailboxAddress: ['1A', '1B'],
            byIpAddress: ['1D', '1E'],
            byForwardRecipient: ['1F', '1G'],
          },
          '1D': {
            byMailboxAddress: ['1G', '1H'],
            byIpAddress: ['1A', '1B'],
            byForwardRecipient: ['1C', '1G'],
          },
        },
        selectedEventId: '1C',
      };
      // TODO: This bleeds out implementation - find a better way when you have the luxury of time
      getters.selectedEventId = '1C';

      expect(getters.eventsAssociatedByIpAddress(state, getters)).toStrictEqual([
        {id: '1D', latest_assessment: 'probably_malicious'},
        {id: '1E', latest_assessment: 'probably_malicious'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not propperly set up', () => {
      getters.selectedEventId = '1C';
      expect(getters.eventsAssociatedByIpAddress({events: [{}], associatedEventIds: {}}, getters)).toEqual([]);
      expect(getters.eventsAssociatedByIpAddress({events: [{}], associatedEventIds: {'1C': {}}}, getters)).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      getters.selectedEventId = null;
      expect(getters.eventsAssociatedByIpAddress({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
      getters.selectedEventId = undefined;
      expect(getters.eventsAssociatedByIpAddress({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
    });
  });
  describe('eventsAssociatedByForwardRecipient', () =>{
    it('returns the events that are associated by forward recipient to the currently selected event', () => {
      const state = {
        events: [
          {id: '1A', latest_assessment: 'probably_malicious'},
          {id: '1B', latest_assessment: 'probably_benign'},
          {id: '1C', latest_assessment: 'probably_benign'},
          {id: '1D', latest_assessment: 'probably_malicious'},
          {id: '1E', latest_assessment: 'probably_malicious'},
          {id: '1F', latest_assessment: 'confirmed_malicious'},
          {id: '1G', latest_assessment: 'confirmed_malicious'},
          {id: '1H', latest_assessment: 'confirmed_malicious'},
        ],
        associatedEventIds: {
          '1C': {
            byMailboxAddress: ['1A', '1B'],
            byIpAddress: ['1D', '1E'],
            byForwardRecipient: ['1F', '1G'],
          },
          '1D': {
            byMailboxAddress: ['1G', '1H'],
            byIpAddress: ['1A', '1B'],
            byForwardRecipient: ['1C', '1G'],
          },
        },
        selectedEventId: '1C',
      };
      // TODO: This bleeds out implementation - find a better way when you have the luxury of time
      getters.selectedEventId = '1C';

      expect(getters.eventsAssociatedByForwardRecipient(state, getters)).toStrictEqual([
        {id: '1F', latest_assessment: 'confirmed_malicious'},
        {id: '1G', latest_assessment: 'confirmed_malicious'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not propperly set up', () => {
      getters.selectedEventId = '1C';
      expect(getters.eventsAssociatedByForwardRecipient({events: [{}], associatedEventIds: {}}, getters)).toEqual([]);
      expect(
        getters.eventsAssociatedByForwardRecipient({events: [{}], associatedEventIds: {'1C': {}}}, getters)
      ).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      getters.selectedEventId = null;
      expect(getters.eventsAssociatedByForwardRecipient({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
      getters.selectedEventId = undefined;
      expect(getters.eventsAssociatedByForwardRecipient({associatedEventIds: {}, events: [{}]}, getters)).toEqual([]);
    });
  });
});
