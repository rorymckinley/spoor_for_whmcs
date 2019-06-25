const DataStore = require('../src/DataStore.js');

const mockFunction = jest.fn();

const MailboxEvent = class {
  constructor(args) { // eslint-disable-line require-jsdoc
    this.id = args.id;
  }
};

const connection = {
  get: mockFunction,
};

describe('.fetchProbablyMaliciousMailboxEvents', () => {
  beforeEach(() => {
    mockFunction
      .mockReturnValueOnce({mailboxEvents: [
        {id: 1}, {id: 2},
      ]});
  });

  test('it connects to the WHMCS backend to get mailbox events', () =>{
    const dataStore = new DataStore(connection, {requestBase: '/foo/admin/addonmodules.php?module=spoor'});

    dataStore.fetchProbablyMaliciousMailboxEvents(() => null);

    expect(mockFunction.mock.calls.length).toBe(1);
    const connectionArgs = mockFunction.mock.calls[0][0];
    expect(connectionArgs.url).toBe(
      '/foo/admin/addonmodules.php?module=spoor&action=fetch_probably_malicious_events&ajax=true'
    );
    expect(connectionArgs.dataType).toBe('json');
  });

  test('it can fetch a list of mailbox events that are probably malicious', () => {
    const dataStore = new DataStore(connection, {request_base: '/foo/admin/addonmodules.php?module=spoor'});
    const events = [];

    dataStore.fetchProbablyMaliciousMailboxEvents((argSets) => {
      for (const argSet of argSets) {
        events.push(new MailboxEvent(argSet));
      }
    });

    // Trigger the callback when data is received
    mockFunction.mock.calls[0][0].success({
      mailboxEvents: [{id: 1}, {id: 2}],
    });
    expect(events.length).toBe(2);
    expect(events[0].id).toBe(1);
    expect(events[1].id).toBe(2);
  });
});

