const DashboardView = class {
  /**
   * @param {object} domAccessor Object that allows access to the DOM e.g. jQuery instance
   * @param {function} observer A function that will notify interested parties of events.
   */
  constructor(domAccessor, observer) {
    this.domAccessor = domAccessor;
    this.observer = observer;
  }

  /**
   * Initialise the dashboard
   * @param {array} events A collection of objects representing MailboxEvents
   */
  init(events) {
    for (const event of events) {
      const tr = this.domAccessor('<tr>', {'event-id': event.id});
      tr.append(this.domAccessor('<td>', {
        'event-property': 'event_time',
      }).text((new Date(event.event_time * 1000)).toString()));
      tr.append(this.domAccessor('<td>', {
        'event-property': 'type',
      }).text(this.__typeHelper(event.type)));
      tr.append(this.domAccessor('<td>', {
        'event-property': 'mailbox_address',
      }).text(event.mailbox_address));
      tr.append(this.domAccessor('<td>', {
        'event-property': 'host',
      }).text(event.host));
      tr.click(() => {
        this.observer({action: 'show_detail', object_type: 'MailboxEvent', id: event.id});
      });
      this.__eventListTable().append(tr);
    }
  }

  /**
   * A shortcut to the table containing the event listing
   * @return {object} Accessor for the table that lists the events
   */
  __eventListTable() {
    return this.domAccessor('#event_listing_panel table');
  }

  /**
   * @param {string} type Snake-cased type
   * @return {string} Converted event type suitable for display
   */
  __typeHelper(type) {
    // TODO: When the time comes, this should be extracted to a helper module/class
    let output = null;
    switch (type) {
      case 'login':
        output = 'Login';
        break;
      case 'forward_added':
        output = 'Forward Added';
        break;
      case 'forward_removed':
        output = 'Forward Removed';
        break;
    };
    return output;
  }
};

module.exports = DashboardView;
