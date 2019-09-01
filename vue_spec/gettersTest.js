import getters from '../vue_src/getters';

describe('getters', () => {
  it('returns events that are referenced by the IDs in the specified view pane in the order specified', () => {
    const state = {
      events: [
        {id: '1A', latest_assessment: 'probably_malicious'},
        {id: '1B', latest_assessment: 'probably_benign'},
        {id: '1C', latest_assessment: 'probably_benign'},
        {id: '1D', latest_assessment: 'probably_malicious'},
        {id: '1E', latest_assessment: 'probably_malicious'},
      ],
      paneViews: {
        specifiedEventIds: ['1E', '1D', '1A'],
        otherEventIds: ['1B', '1C'],
      },
    };

    const events = getters.paneViewEvents(state)('specifiedEventIds');
    expect(events).toStrictEqual([
      {id: '1E', latest_assessment: 'probably_malicious'},
      {id: '1D', latest_assessment: 'probably_malicious'},
      {id: '1A', latest_assessment: 'probably_malicious'},
    ]);
  });
  it('returns the id of the selected event', () => {
    const state = {
      panes: [
        {id: 'foo', selectedEventId: '1C'},
        {id: 'bar', selectedEventId: '1E'},
      ],
    };
    expect(getters.selectedEventId(state)('foo')).toBe('1C');
  });
  describe('selectedEventData', () => {
    const paneId = 'foo';
    it('returns the data for the selected event', () => {
      const state = {
        events: [
          {id: '1A', latest_assessment: 'probably_malicious'},
          {id: '1B', latest_assessment: 'probably_benign'},
          {id: '1C', latest_assessment: 'probably_benign'},
          {id: '1D', latest_assessment: 'probably_malicious'},
          {id: '1E', latest_assessment: 'probably_malicious'},
        ],
        panes: [
          {id: 'foo', selectedEventId: '1C'},
          {id: 'bar', selectedEventId: '1E'},
        ],
      };
      const mockGetters = {
        selectedEventId: (paneId) => {
          let id = null;
          if (paneId === 'foo') {
            id = state.panes[0].selectedEventId;
          }
          return id;
        },
      };

      expect(getters.selectedEventData(state, mockGetters)(paneId)).toStrictEqual(
        {id: '1C', latest_assessment: 'probably_benign'}
      );
    });
    it('returns an empty object if there is no selected event', () => {
      expect(getters.selectedEventData({}, {selectedEventId: () => undefined})(paneId)).toStrictEqual({});
      expect(getters.selectedEventData({}, {selectedEventId: () => null})(paneId)).toStrictEqual({});
    });
  });
  describe('eventsAssociatedByMailbox', () =>{
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
          byMailboxAddress: ['1B', '1A'],
          byIpAddress: ['1D', '1E'],
          byForwardRecipient: ['1F', '1G'],
        },
        '1D': {
          byMailboxAddress: ['1G', '1H'],
          byIpAddress: ['1A', '1B'],
          byForwardRecipient: ['1C', '1G'],
        },
      },
    };

    it('returns events associated by mailbox address with the specified event in the order specified', () => {
      expect(getters.eventsAssociatedByMailbox(state)('1C')).toStrictEqual([
        {id: '1B', latest_assessment: 'probably_benign'},
        {id: '1A', latest_assessment: 'probably_malicious'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not properly set up', () => {
      expect(getters.eventsAssociatedByMailbox({events: [{}], associatedEventIds: {}})('1C')).toEqual([]);
      expect(getters.eventsAssociatedByMailbox({events: [{}], associatedEventIds: {'1C': {}}})('1C')).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      expect(getters.eventsAssociatedByMailbox(state)(null)).toEqual([]);
      expect(getters.eventsAssociatedByMailbox(state)(undefined)).toEqual([]);
    });
  });
  describe('eventsAssociatedByIpAddress', () =>{
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
          byIpAddress: ['1E', '1D'],
          byForwardRecipient: ['1F', '1G'],
        },
        '1D': {
          byMailboxAddress: ['1G', '1H'],
          byIpAddress: ['1A', '1B'],
          byForwardRecipient: ['1C', '1G'],
        },
      },
    };

    it('returns events associated by ip address with the specified event in the order specified', () => {
      expect(getters.eventsAssociatedByIpAddress(state)('1C')).toStrictEqual([
        {id: '1E', latest_assessment: 'probably_malicious'},
        {id: '1D', latest_assessment: 'probably_malicious'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not propperly set up', () => {
      expect(getters.eventsAssociatedByIpAddress({events: [{}], associatedEventIds: {}})('1C')).toEqual([]);
      expect(getters.eventsAssociatedByIpAddress({events: [{}], associatedEventIds: {'1C': {}}})('1C')).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      expect(getters.eventsAssociatedByIpAddress(state)(null)).toEqual([]);
      expect(getters.eventsAssociatedByIpAddress(state)(undefined)).toEqual([]);
    });
  });
  describe('eventsAssociatedByForwardRecipient', () =>{
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
          byForwardRecipient: ['1G', '1F'],
        },
        '1D': {
          byMailboxAddress: ['1G', '1H'],
          byIpAddress: ['1A', '1B'],
          byForwardRecipient: ['1C', '1G'],
        },
      },
    };

    it('returns events associated by forward recipient with the specified event in the order specified', () => {
      expect(getters.eventsAssociatedByForwardRecipient(state)('1C')).toStrictEqual([
        {id: '1G', latest_assessment: 'confirmed_malicious'},
        {id: '1F', latest_assessment: 'confirmed_malicious'},
      ]);
    });
    it('returns an empty array if the associated event ids structure is not propperly set up', () => {
      expect(getters.eventsAssociatedByForwardRecipient({events: [{}], associatedEventIds: {}})('1C')).toEqual([]);
      expect(
        getters.eventsAssociatedByForwardRecipient({events: [{}], associatedEventIds: {'1C': {}}})('1C')
      ).toEqual([]);
    });
    it('returns an empty array if there is no event selected', () => {
      expect(getters.eventsAssociatedByForwardRecipient(state)(null)).toEqual([]);
      expect(getters.eventsAssociatedByForwardRecipient(state)(undefined)).toEqual([]);
    });
  });
  describe('panes', () => {
    it('returns the panes', () => {
      const state = {
        panes: [{id: 'foo'}],
      };
      expect(getters.panes(state)).toStrictEqual(state.panes);
    });
  });
  describe('selectedPaneId', () => {
    it('returns the slected pane id', () => {
      const state = {
        selectedPaneId: 'foo-bar',
      };
      expect(getters.selectedPaneId(state)).toStrictEqual(state.selectedPaneId);
    });
  });
});
