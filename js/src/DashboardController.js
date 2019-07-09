const DashboardController = class {
  /**
   * @param {object} dataStore The datastore used to fetch and save data
   * @param {object} view The view used to interact with the DOM for the dashboard
   */
  constructor(dataStore, view) {
    this.dataStore = dataStore;
    this.view = view;
    this.view.addObserver(this.__viewObserver.bind(this));
    this.mailboxEvents = [];
  }
  /**
   * Sets initial state of Dashboard
   */
  init() {
    this.dataStore.fetchProbablyMaliciousMailboxEvents((events) => {
      this.mailboxEvents = events;
      this.view.init(events);
    });
  }

  /**
   * Parses event data from a view and takes the necessry action
   * @param {object} viewEventData An obect describing the nature of the event
   */
  __viewObserver(viewEventData) {
    switch (viewEventData.action) {
      case 'show_detail':
        const selectedEvent = this.mailboxEvents.filter((event) => event.id == viewEventData.id)[0];

        this.view.displayMailboxEventDetail(selectedEvent);

        this.dataStore.fetchEventsForMailbox(
          viewEventData.id, (events) => this.view.displayMailboxAssociatedEvents(events)
        );

        this.dataStore.fetchEventsForIpActor(
          viewEventData.id, (events) => this.view.displayIpActorAssociatedEvents(events)
        );

        this.dataStore.fetchEventsForForwardRecipient(
          viewEventData.id, (events) => this.view.displayForwardRecipientAssociatedEvents(events)
        );
        break;
      case 'update_mailbox_event':
        this.view.disableInputOnEventDetail(viewEventData.id, 'update_in_progress');

        this.dataStore.updateMailboxEvent(viewEventData.id, viewEventData.data, (eventData) => {
          this.view.displayMailboxEventDetail(eventData);
        });
        break;
    }
  }
};

module.exports = DashboardController;
