export default {
  events: [],
  associatedEventIds: {
  },
  panes: [
    {
      id: 'probably_malicious',
      title: 'Probably Malicious',
      seedAction: ['fetchProbablyMaliciousEvents', {}],
      viewKey: 'probablyMaliciousEventIds',
      selectedEventId: null,
    },
    {
      id: 'confirmed_malicious',
      title: 'Confirmed Malicious',
      seedAction: ['fetchConfirmedMaliciousEvents', {}],
      viewKey: 'confirmedMaliciousEventIds',
      selectedEventId: null,
    },
  ],
  paneViews: {
    probablyMaliciousEventIds: [],
    confirmedMaliciousEventIds: [],
  },
  selectedPaneId: 'probably_malicious',
};
