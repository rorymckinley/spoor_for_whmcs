export default {
  events: [],
  probablyMaliciousEventIds: [],
  selectedEventId: null,
  associatedEventIds: {
  },
  panes: [
    {id: 'probably_malicious', title: 'Probably Malicious', seedAction: ['fetchProbablyMaliciousEvents']},
    {id: 'other', title: 'Other', seedAction: ['fetchProbablyMaliciousEvents']},
  ],
  selectedPaneId: 'probably_malicious',
};
