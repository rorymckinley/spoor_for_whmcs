const DataStore = require('../src/DataStore.js');
const dssh = require('./DataStoreSpecHelper');

const MailboxEvent = class {
  constructor(args) { // eslint-disable-line require-jsdoc
    this.id = args.id;
  }
};

const connection = {
  get: jest.fn(),
};

const config = {requestBase: '/foo/admin/addonmodules.php?module=spoor'};
const dataStore = new DataStore(connection, config);

describe('.fetchProbablyMaliciousMailboxEvents', () => {
  test('it connects to the WHMCS backend to get mailbox events', () =>{
    dataStore.fetchProbablyMaliciousMailboxEvents(() => null);

    expect(connection.get.mock.calls.length).toBe(1);
    const connectionArgs = connection.get.mock.calls[0][0];
    dssh.validateUrl(config.requestBase, [['action', 'fetch_probably_malicious_events']], connectionArgs.url);
    expect(connectionArgs.dataType).toBe('json');
  });

  test('it can fetch a list of mailbox events that are probably malicious', () => {
    const events = [];

    dataStore.fetchProbablyMaliciousMailboxEvents((argSets) => {
      for (const argSet of argSets) {
        events.push(new MailboxEvent(argSet));
      }
    });

    // Trigger the callback when data is received
    connection.get.mock.calls[0][0].success({
      mailboxEvents: [{id: 1}, {id: 2}],
    });
    expect(events.length).toBe(2);
    expect(events[0].id).toBe(1);
    expect(events[1].id).toBe(2);
  });
});

describe('#fetchEventsForMailbox', () => {
  test('it connects to the WHMCS backend to get events associated with the mailbox', () => {
    dataStore.fetchEventsForMailbox('123ABC', () => null);

    expect(connection.get.mock.calls.length).toBe(1);
    const connectionArgs = connection.get.mock.calls[0][0];
    dssh.validateUrl(
      config.requestBase,
      [
        ['action', 'fetch_events_for_mailbox'],
        ['mailbox_event_id', '123ABC'],
      ],
      connectionArgs.url
    );
    expect(connectionArgs.dataType).toBe('json');
  });

  test('fetched events are passed to the callback', () => {
    const returnedEvents = [{id: 1}, {id: 2}];
    let events = null;

    dataStore.fetchEventsForMailbox('123ABC', (data) => {
      events = data;
    });

    connection.get.mock.calls[0][0].success({mailboxEvents: returnedEvents});
    expect(events).toStrictEqual(returnedEvents);
  });
});

describe('#fetchEventsForIpActor', () => {
  test('connects to the WHMCS backend to get events associated with the IP actor', () => {
    dataStore.fetchEventsForIpActor('123ABC', () => null);

    expect(connection.get.mock.calls.length).toBe(1);
    const connectionArgs = connection.get.mock.calls[0][0];
    dssh.validateUrl(
      config.requestBase,
      [
        ['action', 'fetch_events_for_ip_actor'],
        ['mailbox_event_id', '123ABC'],
      ],
      connectionArgs.url
    );
    expect(connectionArgs.dataType).toBe('json');
  });

  test('passes fetched events to the callback', () => {
    const returnedEvents = [{id: 1}, {id: 2}];
    let events = null;

    dataStore.fetchEventsForIpActor('123ABC', (data) => {
      events = data;
    });

    connection.get.mock.calls[0][0].success({mailboxEvents: returnedEvents});
    expect(events).toStrictEqual(returnedEvents);
  });
});

describe('#fetchEventsForForwardRecipient', () => {
  test('connects to the backend to get events associated with the forward recipient', () => {
    dataStore.fetchEventsForForwardRecipient('123ABC', () => null);

    expect(connection.get.mock.calls.length).toBe(1);
    const connectionArgs = connection.get.mock.calls[0][0];
    dssh.validateUrl(
      config.requestBase,
      [
        ['action', 'fetch_events_for_forward_recipient'],
        ['mailbox_event_id', '123ABC'],
      ],
      connectionArgs.url
    );
    expect(connectionArgs.dataType).toBe('json');
  });

  test('passes fetched events to the callback', () => {
    const returnedEvents = [{id: 1}, {id: 2}];
    let events = null;

    dataStore.fetchEventsForForwardRecipient('123ABC', (data) => {
      events = data;
    });

    connection.get.mock.calls[0][0].success({mailboxEvents: returnedEvents});
    expect(events).toStrictEqual(returnedEvents);
  });
});
