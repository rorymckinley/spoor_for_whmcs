export default {
  events: [],
  probablyMaliciousEventIds: [],
  selectedEventId: null,
  associatedEventIds: {
  },
  panes: [
    {
      id: 'probably_malicious',
      title: 'Probably Malicious',
      seedAction: ['fetchProbablyMaliciousEvents', {}],
      viewKey: 'probablyMaliciousEventIds',
    },
    {
      id: 'confirmed_malicious',
      title: 'Confirmed Malicious',
      seedAction: ['fetchConfirmedMaliciousEvents', {}],
      viewKey: 'confirmedMaliciousEventIds',
    },
  ],
  paneViews: {
    probablyMaliciousEventIds: [],
    confirmedMaliciousEventIds: [],
  },
  selectedPaneId: 'probably_malicious',
};
