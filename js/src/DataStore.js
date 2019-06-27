const DataStore = class {
  /**
   * @param {object} connection An object that can be used to connect to the backend (e.g. jQuery)
   * @param {object} config An object that stores config parameters
   */
  constructor(connection, config) {
    this.connection = connection;
    this.config = config;
  }
  /**
   * Fetch all MailboxEvents that are classified as 'probably malicious`
   * @param {function} fn Callback function that will process the response
   */
  fetchProbablyMaliciousMailboxEvents(fn) {
    this.connection.get({
      url: `${this.config.requestBase}&action=fetch_probably_malicious_events&ajax=true`,
      dataType: 'json',
      success: (data) => {
        fn(data.mailboxEvents);
      },
    });
  }
};

module.exports = DataStore;
