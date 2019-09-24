export default {
  events: [],
  associatedEventIds: {
  },
  panes: [
    {
      id: 'probably_malicious',
      title: 'Probably Malicious',
      seedAction: ['fetchProbablyMaliciousEvents', {}],
      viewKey: 'probablyMaliciousEvents',
      selectedEventId: null,
    },
    {
      id: 'confirmed_malicious',
      title: 'Confirmed Malicious',
      seedAction: ['fetchConfirmedMaliciousEvents', {}],
      viewKey: 'confirmedMaliciousEvents',
      selectedEventId: null,
    },
  ],
  paneViews: {
    probablyMaliciousEvents: {
      ids: [],
      metadata: {},
    },
    confirmedMaliciousEvents: {
      ids: [],
      metadata: {},
    },
  },
  recordsPerPage: 5,
  selectedPaneId: 'probably_malicious',
};
