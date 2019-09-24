export default {
  eventsAssociatedByForwardRecipient(state) {
    return (selectedMailboxEventId) => {
      if (
        !state.associatedEventIds[selectedMailboxEventId] ||
        !state.associatedEventIds[selectedMailboxEventId].byForwardRecipient
      ) {
        return [];
      } else {
        return state.associatedEventIds[selectedMailboxEventId].byForwardRecipient.map(
          (associatedEventId) => state.events.find((event) => event.id === associatedEventId)
        );
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
        return state.associatedEventIds[selectedMailboxEventId].byIpAddress.map(
          (associatedEventId) => state.events.find((event) => event.id === associatedEventId)
        );
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
        return state.associatedEventIds[selectedMailboxEventId].byMailboxAddress.map(
          (associatedEventId) => state.events.find((event) => event.id === associatedEventId)
        );
      }
    };
  },
  panes(state) {
    return state.panes;
  },
  paneViewEvents(state) {
    return (paneViewKey) => {
      return state.paneViews[paneViewKey].ids.map(
        (paneEventId) => state.events.find((event) => event.id === paneEventId)
      );
    };
  },
  paneViewMetadata(state) {
    return (paneViewKey) => {
      return state.paneViews[paneViewKey].metadata;
    };
  },
  recordsPerPage(state) {
    return state.recordsPerPage;
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
