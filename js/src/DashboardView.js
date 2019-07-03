const DashboardView = class {
  /**
   * @param {object} domAccessor Object that allows access to the DOM e.g. jQuery instance
   */
  constructor(domAccessor) {
    this.domAccessor = domAccessor;
  }

  /**
   * Initialise the dashboard
   * @param {array} events A collection of objects representing MailboxEvents
   */
  init(events) {
    this.__tableRecordHelper({
      table: this.__eventListTable(),
      events: events,
      fields: [
        ['event_time', 'event_time', this.__timeHelper],
        ['type', 'type', this.__typeHelper],
        ['mailbox_address', 'mailbox_address', undefined],
        ['host', 'host'],
      ],
      listeners: {
        click: (event) => {
          return () => {
            this.observer({action: 'show_detail', object_type: 'MailboxEvent', id: event.id});
          };
        },
      },
    });
  }

  /**
   * Add an observer
   * @param {function} observer A function that will notify interested parties of events.
   */
  addObserver(observer) {
    this.observer = observer;
  }

  /**
   * Displays the Mailbox Event detail pane
   * @param {object} eventData Data for the event to be displayed.
   */
  displayMailboxEventDetail(eventData) {
    this.domAccessor('#event_detail_panel').show();
    this.domAccessor('#event_mailbox_associated_events_panel').show();
    this.domAccessor('#event_ip_actor_associated_events_panel').show();
    this.domAccessor('#event_forward_recipient_associated_events_panel').show();

    this.domAccessor('td[event-detail-item="event_time"]').text(this.__timeHelper(eventData.event_time));
    this.domAccessor('td[event-detail-item="type"]').text(this.__typeHelper(eventData.type));
    this.domAccessor('td[event-detail-item="mailbox_address"]').text(eventData.mailbox_address);
    this.domAccessor('td[event-detail-item="host"]').text(eventData.host);

    this.domAccessor('td[event-detail-item="ip_ip_address"]').text(eventData.ip_actor.ip_address);
    this.domAccessor('td[event-detail-item="ip_city"]').text(eventData.ip_actor.city);
    this.domAccessor('td[event-detail-item="ip_country_code"]').text(eventData.ip_actor.country_code);
    this.domAccessor('td[event-detail-item="ip_isp"]').text(eventData.ip_actor.owner.isp);
    this.domAccessor('td[event-detail-item="ip_organisation"]').text(
      eventData.ip_actor.owner.organisation
    );
  }

  /**
   * Displays events associated with the selected Mailbox Event's mailbox address
   * @param {array} events A collection of associated events
   */
  displayMailboxAssociatedEvents(events) {
    this.__mailboxAssociatedEventListPanel().addClass('in');

    this.__tableHelper({
      panel: this.__mailboxAssociatedEventListPanelBody(),
      events: events,
      fields: [
        ['Event Time', 'event_time', 'event_time', this.__timeHelper],
        ['Type', 'type', 'type', this.__typeHelper],
        ['IP Address', 'ip_ip_address', (event) => event.ip_actor.ip_address, undefined],
        ['IP Country Code', 'ip_country_code', (event) => event.ip_actor.country_code, undefined],
      ],
    });
  }

  /**
   * Displays events associated with the selected Mailbox Event's ip actor
   * @param {array} events A collection of associated events
   */
  displayIpActorAssociatedEvents(events) {
    this.__ipActorAssociatedEventListPanel().addClass('in');
    this.__tableHelper({
      panel: this.__ipActorAssociatedEventListPanelBody(),
      events: events,
      fields: [
        ['Event Time', 'event_time', 'event_time', this.__timeHelper],
        ['Type', 'type', 'type', this.__typeHelper],
        ['Mailbox Address', 'mailbox_address', 'mailbox_address', undefined],
      ],
    });
  }

  /**
   * Displays events associated with the selected Mailbox Event's forward recipient
   * @param {array} events A collection of associated events
   */
  displayForwardRecipientAssociatedEvents(events) {
    this.__forwardRecipientAssociatedEventListPanel().addClass('in');
    this.__tableHelper({
      panel: this.__forwardRecipientAssociatedEventListPanelBody(),
      events: events,
      fields: [
        ['Event Time', 'event_time', 'event_time', this.__timeHelper],
        ['Type', 'type', 'type', this.__typeHelper],
        ['Mailbox Address', 'mailbox_address', 'mailbox_address', undefined],
        ['IP Address', 'ip_ip_address', (event) => event.ip_actor.ip_address, undefined],
        ['IP Country Code', 'ip_country_code', (event) => event.ip_actor.country_code, undefined],
      ],
    });
  }
  /**
   * A shortcut to the table containing the event listing
   * @return {object} Accessor for the table that lists the events
   */
  __eventListTable() {
    return this.domAccessor('#event_listing_panel table');
  }

  /**
   * Returns an accessor for the panel containing events associated by Mailbox event
   * @return {object} Accessor for the table that lists the events
   **/
  __mailboxAssociatedEventListPanel() {
    return this.domAccessor('#associated_by_mailbox_content');
  }

  /**
   * Returns an accessor for the body of the accordion panel containing events associated by Mailbox event
   * @return {object} Accessor for the table that lists the events
   **/
  __mailboxAssociatedEventListPanelBody() {
    return this.__mailboxAssociatedEventListPanel().find('.panel-body');
  }
  /**
   * A shortcut to the accordion panel containing the events associated with the primary event's ip actor
   * @return {object} Accessor for the table that lists the events
   */
  __ipActorAssociatedEventListPanel() {
    return this.domAccessor('#associated_by_ip_content');
  }

  /**
   * A shortcut to the body of the accordion panel containing the events associated with the primary event's ip actor
   * @return {object} Accessor for the table that lists the events
   */
  __ipActorAssociatedEventListPanelBody() {
    return this.__ipActorAssociatedEventListPanel().find('.panel-body');
  }

  /**
   * A shortcut to the accordion panel for events related to the forward recipient
   * @return {object} Accessor for the panel
   */
  __forwardRecipientAssociatedEventListPanel() {
    return this.domAccessor('#associated_by_forward_recipient_content');
  }

  /**
   * A shortcut to the body of the accordion panel containing the events associated with the primary event's ip actor
   * @return {object} Accessor for the table that lists the events
   */
  __forwardRecipientAssociatedEventListPanelBody() {
    return this.__forwardRecipientAssociatedEventListPanel().find('.panel-body');
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

  /**
   * Converts a timestamp in seconds since the epoch to a string
   * @param {integer} time Timestamp in seconds since the epoch
   * @return {string} Default output from Date#toString()
   */
  __timeHelper(time) {
    return (new Date(time * 1000)).toString();
  }

  /**
   * Populate a table with a representation of events
   * @param {object} args Arguments object
   */
  __tableRecordHelper(args) {
    const {table, events, fields, listeners} = args;
    for (const event of events) {
      const tr = this.domAccessor('<tr>', {'event-id': event.id});
      for (const fieldData of fields) {
        const [propertyDescription, accessor, display] = fieldData;

        let value = null;
        if (typeof(accessor) == 'function') {
          value = accessor(event);
        } else {
          value = event[accessor];
        }

        let text = null;
        if (typeof(display) == 'function') {
          text = display(value);
        } else {
          text = value;
        }

        tr.append(this.domAccessor('<td>', {
          'event-property': propertyDescription,
        }).text(text));
      }

      if (listeners && listeners.click) {
        tr.click(listeners.click(event));
      }

      table.append(tr);
    }
  }

  /**
   * Populate a table with a representation of events
   * @param {object} args Arguments object
   */
  __tableHelper(args) {
    const {panel, events, fields, listeners} = args;

    const table = this.domAccessor('<table>', {class: 'table'});
    const tableHead = this.domAccessor('<thead>');
    const headerRow = this.domAccessor('<tr>');
    for (const header of fields.map((field) => field[0])) {
      headerRow.append(this.domAccessor('<th>').text(header));
    }
    tableHead.append(headerRow);
    table.append(tableHead);

    const tableBody = this.domAccessor('<tbody>');
    for (const event of events) {
      const tr = this.domAccessor('<tr>', {'event-id': event.id});
      for (const fieldData of fields) {
        const [_, propertyDescription, accessor, display] = fieldData;

        let value = null;
        if (typeof(accessor) == 'function') {
          value = accessor(event);
        } else {
          value = event[accessor];
        }

        let text = null;
        if (typeof(display) == 'function') {
          text = display(value);
        } else {
          text = value;
        }

        tr.append(this.domAccessor('<td>', {
          'event-property': propertyDescription,
        }).text(text));
      }

      if (listeners && listeners.click) {
        tr.click(listeners.click(event));
      }

      tableBody.append(tr);
    }
    table.append(tableBody);
    panel.html(table);
  }
};

module.exports = DashboardView;
