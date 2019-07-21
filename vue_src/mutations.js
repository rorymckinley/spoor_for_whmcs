import Vue from 'vue';

export default {
  initialiseAssociatedEventIds(state, payload) {
    Vue.set(state.associatedEventIds, payload.mailboxEventId, {
      byForwardRecipient: [],
      byIpAddress: [],
      byMailboxAddress: [],
    });
  },
  setEventAssessment(state, payload) {
    const selectedEvent = state.events.filter((event) => event.id == payload.id)[0];
    Vue.set(selectedEvent, 'latest_assessment', payload.assessment);
  },
  updateAssociatedByForwardRecipientEventIds(state, payload) {
    Vue.set(
      state.associatedEventIds[payload.mailboxEventId],
      'byForwardRecipient',
      payload.associatedEvents.map((event) => event.id)
    );
  },
  updateAssociatedByIpActorEventIds(state, payload) {
    Vue.set(
      state.associatedEventIds[payload.mailboxEventId],
      'byIpAddress',
      payload.associatedEvents.map((event) => event.id)
    );
  },
  updateAssociatedByMailboxAddressEventIds(state, payload) {
    Vue.set(
      state.associatedEventIds[payload.mailboxEventId],
      'byMailboxAddress',
      payload.associatedEvents.map((event) => event.id)
    );
  },
  updateEvents(state, payload) {
    for (const event of payload.events) {
      const existingEventIndex = state.events.findIndex((e) => e.id === event.id);
      if (existingEventIndex !== -1) {
        // TODO: Find a way to test that this change is being done in a way that Vue can detect
        state.events.splice(existingEventIndex, 1, event);
      } else {
        state.events.push(event);
      }
    }
  },
  updateProbablyMaliciousEventIds(state, payload) {
    state.probablyMaliciousEventIds = payload.events.map((event) => event.id);
  },
  setSelectedEventId(state, payload) {
    Vue.set(state, 'selectedEventId', payload);
  },
};
