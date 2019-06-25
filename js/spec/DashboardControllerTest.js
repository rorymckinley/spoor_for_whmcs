const DashboardController = require('../src/DashboardController.js');

const dataStore = {
  fetchProbablyMaliciousMailboxEvents: jest.fn(),
};
const dashboardView = {
  init: jest.fn(),
};

const eventsAsData = [
  {
    id: '123ABC',
    host: 'host1.test.com',
    event_time: 1561199081,
    type: 'login',
    mailbox_address: 'hapless@victim.co.za',
    ip_actor: {
      id: '456DEF',
      ip_address: '10.0.0.1',
      city: 'Cape Town',
      country_code: 'ZA',
      owner: {
        isp: 'Foo ISP',
        organisation: 'Bar Corp',
      },
    },
  },
  {
    id: '789',
    host: 'host2.test.com',
    event_time: 1561199090,
    type: 'forward_added',
    mailbox_address: 'unwitting@victim.co.za',
    ip_actor: {
      id: '234ABC',
      ip_address: '10.0.0.2',
      city: 'Reykjavik',
      country_code: 'IS',
      owner: {
        isp: 'Not Foo ISP',
        organisation: 'Not Bar Corp',
      },
    },
  },
];

const dashboardController = new DashboardController(dataStore, dashboardView);

describe('#init', () =>{
  it('has no mailbox events loaded when it is initialised', () => {
    const dc = new DashboardController();
    expect(dc.mailboxEvents).toStrictEqual({probablyMalicious: []});
  });
  it('fetches a list of probably malicious mailbox events', () => {
    dashboardController.init();

    expect(dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls.length).toBe(1);
  });

  it('stores the retrieved events', () => {
    dashboardController.init();

    // trigger the callback that was passed to the datastore
    dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls[0][0](eventsAsData);

    expect(dashboardController.mailboxEvents.probablyMalicious).toBe(eventsAsData);
  });

  it('passes the events to the view to initialise', () => {
    dashboardController.init();

    // trigger the callback that was passed to the datastore
    dataStore.fetchProbablyMaliciousMailboxEvents.mock.calls[0][0](eventsAsData);

    expect(dashboardView.init.mock.calls.length).toBe(1);
    expect(dashboardView.init.mock.calls[0][0]).toStrictEqual(eventsAsData);
  });
});