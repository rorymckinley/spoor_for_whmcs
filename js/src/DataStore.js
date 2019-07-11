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
    this.__getMailboxEvents(this.__buildUrl([['action', 'fetch_probably_malicious_events']]), fn);
  }

  /**
   * Fetches all events associated with the Mailbox Event's mailbox address
   * @param {string} mailboxEventId Id of Mailbox Event
   * @param {function} callback Callback function that will process receivede data
   */
  fetchEventsForMailbox(mailboxEventId, callback) {
    this.__getMailboxEvents(
      this.__buildUrl([['action', 'fetch_events_for_mailbox'], ['mailbox_event_id', mailboxEventId]]),
      callback
    );
  }

  /**
   * Fetches events that share an Ip Actor with the primary Mailbox Event
   * @param {string} mailboxEventId Id of Mailbox Event
   * @param {function} callback Callback function that will process receivede data
   */
  fetchEventsForIpActor(mailboxEventId, callback) {
    this.__getMailboxEvents(
      this.__buildUrl([['action', 'fetch_events_for_ip_actor'], ['mailbox_event_id', mailboxEventId]]),
      callback
    );
  }

  /**
   * Fetches events that share a Forward Recipient with the primary Mailbox Event
   * @param {string} mailboxEventId Id of Mailbox Event
   * @param {function} callback Callback function that will process receivede data
   */
  fetchEventsForForwardRecipient(mailboxEventId, callback) {
    this.__getMailboxEvents(
      this.__buildUrl([['action', 'fetch_events_for_forward_recipient'], ['mailbox_event_id', mailboxEventId]]),
      callback,
    );
  }

  /**
   * Updates a MailboxEvent
   * @param {string} mailboxEventId Id of the Mailbox Event
   * @param {object} data Data to be updated
   * @param {function} callback Callback function that is triggered when the data is successfully received
   */
  updateMailboxEvent(mailboxEventId, data, callback) {
    this.connection.post({
      url: this.__buildUrl([['action', 'update_mailbox_event'], ['mailbox_event_id', mailboxEventId]]),
      dataType: 'json',
      data: {mailbox_event: data, authenticity_token: this.config.authenticityToken},
      success: (data) => callback(data.mailbox_event),
    });
  }

  /**
   * Fetches a MailboxEvent
   * @param {string} mailboxEventId Id of the Mailbox Event
   * @param {function} callback Callback function that is triggered when the data is successfully received
   */
  fetchMailboxEvent(mailboxEventId, callback) {
    this.connection.get({
      url: this.__buildUrl([['action', 'fetch_mailbox_event'], ['mailbox_event_id', mailboxEventId]]),
      dataType: 'json',
      success: (data) => callback(data.mailbox_event),
    });
  }
  /**
   * Fetch mailbox events from WHMCS
   * @param {string} url Url for the WHMCS endpoint
   * @param {function} callback success callback function
   */
  __getMailboxEvents(url, callback) {
    this.connection.get({
      url: url,
      dataType: 'json',
      success: (data) => {
        callback(data.mailbox_events);
      },
    });
  }
  /**
   * Takes an array of arrays representing request URL params and buils a complete url
   * @param {array} params Array of [key,value] arrays
   * @return {string} Complete url
   */
  __buildUrl(params) {
    let url = this.config.requestBase;

    for (const pair of params.concat([['ajax', 'true']])) {
      url = `${url}&${pair[0]}=${pair[1]}`;
    }

    return url;
  }
};

module.exports = DataStore;
