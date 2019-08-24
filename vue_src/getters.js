export default {
  eventsAssociatedByForwardRecipient(state, getters) {
    if (!getters.selectedEventId) {
      return [];
    }
    const selected = getters.selectedEventId;
    if (!state.associatedEventIds[selected] || !state.associatedEventIds[selected].byForwardRecipient) {
      return [];
    } else {
      return state.events.filter((event) => state.associatedEventIds[selected].byForwardRecipient.includes(event.id));
    }
  },
  eventsAssociatedByIpAddress(state, getters) {
    if (!getters.selectedEventId) {
      return [];
    }
    const selected = getters.selectedEventId;
    if (!state.associatedEventIds[selected] || !state.associatedEventIds[selected].byIpAddress) {
      return [];
    } else {
      return state.events.filter((event) => state.associatedEventIds[selected].byIpAddress.includes(event.id));
    }
  },
  eventsAssociatedByMailbox(state, getters) {
    if (!getters.selectedEventId) {
      return [];
    }
    const selected = getters.selectedEventId;
    if (!state.associatedEventIds[selected] || !state.associatedEventIds[selected].byMailboxAddress) {
      return [];
    } else {
      return state.events.filter((event) => state.associatedEventIds[selected].byMailboxAddress.includes(event.id));
    }
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
    return state.selectedEventId;
  },
  selectedEventData(state, getters) {
    if (!getters.selectedEventId) {
      return {};
    } else {
      return state.events.find((event) => event.id === getters.selectedEventId);
    }
  },
  selectedPaneId(state) {
    return state.selectedPaneId;
  },
};
