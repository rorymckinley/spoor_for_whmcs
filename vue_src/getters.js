export default {
  eventsAssociatedByForwardRecipient(state) {
    return (selectedMailboxEventId) => {
      if (
        !state.associatedEventIds[selectedMailboxEventId] ||
        !state.associatedEventIds[selectedMailboxEventId].byForwardRecipient
      ) {
        return [];
      } else {
        return state.events.filter((event) => {
          return state.associatedEventIds[selectedMailboxEventId].byForwardRecipient.includes(event.id);
        });
      }
    };
  },
  eventsAssociatedByIpAddress(state) {
    return (selectedMailboxEventId) => {
      if (
        !state.associatedEventIds[selectedMailboxEventId] ||
        !state.associatedEventIds[selectedMailboxEventId].byIpAddress
      ) {
        return [];
      } else {
        return state.events.filter((event) => {
          return state.associatedEventIds[selectedMailboxEventId].byIpAddress.includes(event.id);
        });
      }
    };
  },
  eventsAssociatedByMailbox(state) {
    return (selectedMailboxEventId) => {
      if (
        !state.associatedEventIds[selectedMailboxEventId] ||
        !state.associatedEventIds[selectedMailboxEventId].byMailboxAddress
      ) {
        return [];
      } else {
        return state.events.filter((event) => {
          return state.associatedEventIds[selectedMailboxEventId].byMailboxAddress.includes(event.id);
        });
      }
    };
  },
  panes(state) {
    return state.panes;
  },
  paneViewEvents(state) {
    return (paneViewKey) => state.events.filter((event) => state.paneViews[paneViewKey].includes(event.id));
  },
  probablyMaliciousEvents(state) {
    return state.events.filter((event) => state.probablyMaliciousEventIds.includes(event.id));
  },
  selectedEventId(state) {
    return (paneId) => {
      const pane = state.panes.filter((pane) => pane.id == paneId)[0];
      return pane.selectedEventId;
    };
  },
  selectedEventData(state, getters) {
    return (paneId) => {
      const selectedEventId = getters.selectedEventId(paneId);
      if (!selectedEventId) {
        return {};
      } else {
        return state.events.find((event) => event.id === selectedEventId);
      }
    };
  },
  selectedPaneId(state) {
    return state.selectedPaneId;
  },
};
