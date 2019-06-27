const DashboardController = class {
  /**
   * @param {object} datastore The datastore used to fetch and save data
   * @param {object} view The view used to interact with the DOM for the dashboard
   */
  constructor(datastore, view) {
    this.datastore = datastore;
    this.view = view;
    this.mailboxEvents = {probablyMalicious: []};
  }
  /**
   * Sets initial state of Dashboard
   */
  init() {
    this.datastore.fetchProbablyMaliciousMailboxEvents((events) => {
      this.mailboxEvents.probablyMalicious = events;
      this.view.init(events);
    });
  }
};

module.exports = DashboardController;
